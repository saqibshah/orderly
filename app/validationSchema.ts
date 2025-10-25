import { z } from "zod";

export const shopifyOrderSchema = z.object({
  order_number: z.number(),
  created_at: z.string(), // will convert to Date
  total_price: z.string(), // Shopify sends as string

  customer: z
    .object({
      first_name: z.string().nullable().optional(),
      last_name: z.string().nullable().optional(),
    })
    .optional(),

  shipping_address: z
    .object({
      address1: z.string().optional(),
      city: z.string().optional(),
    })
    .optional(),

  line_items: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
    })
  ),

  fulfillments: z
    .array(
      z.object({
        tracking_number: z.string().optional(),
        tracking_company: z.string().optional(),
      })
    )
    .optional(),
});

export const verifyReturnSchema = z.object({
  tracking: z.string(),
});
