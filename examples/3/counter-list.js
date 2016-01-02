import React from 'react';
import R from 'ramda';

import { forwardTo } from 'olmo';
import { message } from 'olmo/html-events';

import Counter from './counter';


// model
export function init(counters=[], nextID=1) {
  return { counters, nextID };
}

// actions
export const actions = {
  insert() {
    return { type: 'Insert' };
  },
  remove() {
    return { type: 'Remove' };
  },
  modify(counterID) {
    return function(counterAction) {
      return { type: 'Modify', counterID, counterAction };
    };
  }
};


//update
export function update(action, model) {
  switch(action.type) {

  case 'Insert':
    const newCounter = [model.nextID, Counter.init(0)];
    return init(
      R.append(newCounter, model.counters),
      model.nextID + 1
    );

  case 'Remove':
    return init(
      R.drop(1, model.counters),
      model.nextID
    );

  case 'Modify':
    const updateCounter = ([id, counter]) => {
      if (id === action.counterID)
        return [id, Counter.update(action.counterAction, counter)];
      return [id, counter];
    };

    return init(
      R.map(updateCounter, model.counters),
      model.nextID
    );

  }
}


// view
export function view(address, model) {
  const viewCounter = ([id, counter]) => (
    <div key={id}>
      { Counter.view(forwardTo(address, actions.modify(id)), counter) }
    </div>
  );

  const counters = R.map(viewCounter, model.counters);

  return (
    <div>
      <button onClick={message(address, actions.insert())}>Insert</button>
      <button onClick={message(address, actions.remove())}>Remove</button>
      {counters}
    </div>
  );
}

export default { init, update, view, actions };
