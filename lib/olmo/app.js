import { Observable } from 'rx';
import { partial, flip, prop, compose } from 'ramda';

import snabbdom from 'snabbdom';
import classModule from 'snabbdom/modules/class';
import propsModule from 'snabbdom/modules/props';
import styleModule from 'snabbdom/modules/style';
import eventsModule from 'snabbdom/modules/eventlisteners';

import { Mailbox, send } from 'olmo';
//import * as modelM from 'modelm';

const patch = snabbdom.init([
  classModule,
  propsModule,
  styleModule,
  eventsModule
]);

export function runApp(app, rootElement) {
  app.html.scan(patch, rootElement).subscribe();
}

export function SimpleApp({ model, update, view }) {
  const inbox = Mailbox();

  const actions = inbox.signal;

  const state = Observable.just(model).concat(
    actions.scan(flip(update), model)
  );

  const html = state.map(partial(view, [inbox.address]));

  return { state, html, actions };
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
