import React from 'react';

import { message } from 'elm/html-events';


// model
export function init(value) {
  return value;
}


// actions
export const actions = {
  increment() {
    return { type: 'Increment' };
  },
  decrement() {
    return { type: 'Decrement' };
  }
};


// update
export function update(action, model) {
  switch(action.type) {

  case 'Increment':
    return model + 1;

  case 'Decrement':
    return model - 1;

  }
}

// view
export function view(address, model) {
  return (
    <div>
      <button onClick={message(address, actions.decrement())}>-</button>
      <span>{model}</span>
      <button onClick={message(address, actions.increment())}>+</button>
    </div>
  );
}

export function viewWithRemoveButton(context, model) {
  return (
    <div>
      <button onClick={message(context.address, actions.decrement())}>-</button>
      <span>{model}</span>
      <button onClick={message(context.address, actions.increment())}>+</button>
      <button onClick={context.remove()}>[x]</button>
    </div>
  );
}

export default { init, view, viewWithRemoveButton, update, actions };
