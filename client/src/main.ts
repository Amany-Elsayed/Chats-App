import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

const redirect = sessionStorage['redirect'];
delete sessionStorage['redirect'];

if (redirect && redirect !== location.href) {
  history.replaceState(null, '', redirect);
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
