import { createApp } from './app.js';
import { PORT } from './config.js';

const app = createApp();

app.get('/hello', (c) => {
  return c.text('Hello Hono!');
});

const port = PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});