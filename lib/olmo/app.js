import { Subject, Observable, Scheduler } from 'rx';
import { partial, flip, bind, pipe } from 'ramda';

import snabbdom from 'snabbdom';
import classModule from 'snabbdom/modules/class';
import propsModule from 'snabbdom/modules/props';
import styleModule from 'snabbdom/modules/style';
import eventsModule from 'snabbdom/modules/eventlisteners';

import { mailbox, send } from './core';


const patch = snabbdom.init([
  classModule,
  propsModule,
  styleModule,
  eventsModule
]);

type Mailbox<T> = { signal: Subject, address: Address<T> };

type Address<T> = (msg: T) => void;

type Action = Object;

type Application = { state: Observable,
                     html: Observable,
                     actions: Observable,
                     tasks: Observable }

type Element = Object;

type Signal = Observable;

type Config = { init: any,
                update: Function,
                view: Function,
                inputs?: Array<Signal> };



export function mailbox(): Mailbox<T> {
  const signal = new Subject();
  const address = bind(signal.onNext, signal);

  return { signal, address };
                                            }

    export function forwardTo(addr: Address<T>, tag: (a: T) => T): (a: T) => void {
      return pipe(tag, partial(send, [addr]));
    }


export function send(addr: Address<T>, msg: T): void {
  return addr(msg);
}


export function runApp(app: Application, rootElement: Element): void {
  app.html.debounce(1, Scheduler.requestAnimationFrame).scan(patch, rootElement).subscribe();
}


export function SimpleApp(config: Config): Application {
  const inbox: Mailbox<T> = mailbox();

  const actions = inbox.signal;

  const state = Observable.just(config.init).concat(
    actions.scan(flip(config.update), config.init)
  );

  const html = state.map(model => config.view({ model, address: inbox.address }));

  return { state, html, actions, tasks: Observable.empty() };
}

export function App(config: Config): Application {
  return SimpleApp(config);
}

// export function start(config) {
//   const { signal, address } = Mailbox();

//   const actions = Observable.merge(
//     signal,
//     ...config.inputs
//   );

//   const effectsAndModel = Observable.just(config.init).concat(
//     actions.scan(flip(modelM.updateWith(config.update)), config.init)
//   );

//   const model = effectsAndModel.map(modelM.getModel);

//   const html = model.map(partial(config.view, [address]));

//   const tasks = effectsAndModel.selectMany(modelM.getEffect);
//   tasks.subscribe(partial(send, [address]));

//   return { model, html, tasks };
// }
