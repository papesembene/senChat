import { createElement } from './Function.js';
import { codeColors } from '../utils/colors.js';
import { btnicon } from '../utils/constants.js';
import { showChatBase, renderSelectedChat, renderDefaultChat, startChatPolling } from './ChatUI.js';

export function ShowChat() {
  const barre = createElement('div', {
    class: 'w-[35%] h-full border-r border-gray-200 flex flex-col',
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
    class: 'w-full h-screen bg-gray-150 flex items-center justify-center',
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
        class: 'w-[60%] h-full bg-green-200 flex flex-col',
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
