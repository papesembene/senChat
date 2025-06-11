import { createElement } from "./Function.js";
import { DisplayContact } from "./Contacts.js";
import { getCurrentUser } from "../Services/auth";
import { btnicon } from "../utils/constants.js";
const API_URL = import.meta.env.VITE_API_URL;

/**
 * 
 * @returns 
 */

export function createAddContactForm() {
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
        onsubmit: async (e) => {
          e.preventDefault();
          
          const formData = new FormData(e.target);
          const name = formData.get('name').trim();
          const telephone = formData.get('telephone').trim();
          const codecountry = formData.get('codecountry').trim();
          
          // Validation
          if (!name || !telephone) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
          }
          
          // Prép arer les données selon votre structure
          const contactData = {
            name: name,
            telephone: telephone,
            codecountry: codecountry,
            ownerId: getCurrentUser().id
          };
          
          try {
            // Envoyer les données à l'API
            const response = await fetch(`${API_URL}/contacts`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(contactData)
            });
            
            if (response.ok) {
              console.log('Contact ajouté avec succès');
              
              // Retourner à la liste des contacts
              const barre = document.querySelector('.w-\\[35\\%\\]');
              if (barre) {
                barre.innerHTML = '';
                DisplayContact().then(contactElement => {
                  barre.appendChild(contactElement);
                });
              }
            } else {
              throw new Error('Erreur lors de l\'ajout du contact');
            }
          } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'ajout du contact. Veuillez réessayer.');
          }
        }
      }, [
        // Champ Nom
        createElement('div', { class: 'space-y-2' }, [
          createElement('label', { 
            class: 'flex items-center gap-2 text-sm font-medium text-gray-700',
            for: 'name'
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
            'Nom *'
          ]),
          createElement('input', {
            type: 'text',
            id: 'name',
            name: 'name',
            required: true,
            class: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none',
            placeholder: 'Ex: Jean Dupont'
          })
        ]),
        
        // Champ Code Pays
        createElement('div', { class: 'space-y-2' }, [
          createElement('label', { 
            class: 'flex items-center gap-2 text-sm font-medium text-gray-700',
            for: 'codecountry'
          }, [
            createElement('svg', {
              class: 'w-5 h-5 text-gray-500',
              fill: 'currentColor',
              viewBox: '0 0 20 20'
            }, [
              createElement('path', {
                'fill-rule': 'evenodd',
                d: 'M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM12 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM12 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z',
                'clip-rule': 'evenodd'
              })
            ]),
            'Code Pays'
          ]),
          createElement('input', {
            type: 'text',
            id: 'codecountry',
            name: 'codecountry',
            class: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none',
            placeholder: 'Ex: +221',
            value: '+221'
          })
        ]),
        
        // Champ Téléphone
        createElement('div', { class: 'space-y-2' }, [
          createElement('label', { 
            class: 'flex items-center gap-2 text-sm font-medium text-gray-700',
            for: 'telephone'
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
            'Numéro de téléphone *'
          ]),
          createElement('input', {
            type: 'tel',
            id: 'telephone',
            name: 'telephone',
            required: true,
            class: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none',
            placeholder: 'Ex: 771234567'
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