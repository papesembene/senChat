import { createElement, createButton } from './Function.js';
import { btnicon } from '../utils/constants.js'
import { getCurrentUser } from '../Services/auth.js';
import { createMessageElement, sendMessage } from './Message.js';
import { initial } from '../utils/helpers.js';
import { startRecording, stopRecording, isRecording, formatSeconds } from './VoiceMessage.js';
import { filterConversations } from '../utils/filters.js';

const API_URL = import.meta.env.VITE_API_URL;

export let chatPollingInterval = null;

/**
 * @function showChatBase
 * @param {Function} param0.onSelect - Callback function to handle conversation selection
 * @description
 * Affiche la liste des conversations de chat avec les utilisateurs.
 * Cette fonction récupère les conversations et les utilisateurs depuis l'API,
 * trie les conversations par date de dernière activité, et crée une interface utilisateur
 */
export async function showChatBase({ onSelect }) {
  const currentUser = getCurrentUser();
  const currentId = Number(currentUser.id);

  const [conversations, users] = await Promise.all([
    fetch(`${API_URL}/conversations`).then(res => res.json()),
    fetch(`${API_URL}/users`).then(res => res.json())
  ]);

  let searchValue = '';

  const searchInput = createElement('input', {
    class: 'w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none focus:border-green-500',
    placeholder: 'Rechercher une conversation...',
    oninput: (e) => {
      searchValue = e.target.value;
      renderList();
    }
  });

  const conversationList = createElement('div', {
    class: 'flex-1 overflow-y-auto bg-gray-100',
  });

  function renderList() {
    conversationList.innerHTML = '';
    const filtered = conversations.filter(conversation => {
      if (!conversation.participants.includes(currentId)) return false;
      const otherParticipantId = conversation.participants.find(id => Number(id) !== currentId);
      const otherParticipant = users.find(user => String(user.id) === String(otherParticipantId));
      const displayName = conversation.type === 'prive'
        ? (otherParticipant ? otherParticipant.name : 'Utilisateur inconnu')
        : (conversation.name || 'Conversation de groupe');
      return !searchValue || displayName.toLowerCase().includes(searchValue.toLowerCase());
    });

    for (const conversation of filtered) {
      const otherParticipantId = conversation.participants.find(id => Number(id) !== currentId);
      const otherParticipant = users.find(user => String(user.id) === String(otherParticipantId));
      const displayName = conversation.type === 'prive'
        ? (otherParticipant ? otherParticipant.name : 'Utilisateur inconnu')
        : (conversation.name || 'Conversation de groupe');
      const initials = initial(displayName);

      const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      };

      const convoItem = createElement('div', {
        class: 'flex items-center p-3 hover:bg-gray-50 cursor-pointer hover:bg-green-200 border-b border-gray-100 relative group',
        onClick: () => onSelect(conversation, otherParticipant)
      }, [
        createElement('div', {
          class: 'w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-3'
        }, [
          createElement('span', {
            class: 'text-white font-medium'
          }, initials)
        ]),
        createElement('div', { class: 'flex-1 min-w-0' }, [
          createElement('div', { class: 'flex items-center justify-between mb-1' }, [
            createElement('h3', { class: 'text-sm font-medium text-gray-900 truncate' }, displayName),
            createElement('span', { class: 'text-xs text-gray-500' }, conversation.lastActivity ? formatTime(conversation.lastActivity) : '')
          ]),
          createElement('p', { class: 'text-sm text-gray-600 truncate' }, 
            conversation.lastMessageType === 'audio'
              ? '🎤 Message vocal'
              : (conversation.lastMessage || 'Aucun message')
          )
        ]),
          createElement('button', {
  class: 'absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-white transition-opacity rounded-full p-1 shadow text-black',
  style: 'z-index:10;',
  onclick: (e) => {
    e.stopPropagation();
    showConversationMenu(conversation, convoItem);
  }
}, [
  createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: 20,
    height: 20,
    fill: 'currentColor',
    viewBox: '0 0 16 16',
    class: 'bi bi-chevron-down'
  }, [
    createElement('path', {
      d: 'M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'
    })
  ])
])
      ]);
      conversationList.appendChild(convoItem);
    }
  }

  renderList();

  const chatHeader = createElement('div', { class: 'p-4 bg-gray-50 border-b border-gray-200' }, [
    createElement('div', { class: 'flex items-center justify-between mb-3' }, [
      createElement('h2', { class: 'text-lg font-medium text-gray-900' }, 'SenChat 🇸🇳'),
      createElement('div', { class: 'flex' }, [btnicon.add, btnicon.dots2])
    ]),
    createElement('div', { class: 'relative' }, [
      searchInput
    ]),
    createElement('div', { class: 'flex items-center justify-center mb-3 text-sm mt-4' }, [
      createButton({ class: 'p-2 w-[25%] hover:bg-gray-50 h-[50%] border border-solid border-green-500 rounded-full  mr-1' }, 'Toutes'),
      createButton({ class: 'p-2 hover:bg-gray-50 w-[25%] rounded-full border border-solid border-green-500 text-ellipsis whitespace-nowrap' }, 'Non Lues'),
      createButton({ class: 'p-2 hover:bg-gray-50 w-[25%] rounded-full border border-solid border-green-500 transition-colors ml-1' }, 'Favoris'),
      createButton({ class: 'p-2 hover:bg-gray-50 w-[25%] rounded-full border border-solid border-green-500 transition-colors ml-1' }, 'Groupes'),
    ])
  ]);

  return [
    chatHeader,
    conversationList
  ];
}

  let recordingState = false;
  let recordingTimer = null;
  let recordingSeconds = 0;
