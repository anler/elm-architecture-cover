import { main } from 'olmo';
import { startSimple } from 'olmo/start-app';

import { init, view, update } from './counter-pair';

const app = startSimple({ model: init(0, 0), update, view });

main(
  app,
  document.getElementById('root')
);
