import { pipe, prop, identity } from 'ramda';

import { send } from 'elm';


const on = pipe;

export function message(address, action) {
  return on(
    identity,
    (event) => send(address, action)
  );
}

const getTargetValue = pipe(prop('target'),
                            prop('value'));

export function value(address, action) {
  return on(
    getTargetValue,
    (value) => send(address, action(value))
  );
}
