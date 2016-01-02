import { bind, compose, partial } from 'ramda';
import { Subject, Observable } from 'rx';

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


export function Mailbox() {
  const signal = new Subject();
  const address = bind(signal.onNext, signal);

  return { signal, address };
}

export function forwardTo(addr, tag) {
  return compose(partial(send, [addr]), tag);
}

export function send(address, message) {
  return address(message);
}

export function main(app, root) {
  app.html.scan(patch, root).subscribe();
}
