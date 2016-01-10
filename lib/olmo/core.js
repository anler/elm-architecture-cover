import Rx from 'rx';
import R from 'ramda';

import snabbdom from 'snabbdom';
import classModule from 'snabbdom/modules/class';
import propsModule from 'snabbdom/modules/props';
import styleModule from 'snabbdom/modules/style';
import eventsModule from 'snabbdom/modules/eventlisteners';

const render = snabbdom.init([
  classModule,
  propsModule,
  styleModule,
  eventsModule
]);


// Mailbox : a -> { signal : Signal a, address: Address a }
export function Mailbox(initialValue) {
  const signal = new Rx.BehaviorSubject(initialValue);
  const address = (msg) => signal.onNext(msg);

  return { signal, address };
}

// forwardTo : (Address a, a -> a) -> a -> Unit
export function forwardTo(addr, tag) {
  return R.pipe(tag, R.partial(send, [addr]));
}

// send : (Address a, a) -> Task Never Unit
export function send(addr, msg) {
  try { addr(msg); } catch(e) { console.error(e); }
}

// runApp : (Application model action, HtmlElement) -> IO ()
export function runApp(app, rootElement) {
  return Rx.Observable.merge(
    app
      .html
      .debounce(1, Rx.Scheduler.requestAnimationFrame)
      .scan(render, rootElement),
    app
      .tasks
  ).subscribe();
}

// App : Config model action -> Application model action
export function App(config) {
  // inbox : Mailbox [Action]
  const inbox = Mailbox([]);
  const singleton = (action) => [action];
  const address = forwardTo(inbox.address, singleton);

  const modelWithEffect = config.init;

  const updateStep = ([oldModel, accumulatedEffects], action) => {
    const [newModel, additionalEffects] = config.update(action, oldModel);
    return [newModel, accumulatedEffects.merge(additionalEffects)];
  }

  const update = (actions, [model]) => R.reduce(
    updateStep,
    [model, Rx.Observable.empty()],
    actions
  );

  const inputs = Rx.Observable.merge(
      ...R.prepend(
        inbox.signal,
        R.map((signal) => signal.map(singleton), config.inputs)
      )
  );

  const effectsAndModel = inputs.scan(R.flip(update), config.init);

  const model = effectsAndModel.map(R.nth(0));

  return {
    model: model,
    html: model
      .map((model) => config.view({ model, address })),
    tasks: effectsAndModel
      .map(R.nth(1))
      .mergeAll()
      .map(action => send(address, action))
  };
}
