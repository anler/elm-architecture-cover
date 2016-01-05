import { runApp, App } from 'olmo';

import Login from './login';

const app = App(Login);

runApp(
  app,
  document.getElementById('root')
);
