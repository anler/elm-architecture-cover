/** @jsx html */
import { html } from 'snabbdom-jsx';
import Type from 'union-type';
import { append, drop } from 'ramda';

import { forwardTo, message } from 'olmo';

import Counter from './counter';


// model
export function init(counters=[], nextID=1) {
  return { counters, nextID };
}


// actions
export const Action = Type({
  Insert: [],
  Remove: [],
  Modify: [Number, Counter.Action]
});


//update
export function update(action, model) {
  return Action.case({
    Insert: () => init(
      append({ id: model.nextID, counter: Counter.init(0)}, model.counters),
      model.nextID + 1
    ),

    Remove: () => init(
      drop(1, model.counters),
      model.nextID
    ),

    Modify: (counterID, counterAction) => init(
      model.counters.map(
        ({id, counter}) => id === counterID ? { id, counter: Counter.update(counterAction, counter)} : {id, counter}),
      model.nextID
    )
  }, action);
}


// view
export function view({ address, model }) {
  let counters = model.counters.map(({id, counter}) => (
    <li>
      <Counter address={forwardTo(address, Action.Modify(id))} model={counter} />
    </li>
  ));

  return (
    <div>
      <button on-click={message(address, Action.Insert())}>Insert</button>
      <button on-click={message(address, Action.Remove())}>Remove</button>
      <ul>
        {counters}
      </ul>
    </div>
  );
}

export default { init, update, view };
