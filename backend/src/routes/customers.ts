import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken } from '../auth/jwt.js';
import { customerSchema } from '../utils/validation.js';
import type { Customer } from '../types.js';

export const customersRouter = Router();

// Get all customers - requires authentication
customersRouter.get('/', authenticateToken, async (_req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a customer by ID - requires authentication
customersRouter.get('/:id', authenticateToken, async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
    });

    if (!customer) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }

    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new customer - requires authentication
customersRouter.post('/', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const validationResult = customerSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ error: 'Invalid input', details: validationResult.error.format() });
      return;
    }

    const customerData = validationResult.data;

    // Check if email already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: customerData.email },
    });

    if (existingCustomer) {
      res.status(400).json({ error: 'El correo electrónico ya está registrado' });
      return;
    }

    const customer = await prisma.customer.create({
      data: customerData,
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a customer - requires authentication
customersRouter.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const validationResult = customerSchema.partial().safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ error: 'Invalid input', details: validationResult.error.format() });
      return;
    }

    const customerData = validationResult.data;
    const customerId = req.params.id;

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!existingCustomer) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }

    // If email is being updated, check for uniqueness
    if (customerData.email && customerData.email !== existingCustomer.email) {
      const emailExists = await prisma.customer.findUnique({
        where: { email: customerData.email },
      });

      if (emailExists) {
        res.status(400).json({ error: 'El correo electrónico ya está registrado' });
        return;
      }
    }

    const customer = await prisma.customer.update({
      where: { id: customerId },
      data: customerData,
    });

    res.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a customer - requires authentication
customersRouter.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const customerId = req.params.id;

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!existingCustomer) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }

    // Check if customer has any orders
    const orderCount = await prisma.order.count({
      where: { customerId },
    });

    if (orderCount > 0) {
      res.status(400).json({ error: 'No se puede eliminar el cliente porque tiene órdenes asociadas' });
      return;
    }

    await prisma.customer.delete({
      where: { id: customerId },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});