/**
 * en français
 * @function renderSelectedChat
 * @description
 * Affiche la conversation sélectionnée avec les messages et l'interface de saisie.
 * Cette fonction récupère les messages de la conversation sélectionnée, les affiche dans l'ordre chronologique,
 * et crée une interface utilisateur pour envoyer de nouveaux messages.
 * @returns {Promise<Array>} Un tableau d'éléments HTML représentant la conversation sélectionnée.    
 * @param {Object} selectedConversation - La conversation sélectionnée.
 * @param {Object} selectedUser - L'utilisateur sélectionné pour la conversation privée.
 * @param {string} inputMessage - Le message saisi par l'utilisateur.
 * @param {Function} setInputMessage - Fonction pour mettre à jour le message saisi.
 */
export async function renderSelectedChat(selectedConversation, selectedUser, inputMessage, setInputMessage) {
   let inputValue = inputMessage || '';
 const chatArea = document.getElementById('chat-area');
  if (chatArea) {
    chatArea.innerHTML = '';
    chatArea.appendChild(createLoaderMessage("Connexion lente... Chargement des messages"));
  }
  await new Promise(res => setTimeout(res, 1500));
  const response = await fetch(`${API_URL}/messages`);
  const allMessages = await response.json();

  const filteredMessages = Array.isArray(allMessages)
  ? allMessages
    .filter(msg => String(msg.conversationId) === String(selectedConversation.id))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  : [];

  const displayName = selectedConversation.type === 'prive'
    ? (selectedUser ? selectedUser.name : 'Utilisateur inconnu')
    : (selectedConversation.name || 'Conversation de groupe');
  const initials = initial(displayName);

  const messageElements = filteredMessages.length
    ? filteredMessages.map(msg => createMessageElement(msg))
    : [createElement('div', { class: 'text-gray-400 text-center' }, "Aucun message. Commencez la discussion !")];

  return [
    createElement('div', { class: 'p-4 bg-white border-b border-gray-200 flex items-center ' }, [
      createElement('div', { class: 'w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3' }, [
        createElement('span', { class: 'text-white font-medium text-sm' }, initials),
      ]),
      createElement('div', { class: 'flex-1 flex justify-between ' }, [
        createElement('div', {}, [
          createElement('h3', { class: 'font-medium text-gray-900' }, displayName),
          createElement('p', { class: 'text-sm text-gray-500' }, 'En ligne'),
        ]),
        createElement('div', { class: 'text-sm text-gray-500 flex' }, [
          btnicon.search,
          btnicon.dots
        ])
      ])
    ]),
    createElement('div', { class: 'flex-1 overflow-y-auto p-4 space-y-4', id: 'messages-container' }, messageElements),
    createElement('div', { class: 'p-4 bg-white border-t border-gray-200' }, [
      createElement('div', { class: 'flex items-center space-x-3' }, [
        recordingState
        ? createElement('div', { class: 'flex-1 flex items-center space-x-2' }, [
            createElement('span', { class: 'animate-pulse text-green-600 font-bold' }, '●'),
            createElement('span', { id: 'recording-timer', class: 'font-mono text-gray-700' }, formatSeconds(recordingSeconds)),
            createElement('span', { class: 'text-gray-500' }, 'Enregistrement...'),
            createElement('button', {
              class: 'ml-2 px-3 py-1 bg-red-500 text-white rounded-full',
              onclick: async () => {
                await stopRecording();
                clearInterval(recordingTimer);
                recordingState = false;
                setInputMessage('');
                window.renderChatArea && window.renderChatArea();
              }
            }, 'Stop')
          ])
        : createElement('input', {
            id: 'message-input',
            class: 'flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors',
            placeholder: 'Tapez votre message...',
            value: inputValue,
            oninput: (e) => {
              inputValue = e.target.value;
            },
            onkeypress: e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessageFromInput(selectedConversation);
                inputValue = '';
              }
            }
          }),
        createElement('button', {
          class: 'p-2 bg-green-500 hover:bg-green-600 rounded-full transition-colors',
          onclick: async () => {
            if (inputValue.trim() === '') {
              if (!recordingState) {
                await startRecording(selectedConversation);
                recordingState = true;
                recordingSeconds = 0;
                recordingTimer = setInterval(() => {
                  recordingSeconds++;
                  const timerEl = document.getElementById('recording-timer');
                  if (timerEl) timerEl.textContent = formatSeconds(recordingSeconds);
                }, 1000);
                window.renderChatArea && window.renderChatArea();
              } else {
                await stopRecording();
                clearInterval(recordingTimer);
                recordingState = false;
                window.renderChatArea && window.renderChatArea();
              }
            } else {
              sendMessageFromInput(selectedConversation);
              inputValue = '';
            }
          }
        }, [
          btnicon.micro
        ])
      ])
    ])
  ];
}

