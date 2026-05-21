import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken } from '../auth/jwt.js';
import { orderSchema } from '../utils/validation.js';
import type { Order, OrderItem } from '../types.js';

export const ordersRouter = Router();

// Get all orders - requires authentication
ordersRouter.get('/', authenticateToken, async (_req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
      orderBy: { date: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pending orders (Pendiente or Picking) - requires authentication
ordersRouter.get('/pending', authenticateToken, async (_req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ['Pendiente', 'Picking'],
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
      orderBy: { date: 'asc' },
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get an order by ID - requires authentication
ordersRouter.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });

    if (!order) {
      res.status(404).json({ error: 'Pedido no encontrado' });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new order - requires authentication
ordersRouter.post('/', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const validationResult = orderSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ error: 'Invalid input', details: validationResult.error.format() });
      return;
    }

    const orderData = validationResult.data;

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: orderData.customerId },
    });

    if (!customer) {
      res.status(400).json({ error: 'Cliente no encontrado' });
      return;
    }

    // Validate that all product IDs exist
    const productIds = orderData.items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });

    if (products.length !== productIds.length) {
      res.status(400).json({ error: 'Uno o más productos no existen' });
      return;
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        customerId: orderData.customerId,
        status: orderData.status,
        items: {
          create: orderData.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            picked: item.picked || 0,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an order - requires authentication
ordersRouter.put('/:id', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!existingOrder) {
      res.status(404).json({ error: 'Pedido no encontrado' });
      return;
    }

    // Validate input (partial)
    const validationResult = orderSchema.partial().safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ error: 'Invalid input', details: validationResult.error.format() });
      return;
    }

    const orderData = validationResult.data;

    // If customerId is being updated, check if customer exists
    if (orderData.customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: orderData.customerId },
      });

      if (!customer) {
        res.status(400).json({ error: 'Cliente no encontrado' });
        return;
      }
    }

    // If items are being updated, validate product IDs and replace all items
    let itemsUpdate;
    if (orderData.items) {
      // Validate that all product IDs exist
      const productIds = orderData.items.map(item => item.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true },
      });

      if (products.length !== productIds.length) {
        res.status(400).json({ error: 'Uno o más productos no existen' });
        return;
      }

      itemsUpdate = {
        deleteMany: {}, // Delete all existing items
        create: orderData.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          picked: item.picked || 0,
        })),
      };
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        customerId: orderData.customerId,
        status: orderData.status,
        items: itemsUpdate,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an order - requires authentication
ordersRouter.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      res.status(404).json({ error: 'Pedido no encontrado' });
      return;
    }

    await prisma.order.delete({
      where: { id: orderId },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});