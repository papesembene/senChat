import { createElement,createButton,createInput } from './Function.js';
import { codeColors } from '../utils/colors.js';
import { btnicon } from '../utils/constants.js'
import { getCurrentUser } from '../Services/auth.js';
const API_URL = import.meta.env.VITE_API_URL;


// Variable globale pour stocker la conversation sélectionnée
let selectedConversation = null;
let selectedUser = null;

/**
 * ShowChat - Composant pour afficher une interface de chat
 * @returns {HTMLElement} L'élément HTML représentant l'interface de chat
 * @description Crée une interface de chat avec une barre latérale, une zone de conversation et une zone de saisie.
 */
    export function ShowChat() 
    {
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
                        createElement('img',{
                            src: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
                            alt: 'Logo',
                            class: 'w-8 h-8 rounded-full mt-4 cursor-pointer hover:bg-gray-200 p-1 transition-colors'
                        })
                    ])
                ]),
                // Barre latérale des conversations
                createElement('div', { class: 'w-[35%] h-full bg-green-200 border-r border-gray-200 flex flex-col' }, [
                    // Header des conversations
                    createElement('div', { class: 'p-4 bg-gray-50 border-b border-gray-200' }, [
                        createElement('div', { class: 'flex items-center justify-between mb-3' }, [
                            createElement('h2', { class: 'text-lg font-medium text-gray-900' }, 'SenChat 🇸🇳'),
                            createElement('div', { class: 'flex space-x-2' }, [
                                createElement('button', { class: 'p-2 hover:bg-gray-200 rounded-full transition-colors' }, [
                                    createElement('svg', { class: 'w-5 h-5 text-gray-600', fill: 'currentColor', viewBox: '0 0 24 24' }, [
                                        createElement('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z' })
                                    ])
                                ])
                            ])
                        ]),
                        // Barre de recherche
                        createElement('div', { class: 'relative' }, [
                            createElement('input', { 
                                class: 'w-full  border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none focus:border-green-500',
                                placeholder: 'Rechercher une conversation...',
                            }),  
                        ]),
                        // Boutons de filtrage
                        createElement('div',{
                            class:'flex items-center justify-center mb-3 text-sm mt-4',
                        },[
                            createButton({
                                class: 'p-2  w-[25%] hover:bg-gray-50 h-[50%] border border-solid border-green-500 rounded-full  mr-1',
                                type: 'button'
                            }, 'Toutes'),
                            createButton({
                                class: 'p-2 hover:bg-gray-50 w-[25%] rounded-full border border-solid border-green-500  text-ellipsis whitespace-nowrap',
                                type: 'button'
                            }, 'Non Lues'),
                            createButton({
                                class: 'p-2 hover:bg-gray-50 w-[25%] rounded-full border border-solid border-green-500 transition-colors ml-1',
                                type: 'button'
                            }, 'Favoris'),
                            createButton({
                                class: 'p-2 hover:bg-gray-50 w-[25%] rounded-full border border-solid border-green-500 transition-colors ml-1',
                                type: 'button'
                            }, 'Groupes'),
                        ]),
                    ]),
                    
                    createElement('div', { 
                        class: 'flex-1 overflow-y-auto bg-gray-50',
                        id: 'conversation-list',
                        vFor: {
                            each: Promise.all([
                                fetch(`${API_URL}/conversations`).then(res => res.json()),
                                fetch(`${API_URL}/users`).then(res => res.json())
                            ]).then(([conversations, users]) => {
                                return conversations.map(conversation => ({
                                    ...conversation,
                                    users: users
                                }));
                            }),
                            render: (conversation, index) => {
                                const currentUser = getCurrentUser();  
                                const currentId = Number(currentUser.id);
                                if (!conversation.participants.includes(currentId)) return null;                                     
                                const otherParticipantId = conversation.participants.find(id => id !== currentId);
                                const otherParticipant = conversation.users.find(user => Number(user.id) === otherParticipantId);
                                const displayName = conversation.type === 'prive' ? 
                                    (otherParticipant ? otherParticipant.name : 'Utilisateur inconnu') : 
                                    (conversation.name || 'Conversation de groupe');
                                const initials = initial(displayName)     
                                const formatTime = (timestamp) => {
                                    const date = new Date(timestamp);
                                    return date.toLocaleTimeString('fr-FR', { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    });
                                };   
                                return createElement('div', { 
                                    class: 'flex items-center p-3 hover:bg-gray-50 cursor-pointer hover:bg-green-200 bg-red border-b border-gray-100',
                                    onClick: () => {
                                        selectedConversation = conversation;
                                        console.log(selectedConversation);
                                        selectedUser = otherParticipant;
                                        renderChatArea();
                                    }
                                }, [
                                    createElement('div', { 
                                        class: 'w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-3' 
                                    }, [
                                        createElement('span', { 
                                            class: 'text-white font-medium' 
                                        }, initials)
                                    ]),
                                    createElement('div', { 
                                        class: 'flex-1 min-w-0' 
                                    }, [
                                        createElement('div', { 
                                            class: 'flex items-center justify-between mb-1' 
                                        }, [
                                            createElement('h3', { 
                                                class: 'text-sm font-medium text-gray-900 truncate' 
                                            }, displayName),
                                            createElement('span', { 
                                                class: 'text-xs text-gray-500' 
                                            }, conversation.lastActivity ? formatTime(conversation.lastActivity) : '')
                                        ]),
                                        createElement('p', { 
                                            class: 'text-sm text-gray-600 truncate' 
                                        }, conversation.lastMessage || 'Aucun message')
                                    ])
                                ]);
                            }
                        }
                    })
                ]),
                
                // Zone de chat principale 
                createElement('div', { 
                    class: 'w-[60%] h-full bg-green-200 flex flex-col',
                    id: 'chat-area'
                }, [
                    
                    selectedConversation ? renderSelectedChat() : renderDefaultChat()
                ])
            ])
        ]);
    }

