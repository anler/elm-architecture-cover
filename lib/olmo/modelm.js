import { Observable } from 'rx';

function none() {
  return Observable.empty();
};

export function appendEffects(effA, effB) {
  return effA.concat(effB);
}

export function put(value) {
  return [value, none()];
}

export function updateWith(update) {
  return function(action, [m1, eff1]) {
    let [m2, eff2] = update(action, m1);
    return [m2, eff2];
  };
}

export function getEffect([_, eff]) {
  return eff;
}

export function getModel([model, _]) {
  return model;
}

export function withSideEffect(model, f) {
  return [model, Observable.create((observer) => {
    f();
    observer.onCompleted();
  })];
}

export function withTask(model, eff) {
  return [model, eff];
}
