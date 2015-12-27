import React from 'react';
import R from 'ramda';

import { forwardTo } from 'elm';
import { message } from 'elm/html-events';

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
  remove(counterID) {
    return { type: 'Remove', counterID };
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
      R.filter(([id, counter]) => id !== action.counterID, model.counters),
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
  const viewCounter = ([id, counter]) => {
    const context = {
      address: forwardTo(address, actions.modify(id)),
      remove() {
        return message(address, actions.remove(id));
      }
    };
    return (
      <div key={id}>
        { Counter.viewWithRemoveButton(context, counter) }
      </div>
    );
  };

  const counters = R.map(viewCounter, model.counters);

  return (
    <div>
      <button onClick={message(address, actions.insert())}>Insert</button>
      {counters}
    </div>
  );
}

export default { init, update, view, actions };
