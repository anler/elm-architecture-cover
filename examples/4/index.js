import { render } from 'react-dom';
import { partialRight } from 'ramda';

import { main } from 'elm';
import { startSimple } from 'elm/start-app';

import { init, view, update } from './counter-list';

const app = startSimple({ model: init(), update, view });

main(
  app,
  partialRight(render, [document.getElementById('root')])
);
