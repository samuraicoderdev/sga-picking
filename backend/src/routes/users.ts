import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken, authorizeRole } from '../auth/jwt.js';
import type { SystemUser } from '../types.js';

export const usersRouter = Router();

// Get all users - requires authentication
usersRouter.get('/', authenticateToken, async (_req, res) => {
  try {
    const users = await prisma.systemUser.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new user - requires admin role
usersRouter.post('/', authenticateToken, authorizeRole('Administrador'), async (req, res) => {
  try {
    const { name, email, role, status } = req.body as Partial<SystemUser>;
    if (!name || !email || !role) {
      res.status(400).json({ error: 'name, email y role son obligatorios' });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.systemUser.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'El correo electrónico ya está registrado' });
      return;
    }

    const newUser = await prisma.systemUser.create({
      data: {
        name,
        email,
        role,
        status: status || 'Activo',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a user - requires admin role
usersRouter.delete('/:id', authenticateToken, authorizeRole('Administrador'), async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const existingUser = await prisma.systemUser.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    await prisma.systemUser.delete({
      where: { id: userId },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});