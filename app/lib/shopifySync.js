// /lib/shopifySync.js
export async function markOrderAsPaidOnShopify(shopifyOrderId, accessToken) {
  const endpoint = process.env.SHOPIFY_ENDPOINT;

  const query = `
    mutation orderMarkAsPaid($input: OrderMarkAsPaidInput!) {
      orderMarkAsPaid(input: $input) {
        userErrors {
          field
          message
        }
        order {
          id
          name
          displayFinancialStatus
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const body = JSON.stringify({
    query,
    variables: {
      input: { id: shopifyOrderId },
    },
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body,
  });

  const result = await response.json();

  if (result.data?.orderMarkAsPaid?.userErrors?.length) {
    console.error("Shopify API error:", result.data.orderMarkAsPaid.userErrors);
    throw new Error(result.data.orderMarkAsPaid.userErrors[0].message);
  }

  return result.data?.orderMarkAsPaid?.order || null;
}

export async function cancelOrderOnShopify(shopifyOrderId, accessToken) {
  const endpoint = process.env.SHOPIFY_ENDPOINT;

  const query = `
    mutation OrderCancel(
      $orderId: ID!,
      $notifyCustomer: Boolean,
      $refundMethod: OrderCancelRefundMethodInput!,
      $restock: Boolean!,
      $reason: OrderCancelReason!,
      $staffNote: String
    ) {
      orderCancel(
        orderId: $orderId,
        notifyCustomer: $notifyCustomer,
        refundMethod: $refundMethod,
        restock: $restock,
        reason: $reason,
        staffNote: $staffNote
      ) {
        job {
          id
          done
        }
        orderCancelUserErrors {
          field
          message
          code
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const body = JSON.stringify({
    query,
    variables: {
      orderId: shopifyOrderId,
      notifyCustomer: true,
      refundMethod: { originalPaymentMethodsRefund: true },
      restock: true,
      reason: "CUSTOMER",
      staffNote: "Customer returned the order.",
    },
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body,
  });

  const result = await response.json();

  // Handle user errors gracefully
  const errors =
    result.data?.orderCancel?.orderCancelUserErrors ||
    result.data?.orderCancel?.userErrors ||
    [];

  if (errors.length) {
    console.error("Shopify orderCancel error:", errors);
    throw new Error(errors[0].message || "Shopify orderCancel failed");
  }

  return result.data?.orderCancel?.job || null;
}
