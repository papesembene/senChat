import { createElement } from './Function.js';
import { codeColors } from '../utils/colors.js';
import { btnicon } from '../utils/constants.js';

import { showChatBase, renderSelectedChat, renderDefaultChat, startChatPolling } from './ChatUI.js';
/**
 * 
 * @returns Un élément div HTML contenant la structure de la zone de chat
 * @description Crée une div qui contient la barre latérale des conversations et la zone de chat principale.
 * Cette fonction initialise également la conversation sélectionnée et l'utilisateur, et démarre le polling pour les messages.
 */
export function ShowChat() {
  const barre = createElement('div', {
    class: 'w-full md:w-1/3 h-full border-r border-gray-200 flex flex-col',
    id: 'sidebar-content'
  });

  showChatBase({
    onSelect: (conversation, user) => {
      if (window.chatPollingInterval) clearInterval(window.chatPollingInterval);
      window.selectedConversation = conversation;
      window.selectedUser = user;
      renderChatArea();
      startChatPolling();
    }
  }).then(elements => {
    elements.forEach(el => barre.appendChild(el));
     if (window.startConversationPolling) window.startConversationPolling();
  });

  return createElement('div', {
    class: 'min-h-screen w-full flex items-center justify-center bg-gray-100',
  }, [
    createElement('div', { 
      class: 'flex flex-col md:flex-row bg-white rounded-lg shadow-lg w-full max-w-[1400px] h-[90vh] overflow-hidden' ,
      id: 'main-container'
    }, [
     
      createElement('div', { 
        class: 'hidden md:flex w-[5%] h-full bg-green-500 flex-col items-center py-4' 
      }, [
        createElement('div', { class: 'flex flex-col space-y-4 justify-center items-center' }, [
          btnicon.message,
          btnicon.story,
          btnicon.channel,
          btnicon.groupe,
          btnicon.settings,
          btnicon.settings
        ])
      ]),
      // Sidebar des conversations
      barre,
      // Zone de chat principale
      createElement('div', {
        class: 'w-full md:w-2/3 h-full bg-green-200 flex flex-col',
        id: 'chat-area'
      }, [
        window.selectedConversation
          ? renderSelectedChat(window.selectedConversation, window.selectedUser, '', setInputMessage)
          : renderDefaultChat()
      ])
    ])
  ]);
}

function createLoaderMessage(text = "Chargement des messages...") {
  return createElement('div', {
    class: 'flex flex-col items-center justify-center h-full py-10'
  }, [
    createElement('div', {
      class: 'animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500 mb-4'
    }),
    createElement('div', { class: 'text-gray-500 text-sm' }, text)
  ]);
}

function setInputMessage(val) {
  // Optionnel : window.inputMessage = val;
}

/**
 * Fonction pour mettre à jour la zone de chat avec la conversation sélectionnée.
 * Elle vide le contenu actuel de la zone de chat et affiche la conversation sélectionnée.
 */
async function renderChatArea() {
  const chatArea = document.getElementById('chat-area');
  if (chatArea) {
    chatArea.innerHTML = '';
    // Affiche le loader pendant le chargement
    chatArea.appendChild(createLoaderMessage("Connexion lente... Chargement des messages"));
    if (window.selectedConversation) {
      const newContent = await renderSelectedChat(window.selectedConversation, window.selectedUser, '', setInputMessage);
      chatArea.innerHTML = ''; 
      if (Array.isArray(newContent)) {
        newContent.forEach(el => chatArea.appendChild(el));
      } else {
        chatArea.appendChild(newContent);
      }
    } else {
      chatArea.innerHTML = '';
      chatArea.appendChild(renderDefaultChat());
    }
  }
}

// let conversationPollingInterval = null;
/**
 * Fonction pour démarrer le polling des conversations.
 * Elle vérifie si la barre latérale existe, puis appelle showChatBase pour mettre à jour les conversations.
 * Elle utilise un intervalle pour mettre à jour les conversations toutes les 3 secondes.
 * @param {Function} showChatBase - La fonction pour afficher la base de chat.
 * @return {void}
 * @description Démarre le polling des conversations pour mettre à jour la liste des conversations dans la barre latérale.
 */
function startConversationPolling() {
  // Utilise la variable globale
  if (window.conversationPollingInterval) clearInterval(window.conversationPollingInterval);
  window.conversationPollingInterval = setInterval(async () => {
    const barre = document.getElementById('sidebar-content');
    if (barre) {
      const { showChatBase } = await import('./ChatUI.js');
      const elements = await showChatBase({
        onSelect: (conversation, user) => {
          window.selectedConversation = conversation;
          window.selectedUser = user;
          if (window.renderChatArea) window.renderChatArea();
        }
      });
      barre.innerHTML = '';
      elements.forEach(el => barre.appendChild(el));
    }
  }, 3000); // toutes les 3 secondes
}
window.startConversationPolling = startConversationPolling;

window.renderChatArea = renderChatArea;
