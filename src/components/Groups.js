import { createElement } from "./Function.js";
import { btnicon } from "../utils/constants.js";
import { createContactItems } from "./Contacts.js";
import { getCurrentUser } from "../Services/auth.js";
const API_URL = import.meta.env.VITE_API_URL;

/**
 * @description cette fonction permet de creer un composant qui permet d'affiher l'interface  groupe
 */
export async function AddGroupcomposant()
{  
  const [contacts] = await Promise.all([
      fetch(`${API_URL}/contacts`).then(res => res.json())
    ]);
    const currentUserId = getCurrentUser().id;
    const userContacts = contacts.filter(contact => contact.ownerId == currentUserId);
    return createElement('div', {
    class: 'h-full flex flex-col'
  }, [
    createElement('div', { class: 'p-4 bg-gray-50 border-b border-gray-200' }, [
      createElement('div', { class: 'flex items-center gap-6 mb-3' }, [
        createElement('div', { class: 'flex' }, [btnicon.arrow_left]),
        createElement('h2', { class: 'flex font-semibold text-lg' }, 'Ajouter des membres au groupes ')
      ])
    ]),
      createElement('div', { class: 'relative p-4' }, [
      createElement('input', {
        class:'block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300   focus:outline-none focus:ring-0 focus:border-green-500 peer',
        placeholder: 'Rechercher un nom ou un numero ',
        autofocus: true
      }),
    ]),
    createElement('div', { class: 'overflow-y-auto max-h-[calc(100vh-300px)]' }, [
       createElement('div', { class: 'p-2' }, [
          createElement('h3', {
            class: 'text-sm font-semibold text-gray-600 mb-2 px-2'
          }, 'Contacts'),
          ...createContactItems(userContacts)
        ])
      ]) 
    ])
    
}