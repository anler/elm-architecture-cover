import { bind, compose, partial } from 'ramda';
import { Subject, Observable } from 'rx';


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

export function main(app, render) {
  app.html.subscribe(render);
}
