/** @jsx html */
import { html } from 'snabbdom-jsx';
import Type from 'union-type';
import Rx from 'rx';

import './style.css';

import { onSubmit, onValue } from 'olmo/html';
import Effects from 'olmo/effects';


export function init(username='', password='', status='') {
  return [
    { username, password, status },
    Effects.none()
  ];
}

export const Action = Type({
  Login: [],
  LoginSucceeded: [String],
  LoginFailed: [],

  InputUsername: [String],
  InputPassword: [String]
});


function login({ username, password }) {
  console.log(new Date, 'creating effect');
  return Rx.Observable.create((observer) => {
    setTimeout(() => {
      observer.onNext(Action.LoginSucceeded('token'));
      observer.onCompleted();
    }, 1000);
  });
  return Rx.Observable.just(Action.LoginSucceeded('api token'));
}

function loginSucc() {
  console.log('succeeded');
  return Effects.none();
}

export function update(action, model) {
  return Action.case({
    Login: () => [
      {...model, status: 'logging in...'},
      login(model)
    ],

    LoginSucceeded: () => [
      {...model, status: ''},
      loginSucc()
    ],

    LoginFailed: () => [
      {...model, status: 'Login failed'},
      Effects.none()
    ],

    InputUsername: (username) => [
      {...model, username},
      Effects.none()
    ],

    InputPassword: (password) => [
      {...model, password},
      Effects.none()
    ]

  }, action);
}


export function view({ address, model }) {
  return (
    <form classNames="login" on-submit={ onSubmit(address, Action.Login) }>
      <h1>Login</h1>

      <input
         type="text"
         placeholder="username"
         value={model.username}
         on-input={onValue(address, Action.InputUsername)} />

      <input
         type="password"
         placeholder="password"
         value={model.password}
         on-input={onValue(address, Action.InputPassword)} />

      <p classNames="status"
         style-display={model.status ? 'block' : 'none'}>
        {model.status}
      </p>

      <button>Sign in</button>
    </form>
  );
}

export default { init, view, update, inputs: [] };
