import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken } from '../auth/jwt.js';
import { productSchema } from '../utils/validation.js';
import type { Product } from '../types.js';

export const productsRouter = Router();

// Get all products - requires authentication
productsRouter.get('/', authenticateToken, async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a product by ID - requires authentication
productsRouter.get('/:id', authenticateToken, async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new product - requires admin or inventory role
productsRouter.post('/', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const validationResult = productSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ error: 'Invalid input', details: validationResult.error.format() });
      return;
    }

    const productData = validationResult.data;

    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku: productData.sku },
    });

    if (existingProduct) {
      res.status(400).json({ error: 'El SKU ya está registrado' });
      return;
    }

    const product = await prisma.product.create({
      data: productData,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a product - requires admin or inventory role
productsRouter.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const validationResult = productSchema.partial().safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ error: 'Invalid input', details: validationResult.error.format() });
      return;
    }

    const productData = validationResult.data;
    const productId = req.params.id;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    // If SKU is being updated, check for uniqueness
    if (productData.sku && productData.sku !== existingProduct.sku) {
      const skuExists = await prisma.product.findUnique({
        where: { sku: productData.sku },
      });

      if (skuExists) {
        res.status(400).json({ error: 'El SKU ya está registrado' });
        return;
      }
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: productData,
    });

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a product - requires admin role
productsRouter.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    // Check if product is used in any order item
    const orderItemCount = await prisma.orderItem.count({
      where: { productId },
    });

    if (orderItemCount > 0) {
      res.status(400).json({ error: 'No se puede eliminar el producto porque está asociado a órdenes' });
      return;
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});