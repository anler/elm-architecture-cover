import React from 'react';

import { forwardTo } from 'elm';
import { message } from 'elm/html-events';

import Counter from './counter';


// model
export function init(topValue, bottomValue) {
  return {
    top: Counter.init(topValue),
    bottom: Counter.init(bottomValue)
  };
}


// actions
export const actions = {
  top(counterAction) {
    return { type: 'Top', counterAction };
  },
  bottom(counterAction) {
    return { type: 'Bottom', counterAction };
  },
  reset() {
    return { type: 'Reset' };
  }
};


//update
export function update(action, model) {
  switch(action.type) {

  case 'Reset':
    return init(
      Counter.init(0),
      Counter.init(0)
    );

  case 'Top':
    return init(
      Counter.update(action.counterAction, model.top),
      model.bottom
    );

  case 'Bottom':
    return init(
      model.top,
      Counter.update(action.counterAction, model.bottom)
    );
  }
}


// view
export function view(address, model) {
  return (
    <div>
      { Counter.view(forwardTo(address, actions.top), model.top) }
      { Counter.view(forwardTo(address, actions.bottom), model.bottom) }
      <button onClick={message(address, actions.reset())}>Reset</button>
    </div>
  );
}

export default { init, update, view, actions };
