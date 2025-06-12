import { createElement, createButton } from './Function.js';
import { btnicon } from '../utils/constants.js'
import { getCurrentUser } from '../Services/auth.js';
import { createMessageElement, sendMessage } from './Message.js';

const API_URL = import.meta.env.VITE_API_URL;

export let chatPollingInterval = null;

export async function showChatBase({ onSelect }) {
  const currentUser = getCurrentUser();
  const currentId = Number(currentUser.id);

  const [conversations, users] = await Promise.all([
    fetch(`${API_URL}/conversations`).then(res => res.json()),
    fetch(`${API_URL}/users`).then(res => res.json())
  ]);

  conversations.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
  const chatHeader = createElement('div', { class: 'p-4 bg-gray-50 border-b border-gray-200' }, [
    createElement('div', { class: 'flex items-center justify-between mb-3' }, [
      createElement('h2', { class: 'text-lg font-medium text-gray-900' }, 'SenChat 🇸🇳'),
      createElement('div', { class: 'flex' }, [btnicon.add, btnicon.dots2])
    ]),
    createElement('div', { class: 'relative' }, [
      createElement('input', {
        class: 'w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none focus:border-green-500',
        placeholder: 'Rechercher une conversation...',
      }),
    ]),
    createElement('div', { class: 'flex items-center justify-center mb-3 text-sm mt-4' }, [
      createButton({ class: 'p-2 w-[25%] hover:bg-gray-50 h-[50%] border border-solid border-green-500 rounded-full  mr-1' }, 'Toutes'),
      createButton({ class: 'p-2 hover:bg-gray-50 w-[25%] rounded-full border border-solid border-green-500 text-ellipsis whitespace-nowrap' }, 'Non Lues'),
      createButton({ class: 'p-2 hover:bg-gray-50 w-[25%] rounded-full border border-solid border-green-500 transition-colors ml-1' }, 'Favoris'),
      createButton({ class: 'p-2 hover:bg-gray-50 w-[25%] rounded-full border border-solid border-green-500 transition-colors ml-1' }, 'Groupes'),
    ])
  ]);

  const conversationList = createElement('div', {
    class: 'flex-1 overflow-y-auto bg-gray-50',
    
  });

  for (const conversation of conversations) {
    if (!conversation.participants.includes(currentId)) continue;
    const otherParticipantId = conversation.participants.find(id => Number(id) !== currentId);
    let otherParticipant = users.find(user => Number(user.id) === Number(otherParticipantId));
    if (!otherParticipant) {
      const contacts = await fetch(`${API_URL}/contacts`).then(res => res.json());
      otherParticipant = contacts.find(c => Number(c.id) === Number(otherParticipantId));
    }
    const displayName = conversation.type === 'prive'
      ? (otherParticipant ? otherParticipant.name : 'Utilisateur inconnu')
      : (conversation.name || 'Conversation de groupe');
    const initials = initial(displayName);

    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const convoItem = createElement('div', {
      class: 'flex items-center p-3 hover:bg-gray-50 cursor-pointer hover:bg-green-200 border-b border-gray-100',
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
        createElement('p', { class: 'text-sm text-gray-600 truncate' }, conversation.lastMessage || 'Aucun message')
      ])
    ]);
    conversationList.appendChild(convoItem);
  }

  return [
    chatHeader,
    conversationList
  ];
}

export async function renderSelectedChat(selectedConversation, selectedUser, inputMessage, setInputMessage) {
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
        createElement('input', {
          id: 'message-input',
          class: 'flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors',
          placeholder: 'Tapez votre message...',
          onkeypress: e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessageFromInput(selectedConversation);
            }
          }
        }),
        createElement('button', {
          class: 'p-2 bg-green-500 hover:bg-green-600 rounded-full transition-colors',
          onclick: () => sendMessageFromInput(selectedConversation)
        }, [
          btnicon.send
        ])
      ])
    ])
  ];
}

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

function initial(name) {
  return name.split(' ').map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

export async function sendMessageFromInput(selectedConversation) {
  const input = document.getElementById('message-input');
  if (!input) return;
  const value = input.value;
  await sendMessage(value, selectedConversation);

  setTimeout(async () => {
    const sidebar = document.getElementById('sidebar-content');
    if (sidebar) {
      // Log pour debug
      console.log('VIDAGE sidebar-content', sidebar.childNodes.length);
      // Toujours vider avant d'ajouter
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

export function startChatPolling(selectedConversation) {
  clearInterval(chatPollingInterval);
  chatPollingInterval = setInterval(() => {
    refreshMessages(selectedConversation);
  }, 1000);
  window.chatPollingInterval = chatPollingInterval;
}

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