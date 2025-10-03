import { z } from "zod";

export const createOrderSchema = z.object({
  tracking: z.string().min(1, "Tracking number is required"),
  orderNumber: z.number().int("Order number must be an integer"),
  status: z
    .enum(["PENDING", "DELIVERED", "RETURNED", "CANCELLED"])
    .default("PENDING"),
  courierStatus: z.string().default("Booked"),
  orderDate: z.coerce.date(),
  address: z.string().min(1, "Address is required"),
  updatedAt: z.coerce.date().optional().nullable(),
  concludedAt: z.coerce.date().optional().nullable(),
  customerName: z.string().min(1, "Customer name is required"),
  productOrdered: z.string().min(1, "Product ordered is required"),
  orderAmount: z.coerce.number().nonnegative(),
  remarks: z.array(z.string()).optional().default([]),
  rawPayload: z.unknown().optional(),
});

export const shopifyOrderSchema = z.object({
  order_number: z.number(),
  created_at: z.string(), // will convert to Date
  total_price: z.string(), // Shopify sends as string

  customer: z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
  }),

  shipping_address: z
    .object({
      address1: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
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
      })
    )
    .optional(),
});

export const verifyReturnSchema = z.object({
  tracking: z.string(),
});
