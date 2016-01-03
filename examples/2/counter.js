/** @jsx html */
import { html } from 'snabbdom-jsx';
import Type from 'union-type';

import { message } from 'olmo';


// model
export function init(value) {
  return value;
}


// actions
export const Action = Type({
  Increment: [],
  Decrement: []
});


// update
export function update(action, model) {
  return Action.case({
    Increment: () => model + 1,
    Decrement: () => model - 1
  }, action);
}


// view
export function view({ address, model }) {
  return (
    <div>
      <button on-click={message(address, Action.Decrement())}>-</button>
      <span>{ model }</span>
      <button on-click={message(address, Action.Increment())}>+</button>
    </div>
  );
}

export default { init, view, update, Action };
