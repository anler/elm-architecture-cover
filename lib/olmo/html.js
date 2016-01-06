import Rx from 'rx';
import { pipe, prop, identity, partialRight, set, lensProp } from 'ramda';

import { send } from './core';

const defaultOptions = { preventDefault: false, stopPropagation: false };

// on : (Options, Decoder value, value -> result) -> Event -> result
function on(options, decode, handler) {
  return pipe(
    handleEventOptions(options),
    decode,
    handler
  );
}

// handleEventOptions : Options -> Event -> Event
function handleEventOptions(options) {
  return function(event) {
    if (options.stopPropagation) {
      event.stopPropagation();
    }

    if (options.preventDefault) {
      event.preventDefault();
    }

    return event;
  };
}

// targetChecked : Event -> String
const targetValue = pipe(prop('target'), prop('value'));

// targetChecked : Event -> Bool
const targetChecked = pipe(prop('target'), prop('checked'));

// decodeOn : (Decoder value, Options) -> (Address action, value -> action) -> Task x Unit
export function decodeOn(decode, options=defaultOptions) {
  return function(address, handler) {
    return on(
      options,
      decode,
      x => send(address, handler(x))
    );
  };
}

// messageOn : Options -> (Address action, Unit -> action) -> Task x Unit
export function messageOn(options=defaultOptions) {
  return function(address, handler) {
    return on(
      options,
      identity,
      _ => send(address, handler())
    );
  };
}


// onValue : (Address action, String -> action) -> String
export const onValue = decodeOn(targetValue);

// onCheck : (Address action, Bool -> action) -> Bool
export const onCheck = decodeOn(targetChecked);

// onSubmitOptions : Options
const onSubmitOptions = set(
  lensProp('preventDefault'),
  true,
  defaultOptions
);

// onSubmit : (Address action, action) -> Task x Unit
export const onSubmit = messageOn(onSubmitOptions);

// onEvent : (Address action, action) -> Task x Unit
// export const onEvent = messageOn();
export function onEvent(address, actionCreator) {
  function handler(event) {
    console.log('ouch!');
  }
  const r = Rx.Observable.fromCallback(handler);
  return handler;
}
