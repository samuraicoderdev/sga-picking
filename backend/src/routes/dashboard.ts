import { Hono } from 'hono';
import { getPendingOrders, products } from '../db.js';
import { getOrdersSnapshot } from '../services/picking.js';
import type { DashboardStats } from '../types.js';

export const dashboardRouter = new Hono();

dashboardRouter.get('/stats', (c) => {
  const allOrders = getOrdersSnapshot();
  const pendingOrders = getPendingOrders();
  const lowStockProducts = products.filter((p) => p.stock < 20);

  const stats: DashboardStats = {
    pendingOrders: pendingOrders.length,
    lowStockCount: lowStockProducts.length,
    totalStock: products.reduce((acc, p) => acc + p.stock, 0),
    completionRate: 94.2,
    lowStockProducts,
    recentOrders: allOrders.slice(0, 4),
  };

  return c.json(stats);
});