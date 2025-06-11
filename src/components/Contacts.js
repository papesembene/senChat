import { createElement } from "./Function.js";
import { btnicon } from "../utils/constants.js";
import { getCurrentUser } from "../Services/auth.js";

const API_URL = import.meta.env.VITE_API_URL;
/**
 * 
 * @returns 
 */
function createAddContactForm() {
  return createElement('div', {
    class: 'h-full flex flex-col'
  }, [
    // Header du formulaire
    createElement('div', { class: 'p-4 bg-gray-50 border-b border-gray-200' }, [
      createElement('div', { class: 'flex items-center gap-6 mb-3' }, [
        createElement('div', { class: 'flex' }, [btnicon.arrow_left]),
        createElement('h2', { class: 'flex font-semibold text-lg' }, 'Nouveau Contact')
      ])
    ]),
    
    // Formulaire
    createElement('div', { class: 'flex-1 p-6' }, [
      createElement('form', {
        class: 'space-y-6',
        onsubmit: (e) => {
          e.preventDefault();
          // Ici vous pouvez traiter les données du formulaire
          const formData = new FormData(e.target);
          const contactData = {
            nom: formData.get('nom'),
            prenom: formData.get('prenom'),
            numero: formData.get('numero')
          };
          console.log('Nouveau contact:', contactData);
          
          // Ajouter ici la logique pour sauvegarder le contact
          // Par exemple: saveContact(contactData)
          
          // Retourner à la liste des contacts
          const barre = document.querySelector('.w-\\[35\\%\\]');
          if (barre) {
            barre.innerHTML = '';
            DisplayContact().then(contactElement => {
              barre.appendChild(contactElement);
            });
          }
        }
      }, [
        // Champ Nom
        createElement('div', { class: 'space-y-2' }, [
          createElement('label', { 
            class: 'flex items-center gap-2 text-sm font-medium text-gray-700',
            for: 'nom'
          }, [
            createElement('svg', {
              class: 'w-5 h-5 text-gray-500',
              fill: 'currentColor',
              viewBox: '0 0 20 20'
            }, [
              createElement('path', {
                'fill-rule': 'evenodd',
                d: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z',
                'clip-rule': 'evenodd'
              })
            ]),
            'Nom'
          ]),
          createElement('input', {
            type: 'text',
            id: 'nom',
            name: 'nom',
            required: true,
            class: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none',
            placeholder: 'Entrez le nom'
          })
        ]),
        
        // Champ Prénom
        createElement('div', { class: 'space-y-2' }, [
          createElement('label', { 
            class: 'flex items-center gap-2 text-sm font-medium text-gray-700',
            for: 'prenom'
          }, [
            createElement('svg', {
              class: 'w-5 h-5 text-gray-500',
              fill: 'currentColor',
              viewBox: '0 0 20 20'
            }, [
              createElement('path', {
                'fill-rule': 'evenodd',
                d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z',
                'clip-rule': 'evenodd'
              })
            ]),
            'Prénom'
          ]),
          createElement('input', {
            type: 'text',
            id: 'prenom',
            name: 'prenom',
            required: true,
            class: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none',
            placeholder: 'Entrez le prénom'
          })
        ]),
        
        // Champ Numéro
        createElement('div', { class: 'space-y-2' }, [
          createElement('label', { 
            class: 'flex items-center gap-2 text-sm font-medium text-gray-700',
            for: 'numero'
          }, [
            createElement('svg', {
              class: 'w-5 h-5 text-gray-500',
              fill: 'currentColor',
              viewBox: '0 0 20 20'
            }, [
              createElement('path', {
                d: 'M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z'
              })
            ]),
            'Numéro de téléphone'
          ]),
          createElement('input', {
            type: 'tel',
            id: 'numero',
            name: 'numero',
            required: true,
            class: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none',
            placeholder: 'Ex: +221 77 123 45 67'
          })
        ]),
        
        // Boutons
        createElement('div', { class: 'flex gap-3 pt-4' }, [
          createElement('button', {
            type: 'button',
            class: 'flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors',
            onclick: () => {
              // Retourner à la liste des contacts sans sauvegarder
              const barre = document.querySelector('.w-\\[35\\%\\]');
              if (barre) {
                barre.innerHTML = '';
                DisplayContact().then(contactElement => {
                  barre.appendChild(contactElement);
                });
              }
            }
          }, 'Annuler'),
          createElement('button', {
            type: 'submit',
            class: 'flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
          }, 'Ajouter Contact')
        ])
      ])
    ])
  ]);
}

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
          onclick: () => {
            // Logique pour nouveau groupe
          }
        }, [
          btnicon.new_group,
          createElement('div', {}, createElement('h2', { class: 'p-4' }, 'Nouveau Groupe'))
        ]),
        createElement('div', {
          class: 'flex gap-4 border-b cursor-pointer hover:bg-green-200 py-3 hover:scale-105 transition duration-300 ease-in-out',
          onclick: () => {
            // Remplacer le contenu par le formulaire d'ajout de contact
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
  // Barre latérale des conversations avec un ID unique pour faciliter la sélection
  const barre = createElement('div', { 
    class: 'w-[35%] h-full border-r border-gray-200 flex flex-col',
    id: 'sidebar-content' 
  });
  
  // Charger le contenu par défaut (showChatBase)
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
      // Barre latérale gauche
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

// Fonction pour créer les éléments de contact
function createContactItems(contacts) {
    return contacts.map(contact => {
        return createElement('div', {
            class: 'flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200 mb-1',
            onclick: () => selectContact(contact)
        }, [
            // Avatar avec initiale du nom
            createElement('div', {
                class: 'w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-3'
            }, [
                createElement('span', {}, contact.name.charAt(0).toUpperCase())
            ]),
            
            // Nom du contact
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