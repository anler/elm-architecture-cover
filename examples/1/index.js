import { render } from 'react-dom';
import { partialRight } from 'ramda';

import { main } from 'elm';
import { startSimple } from 'elm/start-app';

import { init, view, update } from './counter';

const app = startSimple({ model: init(0), update, view });

main(
  app,
  partialRight(render, [document.getElementById('root')])
);