/**
 * 
 * @returns Un élément div HTML représentant l'interface de chat par défaut.
 * @description
 * Crée une interface utilisateur de chat par défaut qui s'affiche lorsque aucune conversation n'est sélectionnée.
 * Cette fonction affiche un message de bienvenue et invite l'utilisateur à sélectionner une conversation pour commencer à chatter.
 */
export function renderDefaultChat() {
  return createElement('div', {
    class: 'flex-1 flex items-center justify-center bg-gray-50'
  }, [
    createElement('div', {
      class: 'text-center text-gray-500'
    }, [
      createElement('div', {
        class: 'w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4'
      },
        btnicon.chat),
      createElement('h3', {
        class: 'text-lg font-medium text-gray-900 mb-2'
      }, 'Bienvenue sur SenChat 🇸🇳'),
      createElement('p', {
        class: 'text-sm text-gray-600'
      }, 'Sélectionnez une conversation pour commencer à chatter')
    ])
  ]);
}


/**
 * @description
 * Envoie un message à la conversation sélectionnée et met à jour l'interface utilisateur.
 * Cette fonction récupère la valeur du champ de saisie de message, envoie le message à l'API,
 * et rafraîchit la liste des messages de la conversation sélectionnée.
 * @async
 * @function sendMessageFromInput
 * @param {Object} selectedConversation - La conversation sélectionnée dans laquelle envoyer le message.
 * @returns {Promise<void>} - Une promesse qui se résout lorsque le message est envoyé et l'interface utilisateur est mise à jour.
 */
export async function sendMessageFromInput(selectedConversation) {
  const input = document.getElementById('message-input');
  if (!input) return;
  const value = input.value;
  await sendMessage(value, selectedConversation);

  setTimeout(async () => {
    const sidebar = document.getElementById('sidebar-content');
    if (sidebar) {
      sidebar.innerHTML = '';
      const elements = await showChatBase({
        onSelect: (conversation, user) => {
          window.selectedConversation = conversation;
          window.selectedUser = user;
          if (window.renderChatArea) window.renderChatArea();
        }
      });
      elements.forEach(el => sidebar.appendChild(el));
    }
  }, 300);

  input.value = '';
  await refreshMessages(selectedConversation);
}

/**
 * @function startChatPolling
 * @description
 * Démarre le polling pour rafraîchir les messages de la conversation sélectionnée.
 * Cette fonction utilise `setInterval` pour appeler `refreshMessages` toutes les secondes,
 * afin de mettre à jour l'interface utilisateur avec les nouveaux messages.
 * @returns {void}
 */
export function startChatPolling() {
  clearInterval(chatPollingInterval);
  chatPollingInterval = setInterval(() => {
    if (window.selectedConversation) {
      refreshMessages(window.selectedConversation);
    }
  }, 3000);
  window.chatPollingInterval = chatPollingInterval;
}
window.startChatPolling = startChatPolling;
/**
 * Rafraîchit les messages de la conversation sélectionnée.
 * Cette fonction récupère les messages de l'API, filtre ceux qui appartiennent à la conversation sélectionnée,
 * et met à jour l'interface utilisateur avec les messages triés par date.
 * @async
 * @function refreshMessages
 * @param {Object} selectedConversation - La conversation sélectionnée pour laquelle rafraîchir les messages.
 * @returns {Promise<void>} - Une promesse qui se résout lorsque les messages sont rafraîchis et l'interface utilisateur est mise à jour.
 */
async function refreshMessages(selectedConversation) {
  const response = await fetch(`${API_URL}/messages`);
  const allMessages = await response.json();

  const filteredMessages = Array.isArray(allMessages)
  ? allMessages
    .filter(msg => String(msg.conversationId) === String(selectedConversation.id))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  : [];

  const messagesContainer = document.getElementById('messages-container');
  if (messagesContainer) {
    messagesContainer.innerHTML = '';
    for (const msg of filteredMessages) {
      messagesContainer.appendChild(createMessageElement(msg));
      const currentUser = getCurrentUser();
      if (
        Number(msg.senderId) !== Number(currentUser.id) &&
        msg.status !== 'lu'
      ) {
        await fetch(`${API_URL}/messages/${msg.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'lu' })
        });
      }
    }
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
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

