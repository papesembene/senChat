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

  // Charge conversations ET groupes
  const [conversations, groupes, users, allMessages] = await Promise.all([
    fetch(`${API_URL}/conversations`).then(res => res.json()),
    fetch(`${API_URL}/groupes`).then(res => res.json()),
    fetch(`${API_URL}/users`).then(res => res.json()),
    fetch(`${API_URL}/messages`).then(res => res.json())
  ]);

  // Pour chaque groupe, trouve le dernier message (par date)
  const groupLastMessages = {};
  groupes.forEach(group => {
    const groupMsgs = allMessages
      .filter(msg => String(msg.groupId) === String(group.id))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    if (groupMsgs.length) {
      groupLastMessages[group.id] = groupMsgs[0];
    }
  });

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

    // Filtre conversations privées
    const filteredConvos = conversations.filter(conversation => {
      if (!conversation.participants.includes(currentId)) return false;
      const otherParticipantId = conversation.participants.find(id => Number(id) !== currentId);
      const otherParticipant = users.find(user => String(user.id) === String(otherParticipantId));
      const displayName = conversation.type === 'prive'
        ? (otherParticipant ? otherParticipant.name : 'Utilisateur inconnu')
        : (conversation.name || 'Conversation de groupe');
      return !searchValue || displayName.toLowerCase().includes(searchValue.toLowerCase());
    });

    // Filtre groupes où je suis membre
    const filteredGroups = groupes.filter(group =>
      group.participants &&
      group.participants.some(pid => String(pid) === String(currentId)) && 
      (!searchValue || (group.name && group.name.toLowerCase().includes(searchValue.toLowerCase())))
    );

    // Trie par date (optionnel)
    const allItems = [
      ...filteredGroups.map(g => ({ ...g, isGroup: true, type: 'groupe' })), 
      ...filteredConvos.map(c => ({ ...c, isGroup: false, type: 'prive' }))  
    ].sort((a, b) => new Date(b.lastActivity || b.createdAt) - new Date(a.lastActivity || a.createdAt));

    for (const item of allItems) {
      if (item.isGroup) {
        // Affichage d'un groupe
        const groupItem = createElement('div', {
          class: 'flex items-center p-3 hover:bg-green-100 rounded-lg cursor-pointer transition-colors duration-200 mb-1',
          onclick: () => onSelect(item, null)
        }, [
          item.photo
            ? createElement('img', {
                src: item.photo,
                class: 'w-12 h-12 rounded-full object-cover mr-3 border border-green-400'
              })
            : createElement('div', {
                class: 'w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3'
              }, [
                (() => {
                  const div = document.createElement('div');
                  div.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm4-3a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM2 13s-1 0-1-1 1-4 7-4 7 3 7 4-1 1-1 1H2zm13-1c0-1-2.686-3-7-3s-7 2-7 3 2.686 3 7 3 7-2 7-3z"/>
                    </svg>
                  `;
                  return div.firstChild;
                })()
              ]),
          createElement('div', { class: 'flex-1 min-w-0' }, [
            createElement('div', { class: 'flex items-center justify-between mb-1' }, [
              createElement('h3', { class: 'text-sm font-medium text-gray-900 truncate' }, item.name),
              createElement('span', { class: 'text-xs text-gray-500' }, item.createdAt ? new Date(item.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '')
            ]),
            createElement('p', { class: 'text-xs text-gray-500' }, 'Groupe')
          ])
        ]);
        conversationList.appendChild(groupItem);
      } else {
        const otherParticipantId = item.participants.find(id => Number(id) !== currentId);
  const otherParticipant = users.find(user => String(user.id) === String(otherParticipantId));
  const displayName = otherParticipant ? otherParticipant.name : 'Utilisateur inconnu';
  const convoItem = createElement('div', {
    class: 'flex items-center p-3 hover:bg-green-50 rounded-lg cursor-pointer transition-colors duration-200 mb-1',
    onclick: () => onSelect(item, otherParticipant)
  }, [
    createElement('div', {
      class: 'w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-3 text-white font-bold'
    }, [
      createElement('span', {}, displayName.charAt(0).toUpperCase())
    ]),
    createElement('div', { class: 'flex-1 min-w-0' }, [
      createElement('div', { class: 'flex items-center justify-between mb-1' }, [
        createElement('h3', { class: 'text-sm font-medium text-gray-900 truncate' }, displayName),
        createElement('span', { class: 'text-xs text-gray-500' }, item.lastActivity ? new Date(item.lastActivity).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '')
      ]),
      createElement('p', { class: 'text-xs text-gray-500 truncate' }, 
        (() => {
          if (item.isGroup) {
            const lastMsg = groupLastMessages[item.id];
            if (lastMsg) {
              // Trouver le nom de l'expéditeur
              let senderName = 'Inconnu';
              if (String(lastMsg.senderId) === String(currentId)) {
                senderName = 'Vous';
              } else {
                const user = users.find(u => String(u.id) === String(lastMsg.senderId));
                if (user && user.name) senderName = user.name;
                // Si tu veux chercher dans contacts aussi, décommente ci-dessous :
                // else {
                //   const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
                //   const contact = contacts.find(c => String(c.id) === String(lastMsg.senderId));
                //   if (contact && contact.name) senderName = contact.name;
                // }
              }
              if (lastMsg.type === 'audio') {
                return `${senderName} : 🎤 Message vocal`;
              }
              return `${senderName} : ${lastMsg.content}`;
            }
            return 'Aucun message';
          } else {
            // Conversation privée
            const convoMsgs = allMessages
              .filter(msg => String(msg.conversationId) === String(item.id))
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            if (convoMsgs.length) {
              const lastMsg = convoMsgs[0];
              return lastMsg.type === 'audio'
                ? '🎤 Message vocal'
                : lastMsg.content;
            }
            return 'Aucun message';
          }
        })()
      )
    ])
  ]);
  conversationList.appendChild(convoItem);
      }
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
//  const chatArea = document.getElementById('chat-area');
//   if (chatArea) {
//     chatArea.innerHTML = '';
//     chatArea.appendChild(createLoaderMessage("Connexion lente... Chargement des messages"));
//   }
//   await new Promise(res => setTimeout(res, 1500));
  const response = await fetch(`${API_URL}/messages`);
  const allMessages = await response.json();

  const filteredMessages = Array.isArray(allMessages)
  ? allMessages
    .filter(msg =>
      selectedConversation.type === 'prive'
        ? String(msg.conversationId) === String(selectedConversation.id)
        : String(msg.groupId) === String(selectedConversation.id) // Pour les groupes
    )
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  : [];

  const displayName = selectedConversation.type === 'prive'
    ? (selectedUser ? selectedUser.name : 'Utilisateur inconnu')
    : (selectedConversation.name || 'Conversation de groupe');
  const initials = initial(displayName);
const isGroup = selectedConversation && selectedConversation.type === 'groupe';

let membersLine = null;
if (isGroup) {
  // Récupère tous les utilisateurs
  const responseUsers = await fetch(`${API_URL}/users`);
  const contacts = await fetch(`${API_URL}/contacts`).then(res => res.json());
  const users = await responseUsers.json();
  const currentUser = getCurrentUser();

  // Affiche "Vous" pour l'utilisateur courant, sinon le nom du membre
  const uniqueIds = Array.from(new Set(selectedConversation.participants || []));
  const memberNames = uniqueIds.map(id => {
    if (String(id) === String(currentUser.id)) return "Vous";
    // Cherche dans users
    // const user = users.find(u => String(u.id) === String(id));
    // if (user && user.name) return user.name;
    // Sinon cherche dans contacts (pour les membres ajoutés qui ne sont pas dans users)
    // Optionnel : à activer si besoin
    const contact = contacts.find(c => String(c.id) === String(id));
    if (contact && contact.name) return contact.name;
    return "Inconnu";
  });

  let displayMembers = memberNames.join(', ');

  membersLine = createElement('div', {
    class: 'text-xs text-gray-400 truncate',
    style: 'max-width: 90%;'
  }, displayMembers);
}

// Header du chat
const header = createElement('div', { class: 'p-4 bg-white border-b border-gray-200 flex items-center ' }, [
  // Affiche la photo du groupe OU les initiales du contact
  isGroup
    ? createElement('img', {
        src: selectedConversation.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(selectedConversation.name),
        class: 'w-10 h-10 rounded-full object-cover mr-3 border border-green-400'
      })
    : createElement('div', {
        class: 'w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg mr-3',
        style: 'user-select:none;'
      }, [
        createElement('span', {}, (selectedUser?.name || 'U').charAt(0).toUpperCase())
      ]),
  createElement('div', { class: 'flex-1 flex flex-col min-w-0' }, [
    createElement('div', { class: 'font-medium text-gray-900 truncate' },
      isGroup ? selectedConversation.name : (selectedUser?.name || '')
    ),
    isGroup ? membersLine : null
  ]),
  createElement('div', { class: 'text-sm text-gray-500 flex ml-2' }, [
    btnicon.search,
    btnicon.dots
  ])
]);

  const messageElements = filteredMessages.length
    ? filteredMessages.map(msg => createMessageElement(msg))
    : [createElement('div', { class: 'text-gray-400 text-center' }, "Aucun message. Commencez la discussion !")];

  return [
    header,
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
    .filter(msg =>
      selectedConversation.type === 'prive'
        ? String(msg.conversationId) === String(selectedConversation.id)
        : String(msg.groupId) === String(selectedConversation.id) 
    )
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




