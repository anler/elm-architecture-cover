import { Observable } from 'rx';
import { partial, flip, prop, compose } from 'ramda';

import { Mailbox, send } from 'elm';
//import * as modelM from 'modelm';


export function startSimple({ model, update, view }) {
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