// Fonction pour afficher l'état par défaut
    function renderDefaultChat() 
    {
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

function initial (name)
{
    return name.split(' ').map(word=>word.charAt(0).toUpperCase())
    .slice(0,2)
    .join('')
}

/**
 * 
 * @description Fonction pour afficher la conversation sélectionnée
 */
    async function renderSelectedChat() {
        const displayName = selectedConversation.type === 'prive' ? 
            (selectedUser ? selectedUser.name : 'Utilisateur inconnu') : 
            (selectedConversation.name || 'Conversation de groupe');
        
        const initials = initial(displayName)
        const conversationMessages =  await loadMessages() 
        console.log(conversationMessages);
        
        const filteredMessages = Array.isArray(conversationMessages)
            ? conversationMessages
                .filter(msg => Number(msg.conversationId) === Number(selectedConversation.id))
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            : []; 
        const messageElements = filteredMessages.map(msg => {
        //    console.log('type bi', msg.senderId);
            const isSentByCurrentUser = Number(msg.senderId) === Number(getCurrentUser().id);
            return createElement('div', {
                class: `flex items-start ${isSentByCurrentUser ? 'justify-end' : ''}`
            }, [
                createElement('div', {
                    class: `${isSentByCurrentUser ? 'bg-green-500 text-white' : 'bg-white text-gray-800'} rounded-lg p-3 max-w-xs shadow-sm`
                }, [
                    createElement('p', { class: 'text-sm' }, msg.content),
                    createElement('span', {
                        class: `text-xs mt-1 block ${isSentByCurrentUser ? 'text-green-100' : 'text-gray-500'}`
                    }, new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
                ])
            ]);
        });
    
    return [
            //  Header
            createElement('div', { class: 'p-4 bg-white border-b border-gray-200 flex items-center ' }, [
                createElement('div', { class: 'w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3' }, [
                    createElement('span', { class: 'text-white font-medium text-sm' }, initials),   
                ]),
                createElement('div', { class: 'flex-1  flex justify-between ' }, [
                    createElement('div',{},[
                        createElement('h3', { class: 'font-medium text-gray-900' }, displayName),
                    createElement('p', { class: 'text-sm text-gray-500' }, 'En ligne'),
                    ]),
                    createElement('div', { class: 'text-sm text-gray-500 flex' }, [
                        btnicon.search,
                        btnicon.dots
                    ])
                ])
            ]),
            // Zone des messages réels
            createElement('div', { class: 'flex-1 overflow-y-auto p-4 space-y-4' }, messageElements),

            //  Zone de saisie
            createElement('div', { class: 'p-4 bg-white border-t border-gray-200' }, [
                createElement('div', { class: 'flex items-center space-x-3' }, [
                    createElement('input', {
                        class: 'flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors',
                        placeholder: 'Tapez votre message...',
                        oninput: e => inputMessage = e.target.value
                    }),
                    createElement('button', {
                        class: 'p-2 bg-green-500 hover:bg-green-600 rounded-full transition-colors',
                        // onclick: sendMessage
                    }, [
                        btnicon.send
                    ])
                ])
            ])
        ];
    }


/**
 * 
 *  @return {HTMLElement} 
 * @description Fonction pour mettre à jour la zone de chat
 * */
    async function renderChatArea() 
    {
        const chatArea = document.getElementById('chat-area');
        if (chatArea) {
            chatArea.innerHTML = ''; // On vide
            const newContent = await renderSelectedChat(); // on attend ici
            if (Array.isArray(newContent)) {
                newContent.forEach(el => chatArea.appendChild(el));
            } else {
                chatArea.appendChild(newContent);
            }
        }
    }

/**
 * 
 * @description permet de charger les messages 
 */
    async function loadMessages() 
    {
        try {
            const response = await fetch(`${API_URL}/messages`);
            const messages = await response.json(); 
            return messages;
        } catch (error) {
            console.error("Erreur lors du chargement des messages :", error);
        }
    }



