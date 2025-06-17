import { createElement } from './Function.js';
import { getCurrentUser } from '../Services/auth.js';

// Icônes SVG (similaires à WhatsApp)
const icons = {
  account: `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
</svg>
  `,
  privacy: `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4m0 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"/>
</svg>
  `,
  chat: `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-right-text-fill" viewBox="0 0 16 16">
  <path d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353zM3.5 3h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1m0 2.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1m0 2.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1"/>
</svg>
  `,
  notifications: `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16">
  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
</svg>
  `,
  keyboard: `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-patch-minus-fill" viewBox="0 0 16 16">
  <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zM6 7.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1 0-1"/>
</svg>
  `,
  help: `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"/>
</svg>
  `,
  logout: `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
  <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
</svg>
  `
};

export function showSettingsSidebar() {
  if (window.conversationPollingInterval) clearInterval(window.conversationPollingInterval);

  const user = getCurrentUser();
  const sidebar = document.getElementById('sidebar-content');
  if (!sidebar) return;

  sidebar.innerHTML = '';

  sidebar.className = 'flex flex-col bg-gray-100 h-full w-[450px] p-0 overflow-y-auto';

  // Header
  const header = createElement('div', { class: 'p-4 border-b border-gray-300 bg-gray-100' }, [
    createElement('h2', { class: 'text-xl font-bold text-gray-900 mb-2' }, 'Paramètres'),
    createElement('input', {
      class: 'w-full bg-white text-gray-800 rounded px-3 py-2 mb-3 border border-gray-300',
      placeholder: 'Rechercher dans les paramètres'
    })
  ]);

  // Profil utilisateur
  const profile = createElement('div', { class: 'flex items-center gap-4 p-4 bg-white rounded-lg mb-4 shadow' }, [
    createElement('img', {
      src: user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name),
      class: 'w-16 h-16 rounded-full border-2 border-green-400'
    }),
    createElement('div', {}, [
      createElement('div', { class: 'font-semibold text-gray-900 text-lg' }, user.name),
      createElement('div', { class: 'text-gray-500 text-sm' }, user.status || "Salut ! J'utilise SenChat.")
    ])
  ]);

  // Menu
  const menu = createElement('div', { class: 'flex flex-col gap-1' }, [
    createMenuItem('Compte', icons.account),
    createMenuItem('Confidentialité', icons.privacy),
    createMenuItem('Discussions', icons.chat),
    createMenuItem('Notifications', icons.notifications),
    createMenuItem('Raccourcis clavier', icons.keyboard),
    createMenuItem('Aide', icons.help),
    createMenuItem('Se déconnecter', icons.logout, () => {
      localStorage.removeItem('user');
      location.replace('/');
    })
  ]);

  sidebar.appendChild(header);
  sidebar.appendChild(profile);
  sidebar.appendChild(menu);
}

// Icônes à gauche, couleur verte, texte foncé, alignement horizontal
function createMenuItem(label, svgIcon, onclick, extraClass = '') {
  return createElement('button', {
    class: `flex items-center gap-3 px-4 py-3 rounded hover:bg-green-200 transition-colors text-left ${extraClass}`,
    style: 'font-size:1rem;',
    onclick
  }, [
    // Icône verte à gauche
    (() => {
      const span = document.createElement('span');
      span.className = label === 'Se déconnecter' ? 'text-red-500' : 'text-green-500';
      span.innerHTML = svgIcon;
      return span;
    })(),
    // Texte à droite
    createElement('span', { class: 'font-medium text-gray-900' }, label)
  ]);
}