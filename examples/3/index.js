import { runApp, SimpleApp } from 'olmo';

import { init, view, update } from './counter-list';

const app = SimpleApp({ model: init(), update, view });

runApp(
  app,
  document.getElementById('root')
);
