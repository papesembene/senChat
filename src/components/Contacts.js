import { createElement } from "./Function.js";
import { btnicon } from "../utils/constants.js";
import { getCurrentUser } from "../Services/auth.js";
import { showChatBase } from "./ChatUI.js";
import {createAddContactForm} from "./FormContact.js"
import {AddGroupcomposant} from "./Groups.js"
const API_URL = import.meta.env.VITE_API_URL;

export async function DisplayContact() {
  const [contacts] = await Promise.all([
    fetch(`${API_URL}/contacts`).then(res => res.json())
  ]);
  const currentUserId = getCurrentUser().id;
  const userContacts = contacts.filter(contact => contact.ownerId == currentUserId);
  
  const contactHeader = createElement('div', { class: 'p-4 bg-gray-50 border-b border-gray-200' }, [
    createElement('div', { class: 'flex items-center gap-6 mb-3' }, [
      createElement('div', { class: 'flex' }, [btnicon.arrow_left]),
      createElement('h2', { class: 'flex' }, 'Nouvelle Discussion')
    ]),
    createElement('div', { class: 'relative' }, [
      createElement('input', {
        class: 'w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none focus:border-green-500',
        placeholder: 'Rechercher une conversation...',
        autofocus: true
      }),
    ]),
    createElement('div', { class: 'flex items-center mb-3 text-sm mt-4 w-full' }, [
      createElement('div', {
        class: 'w-full',
      }, [
        createElement('div', {
          class: 'flex gap-4 border-b cursor-pointer hover:bg-green-200 py-3 hover:scale-105 transition duration-300 ease-in-out',
          onclick: async() => {
            const barre = document.querySelector('.w-\\[35\\%\\]')
            if(barre){
                barre.innerHTML = ''
                const addGroupComposant = await AddGroupcomposant()
                barre.append(addGroupComposant)
            }
          }
        }, [
          btnicon.new_group,
          createElement('div', {}, createElement('h2', { class: 'p-4' }, 'Nouveau Groupe'))
        ]),
        createElement('div', {
          class: 'flex gap-4 border-b cursor-pointer hover:bg-green-200 py-3 hover:scale-105 transition duration-300 ease-in-out',
          onclick: () => {
            
            const barre = document.querySelector('.w-\\[35\\%\\]');
            if (barre) {
              barre.innerHTML = '';
              const addContactForm = createAddContactForm();
              barre.appendChild(addContactForm);
            }
          }
        }, [
          btnicon.new_contact,
          createElement('div', { class: 'p-4' }, createElement('h2', { class: '' }, 'Nouveau contact'))
        ]),
        createElement('div', {
          class: 'flex gap-4 border-b cursor-pointer hover:bg-green-200 py-3 hover:scale-105 transition duration-300 ease-in-out'
        }, [
          btnicon.new_community,
          createElement('div', { class: 'p-4' }, createElement('h2', {}, 'Nouvelle Communaute'))
        ]),
      ])
    ])
  ]);
  
  const contactsList = createElement('div', {
    class: 'flex-1 overflow-y-auto max-h-[calc(100vh-300px)]'
  }, [
    createElement('div', { class: 'p-2' }, [
      createElement('h3', {
        class: 'text-sm font-semibold text-gray-600 mb-2 px-2'
      }, 'Contacts'),
      ...createContactItems(userContacts)
    ])
  ]); 
  
  const contactContainer = createElement('div', {
    class: 'h-full flex flex-col'
  }, [
    contactHeader,
    contactsList
  ]);
  
  return contactContainer;
}

export function ShowChat() {
  const barre = createElement('div', { 
    class: 'w-[35%] h-full border-r border-gray-200 flex flex-col',
    id: 'sidebar-content' 
  });
  showChatBase().then(elements => {
    elements.forEach(el => {
      barre.appendChild(el);
    });
  }).catch(error => {
    console.error('Erreur lors du chargement de showChatBase:', error);
    const errorElement = createElement('div', {
      class: 'p-4 text-center text-red-500'
    }, 'Erreur lors du chargement du chat');
    barre.appendChild(errorElement);
  });

  return createElement('div', {
    class: 'w-full h-screen bg-gray-150 flex items-center justify-center',
  }, [
    createElement('div', { class: 'bg-white flex rounded-lg shadow-lg w-[1400px] mx-4 h-[850px] overflow-hidden' }, [
      createElement('div', { class: `w-[5%] h-full bg-${codeColors.green}-500 flex flex-col items-center py-4` }, [
        createElement('div', { class: 'flex flex-col space-y-4 justify-center items-center' }, [
          btnicon.message,
          btnicon.story,
          btnicon.channel,
          btnicon.groupe,
          btnicon.settings,
          createElement('img', {
            src: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
            alt: 'Logo',
            class: 'w-8 h-8 rounded-full mt-4 cursor-pointer hover:bg-gray-200 p-1 transition-colors'
          })
        ])
      ]),
      // Barre latérale des conversations
      barre,
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

/**
 * 
 * @param {} contacts 
 * @description Fonction pour créer les éléments de contact
 */
 export function createContactItems(contacts) {
    return contacts.map(contact => {
        return createElement('div', {
            class: 'flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200 mb-1',
            onclick: () => selectContact(contact)
        }, [
            createElement('div', {
                class: 'w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-3'
            }, [
                createElement('span', {}, contact.name.charAt(0).toUpperCase())
            ]),
            createElement('div', { class: 'flex-1' }, [
                createElement('h4', {
                    class: 'font-medium text-gray-900'
                }, contact.name),
                createElement('p', {
                    class: 'text-sm text-gray-500'
                }, `${contact.codecountry} ${contact.telephone}`)
            ])
        ]);
    });
}



function selectContact(contact) {
    // Fonction appelée quand on clique sur un contact
    console.log('Contact sélectionné:', contact);
    // Tu peux ici ouvrir une conversation avec ce contact
}