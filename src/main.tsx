import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

defineCustomElements(window);
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

serviceWorkerRegistration.register();
