/** @jsx html */
import { html } from 'snabbdom-jsx';
import Type from 'union-type';
import Rx from 'rx';

import './style.css';

import { onEvent, onValue } from 'olmo/html';
import Effects from 'olmo/effects';


export function init(username='john', password='doe', status='') {
  return [
    { username, password, status },
    Effects.none()
  ];
}

export const Action = Type({
  Login: [],
  CancelLogin: [],
  LoginSucceeded: [String],
  LoginFailed: [],
  LoginCancelled: [],

  InputUsername: [String],
  InputPassword: [String]
});


function login({ username, password }) {
  console.log("Login in.....");
  return Rx.Observable.create((observer) => {
    setTimeout(() => {
      observer.onNext(Action.LoginSucceeded('token'));
      observer.onCompleted();
    }, 5000);
  });
  return Rx.Observable.just(Action.LoginSucceeded('api token'));
}

function loginSucc() {
  console.log('Login succeeded.');
  return Effects.none();
}

function cancelLogin() {
  console.log('Cancelling...');
  return Rx.Observable.just(Action.CancelLogin());
}

function loginCancelled() {
  console.log('Login cancelled.');

}

export function update(action, model) {
  return Action.case({
    Login: () => [
      {...model, status: 'logging in...'},
      login(model)
    ],

    CancelLogin: () => [
      {...model, status: 'cancelling...'},
      cancelLogin()
    ],

    LoginSucceeded: () => [
      {...model, status: 'succeeded'},
      loginSucc()
    ],

    LoginCancelled: () => [
      {...model, status: 'cancelled'},
      loginCancelled()
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
  let login$ = new Rx.Subject();
  let cancel$ = new Rx.Subject();

  login$.takeUntil(cancel$).subscribe(() => console.log('sup'));

  function login() {
    login$.onNext();
  }

  function cancel() {
    cancel$.onNext();
  }

  return (
    <div classNames="login">
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

      <p>
        <button on-click={ login }>Sign in</button>
      </p>
      <p>
        <button on-click={ cancel }>Cancel</button>
      </p>
    </div>
  );
}

export default { init, view, update, inputs: [] };
