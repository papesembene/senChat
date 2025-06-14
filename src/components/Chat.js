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
  });

  return createElement('div', {
    // class: 'w-full h-screen bg-gray-150 flex items-center justify-center',
    class:'bg-white flex flex-col md:flex-row rounded-lg shadow-lg w-full max-w-[1400px] mx-2 md:mx-4 h-screen md:h-[850px] overflow-hidden'
  }, [
    createElement('div', { class: 'bg-white flex rounded-lg shadow-lg w-[1400px] mx-4 h-[850px] overflow-hidden' }, [
      // Barre latérale gauche
      createElement('div', { class: `w-[5%] h-full bg-${codeColors.green}-500 flex flex-col items-center py-4` }, [
        createElement('div', { class: 'flex flex-col space-y-4 justify-center items-center' }, [
          btnicon.message,
          btnicon.story,
          btnicon.channel,
          btnicon.groupe,
          btnicon.settings,
        ])
      ]),
      // Barre latérale des conversations
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
    if (window.selectedConversation) {
      const newContent = await renderSelectedChat(window.selectedConversation, window.selectedUser, '', setInputMessage);
      if (Array.isArray(newContent)) {
        newContent.forEach(el => chatArea.appendChild(el));
      } else {
        chatArea.appendChild(newContent);
      }
    } else {
      chatArea.appendChild(renderDefaultChat());
    }
  }
}

window.renderChatArea = renderChatArea;
