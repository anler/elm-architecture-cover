/** @jsx html */
import { html } from 'snabbdom-jsx';
import Type from 'union-type';

import { forwardTo } from 'olmo';
import { message } from 'olmo/html-events';

import Counter from './counter';


// model
export function init(topValue, bottomValue) {
  return {
    top: Counter.init(topValue),
    bottom: Counter.init(bottomValue)
  };
}


// actions
export const Action = Type({
  Top: [Counter.Action],
  Bottom: [Counter.Action],
  Reset: []
});


//update
export function update(action, model) {
  return Action.case({
    Reset: () => init(0, 0),

    Top: (counterAction) => init(
      Counter.update(counterAction, model.top),
      model.bottom
    ),

    Bottom: (counterAction) => init(
      model.top,
      Counter.update(counterAction, model.bottom)
    )
  }, action);
}


// view
export function view({ address, model }) {
  return (
    <div>
      <Counter address={forwardTo(address, Action.Top)} model={model.top} />
      <Counter address={forwardTo(address, Action.Bottom)} model={model.bottom} />
      <button on-click={message(address, Action.Reset())}>Reset</button>
    </div>
  );
}

export default { init, update, view };
