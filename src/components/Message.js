import { createElement } from './Function.js';
import { getCurrentUser } from '../Services/auth.js';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Générer un ID unique pour le message
 */
export function generateMessageId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

/**
 * Ajouter le message à l'interface utilisateur
 */
export function addMessageToUI(message) {
  const messagesContainer = document.getElementById('messages-container');
  if (!messagesContainer) return;
  const messageElement = createMessageElement(message);
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Créer l'élément DOM pour un message
 */
export function createMessageElement(msg) {
  const currentUserId = getCurrentUser().id;
  const isSentByCurrentUser = Number(msg.senderId) === Number(currentUserId);

  return createElement('div', {
    class: `flex items-start ${isSentByCurrentUser ? 'justify-end' : ''}`,
    'data-message-id': msg.id
  }, [
    createElement('div', {
      class: `${isSentByCurrentUser ? 'bg-green-500 text-white' : 'bg-white text-gray-800'} rounded-lg p-3 max-w-xs shadow-sm relative`
    }, [
      createElement('p', { class: 'text-sm break-words' }, msg.content),
      createElement('div', { class: 'flex items-center justify-between mt-1' }, [
        createElement('span', {
          class: `text-xs ${isSentByCurrentUser ? 'text-green-100' : 'text-gray-500'}`
        }, new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
        isSentByCurrentUser ? createElement('span', {
          class: `message-status text-xs ml-2 ${getStatusClass(msg.status)}`,
          'data-status': msg.status
        }, getStatusIcon(msg.status)) : null
      ])
    ])
  ]);
}

/**
 * Obtenir la classe CSS pour le statut du message
 */
export function getStatusClass(status) {
  switch (status) {
    case 'envoye': return 'text-green-200';
    case 'recu': return 'text-green-200';
    case 'lu': return 'text-green-200';
    case 'echec': return 'text-red-300';
    default: return 'text-gray-300';
  }
}

/**
 * Obtenir l'icône pour le statut du message
 */
export function getStatusIcon(status) {
  switch (status) {
    case 'envoye': return '✓';
    case 'recu': return '✓✓';
    case 'lu': return '✓✓';
    case 'echec': return '✗';
    default: return '○';
  }
}

/**
 * Mettre à jour le statut d'un message
 */
export function updateMessageStatus(messageId, status) {
  const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
  if (messageElement) {
    const statusElement = messageElement.querySelector('.message-status');
    if (statusElement) {
      statusElement.textContent = getStatusIcon(status);
      statusElement.className = `message-status text-xs ml-2 ${getStatusClass(status)}`;
      statusElement.setAttribute('data-status', status);
    }
  }
}

/**
 * Afficher une notification d'erreur
 */
export function showErrorNotification(message) {
  const notification = createElement('div', {
    class: 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50',
    style: 'animation: slideIn 0.3s ease-out'
  }, [
    createElement('p', { class: 'text-sm' }, message)
  ]);
  document.body.appendChild(notification);
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

/**
 * Envoyer un message
 */
export async function sendMessage(inputMessage, selectedConversation) {
  if (!inputMessage || inputMessage.trim() === '') return;
  if (!selectedConversation) return;
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const newMessage = {
    id: generateMessageId(),
    conversationId: Number(selectedConversation.id),
    senderId: Number(currentUser.id),
    type: 'text',
    content: inputMessage.trim(),
    timestamp: new Date().toISOString(),
    status: 'envoye'
  };

  try {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.appendChild(createMessageElement(newMessage));
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMessage)
    });

    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

    await response.json();
    updateMessageStatus(newMessage.id, 'envoye');

    // Met à jour la conversation (dernier message + date)
    await updateConversationLastActivity(selectedConversation.id, newMessage.content);

    // Rafraîchir la liste des conversations après un court délai
    setTimeout(() => {
      const sidebar = document.getElementById('sidebar-content');
      if (sidebar) {
        sidebar.innerHTML = '';
        import('./ChatUI.js').then(module => {
          module.showChatBase({
            onSelect: (conversation, user) => {
              window.selectedConversation = conversation;
              window.selectedUser = user;
              if (window.renderChatArea) window.renderChatArea();
            }
          }).then(elements => {
            elements.forEach(el => sidebar.appendChild(el));
          });
        });
      }
    }, 300);

    const responseUsers = await fetch(`${API_URL}/users`);
    const users = await responseUsers.json();
    const otherId = selectedConversation.participants.find(id => Number(id) !== Number(currentUser.id));
    const otherUser = users.find(u => Number(u.id) === Number(otherId));
    if (otherUser && otherUser.status === 'en ligne') {
     
      await fetch(`${API_URL}/messages/${newMessage.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'recu' })
      });
    }
  } catch (error) {
    updateMessageStatus(newMessage.id, 'echec');
    showErrorNotification('Impossible d\'envoyer le message. Veuillez réessayer.');
  }
}

/**
 * Met à jour la dernière activité d'une conversation
 */
async function updateConversationLastActivity(conversationId, lastMessage) {
  try {
    const updateData = {
      lastMessage: lastMessage,
      lastActivity: new Date().toISOString()
    };

    const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) throw new Error('Erreur lors de la mise à jour de la conversation');
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la conversation:', error);
  }
}