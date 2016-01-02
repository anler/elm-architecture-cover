import { runApp, SimpleApp } from 'olmo';

import { init, view, update } from './counter-pair';

const app = SimpleApp({ model: init(0, 0), update, view });

runApp(
  app,
  document.getElementById('root')
);
