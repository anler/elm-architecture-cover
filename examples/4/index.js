import { render } from 'react-dom';
import { partialRight } from 'ramda';

import { main } from 'olmo';
import { startSimple } from 'olmo/start-app';

import { init, view, update } from './counter-list';

const app = startSimple({ model: init(), update, view });

main(
  app,
  partialRight(render, [document.getElementById('root')])
);
