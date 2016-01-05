import { runApp, SimpleApp } from 'olmo';

import Counter from './counter';

const app = SimpleApp(Counter);

runApp(
  app,
  document.getElementById('root')
);
