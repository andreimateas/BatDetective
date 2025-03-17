import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
const container = document.getElementById('root');
const root = createRoot(container!);
import { defineCustomElements } from '@ionic/pwa-elements/loader'
import {RegistrationProvider} from "./utils/RegistrationContext";
import {LocationsProvider} from "./utils/LocationsContext";
// Call the element loader before the render call
defineCustomElements(window);
root.render(

      <RegistrationProvider>
    <App />
          </RegistrationProvider>

);