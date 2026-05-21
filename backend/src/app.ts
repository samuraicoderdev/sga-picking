import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { customersRouter } from './routes/customers.js';
import { dashboardRouter } from './routes/dashboard.js';
import { ordersRouter } from './routes/orders.js';
import { pickingRouter } from './routes/picking.js';
import { productsRouter } from './routes/products.js';
import { usersRouter } from './routes/users.js';

export class App {
  private app: Hono;

  constructor() {
    this.app = new Hono();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use('*', cors());
  }

  private setupRoutes(): void {
    this.app.get('/api', (c) => {
      return c.json('SGA Backend is online');
    });

    this.app.route('/api/users', usersRouter);
    this.app.route('/api/products', productsRouter);
    this.app.route('/api/customers', customersRouter);
    this.app.route('/api/orders', ordersRouter);
    this.app.route('/api/picking', pickingRouter);
    this.app.route('/api/dashboard', dashboardRouter);
  }

  getInstance(): Hono {
    return this.app;
  }
}

export function createApp() {
  return new App().getInstance();
}