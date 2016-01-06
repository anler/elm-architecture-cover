import Rx from 'rx';
import { partial, nth, flip, bind, pipe, tap } from 'ramda';
import { Maybe } from 'monet';

import snabbdom from 'snabbdom';
import classModule from 'snabbdom/modules/class';
import propsModule from 'snabbdom/modules/props';
import styleModule from 'snabbdom/modules/style';
import eventsModule from 'snabbdom/modules/eventlisteners';

const patch = snabbdom.init([
  classModule,
  propsModule,
  styleModule,
  eventsModule
]);

// type alias Signal a = Observable x a
const Signal = Rx.Observable;

// type alias Task x a = Observable x a

// type Mailbox a = { signal : Signal a
//                  , address: Address a }

// type Address a = a -> ()

// mailbox : Mailbox a
export function mailbox(a) {
  const signal = new Rx.BehaviorSubject(a);
  const address = (msg) => signal.onNext(msg);

  return { signal, address };
}

// forwardTo : (Address a, a -> a) -> a -> Unit
export function forwardTo(addr, tag) {
  return pipe(tag, partial(send, [addr]));
}


// send : (Address a, a) -> Task Never Unit
export function send(addr, msg) {
  try { addr(msg); } catch(e) { console.error(e); }
  return Rx.Observable.empty();
}

// type alias Application model action = { html : Signal Html
//                                       , state : Signal model
//                                       , actions : Signal action
//                                       , tasks : Signal (Task Never ()) }

// type alias SimpleConfig model action = { init: model
//                                        , update : (action, model) -> model
//                                        , view : (Address action, model) -> Html }

// type alias Config model action = { init: [model, Effect action]
//                                  , update : (action, model) -> [model, Effect action]
//                                  , view : (Address action, model) -> Html
//                                  , inputs : [Signal action] }


// runApp : (Application model action, HtmlElement) -> IO ()
export function runApp(app, rootElement) {
  return app
    .html
    .debounce(1, Rx.Scheduler.requestAnimationFrame)
    .scan(patch, rootElement)
    .subscribe();
}

// SimpleApp : SimpleConfig model action -> Application model action
export function SimpleApp(config) {
  // inbox : Mailbox (Maybe Action)
  const inbox = mailbox(Maybe.None());

  const actions = inbox.signal.filter(isSome).map(fromSome);

  const address = forwardTo(inbox.address, Maybe.fromNull);

  const { init, update } = config;
  const model = init();

  const state = Rx.Observable.just(model).concat(
    actions.scan(flip(update), model)
  ).publish().refCount();

  const html = state.map(model => config.view({ model, address }));

  const tasks = Rx.Observable.empty();

  return { state, html, actions, tasks };
}

// App : Config model action -> Application model action
export function App(config) {
  // inbox : Mailbox (Signal Action)
  const { address, signal } = mailbox(Signal.empty());

  const actions = signal.mergeAll();

  const modelWithEffect = config.init();

  const updateWithEffect = ([oldModel], action) => {
    const [model, eff] = config.update(action, oldModel);
    send(address, eff);
    return [model, eff];
  };

  const stateWithEffects = Signal.just(modelWithEffect).concat(
    actions.scan(updateWithEffect, modelWithEffect)
  );

  const state = stateWithEffects.map(nth(0));

  const html = state.map(model => config.view({ model, address }));

  return { state, html, actions };
}

function isSome(maybe) {
  return maybe.isSome();
}

function fromSome(some) {
  return some.some();
}
