import { ShowLoginForm } from './Login.js';
import { ShowChat } from './Chat.js'; 
import {ShowRegisterForm} from './Register.js'

const routes = {
  '/': ShowLoginForm,
  '/chat': ShowChat,
  '/register': ShowRegisterForm,
};

/**
 * * @description Gère la navigation entre les différentes pages de l'application.
 */
export function router() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  const path = window.location.hash.replace('#', '') || '/';
  const Page = routes[path];
  if (Page) {
    app.appendChild(Page());
  } else {
    app.textContent = '404 - Page non trouvée';
  }
}
/**
 * 
 * @param {string} path 
 * @description Met à jour l'URL de la fenêtre pour naviguer vers une nouvelle page.
 */
export function navigateTo(path) {
  window.location.hash = path;
}