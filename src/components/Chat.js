import { createElement } from './Function.js';
import { codeColors } from '../utils/colors.js';
import { btnicon } from '../utils/constants.js';
import { showChatBase, renderSelectedChat, renderDefaultChat, startChatPolling } from './ChatUI.js';

let selectedConversation = null;
let selectedUser = null;
let inputMessage = '';

export function ShowChat() {
  const barre = createElement('div', {
    class: 'w-[35%] h-full border-r border-gray-200 flex flex-col',
    id: 'sidebar-content'
  });

  showChatBase({
    onSelect: (conversation, user) => {
      if (window.chatPollingInterval) clearInterval(window.chatPollingInterval);
      selectedConversation = conversation;
      selectedUser = user;
      renderChatArea();
      startChatPolling(selectedConversation);
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
        //   createElement('img', {
        //     src: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
        //     alt: 'Logo',
        //     class: 'w-8 h-8 rounded-full mt-4 cursor-pointer hover:bg-gray-200 p-1 transition-colors'
        //   })
        ])
      ]),
      // Barre latérale des conversations
      barre,
      // Zone de chat principale
      createElement('div', {
        class: 'w-[60%] h-full bg-green-200 flex flex-col',
        id: 'chat-area'
      }, [
        selectedConversation
          ? renderSelectedChat(selectedConversation, selectedUser, inputMessage, setInputMessage)
          : renderDefaultChat()
      ])
    ])
  ]);
}

function setInputMessage(val) {
  inputMessage = val;
//   renderChatArea(); 
}

async function renderChatArea() {
  const chatArea = document.getElementById('chat-area');
  if (chatArea) {
    chatArea.innerHTML = '';
    const newContent = await renderSelectedChat(selectedConversation, selectedUser, inputMessage, setInputMessage);
    if (Array.isArray(newContent)) {
      newContent.forEach(el => chatArea.appendChild(el));
    } else {
      chatArea.appendChild(newContent);
    }
  }
}
