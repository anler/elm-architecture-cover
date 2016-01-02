import { main } from 'olmo';
import { startSimple } from 'olmo/start-app';

import { init, view, update } from './counter';

const app = startSimple({ model: init(0), update, view });

main(
  app,
  document.getElementById('root')
);
