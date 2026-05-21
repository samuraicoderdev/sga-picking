import { Hono } from 'hono';
import { buildPickingTasks, processScan } from '../services/picking.js';
import type { PickingMode } from '../types.js';

export const pickingRouter = new Hono();

const MODES: PickingMode[] = ['single', 'batch', 'zone', 'wave'];

pickingRouter.get('/tasks', (c) => {
  const mode = c.req.query('mode') as PickingMode;
  if (!mode || !MODES.includes(mode)) {
    return c.status(400).json({ error: 'Query param mode requerido: single | batch | zone | wave' });
  }
  return c.json(buildPickingTasks(mode));
});

pickingRouter.post('/scan', (c) => {
  const { mode, taskId, barcode, orderId } = c.req.json() as {
    mode?: PickingMode;
    taskId?: string;
    barcode?: string;
    orderId?: string;
  };

  if (!mode || !MODES.includes(mode) || !taskId || !barcode) {
    return c.status(400).json({ error: 'mode, taskId y barcode son obligatorios' });
  }

  const result = processScan(mode, taskId, barcode, orderId);
  return c.status(result.success ? 200 : 422).json(result);
});