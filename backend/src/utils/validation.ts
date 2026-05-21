import { z } from 'zod';

// Validation schemas
export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['Administrador', 'CRM', 'Inventario', 'Pedidos']),
  status: z.enum(['Activo', 'Inactivo']).optional().default('Activo'),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  sku: z.string().min(2, 'SKU must be at least 2 characters'),
  stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  price: z.number().nonnegative('Price must be non-negative').optional(),
  category: z.string().min(2, 'Category must be at least 2 characters'),
});

export const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  status: z.enum(['Activo', 'Lead', 'Inactivo']).optional().default('Activo'),
});

export const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  picked: z.number().int().nonnegative('Picked must be a non-negative integer').optional().default(0),
});

export const orderSchema = z.object({
  customerId: z.string(),
  status: z.enum(['Pendiente', 'Picking', 'Completado', 'Enviado']).optional().default('Pendiente'),
  items: z.array(orderItemSchema).nonempty('At least one item is required'),
});

// TypeScript types from schemas
export type UserInput = z.infer<typeof userSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type OrderInput = z.infer<typeof orderSchema>;