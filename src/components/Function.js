/**
 * 
 * @param {string} tag 
 * @param {object} props 
 * @param {string | Array |Node} content 
 * @description Crée un élément HTML avec les propriétés et le contenu spécifiés.
 * @returns 
 * Un élément HTML créé avec les propriétés et le contenu spécifiés.
 * @example 
 * createElement('div', { class: 'my-class', id: 'my-id' }, 'Hello
 * 
 */

export function createElement(tag, props = {}, content = '') {
    if (typeof tag !== 'string') return null;
    // Gestion de v-if
    if ('vIf' in props && !props.vIf) return null;

    const el = document.createElement(tag);

    for (const key in props) {
      const value = props[key];

      // Classes
      if (key === 'class' || key === 'className') {
        el.className = Array.isArray(value) ? value.join(' ') : value;
      }

      // Événements
      else if (key.startsWith('on') && typeof value === 'function') {
        const eventName = key.slice(2).toLowerCase();
        el.addEventListener(eventName, value);
      }

      // v-show => toggle `display: none`
      else if (key === 'vShow') {
        el.style.display = value ? '' : 'none';
      }

      // vIf et vFor
      else if (key === 'vIf' || key === 'vFor') {
        continue;
      }

      // :attr => dynamic binding
      else if (key.startsWith(':')) {
        const realAttr = key.slice(1);
        el.setAttribute(realAttr, value);
      }

      // style objet
      else if (key === 'style' && typeof value === 'object') {
        Object.assign(el.style, value);
      }

      // Attribut HTML classique
      else {
        el.setAttribute(key, value);
      }
    }

    // Gestion de v-for (injecte les enfants dynamiquement)
    if ('vFor' in props) {
      const { each, render } = props.vFor;
      
      // Gestion des Promises
      if (each && typeof each.then === 'function') {
        // Ajouter un placeholder pendant le chargement
        const placeholder = createElement('div', {
          class: 'text-gray-500 p-3 text-center'
        }, 'Chargement...');
        el.appendChild(placeholder);
        
        each.then(data => {
          // Supprimer le placeholder
          if (placeholder.parentNode) {
            el.removeChild(placeholder);
          }
          
          // Traiter les données
          if (Array.isArray(data)) {
            data.forEach((item, index) => {
              const child = render(item, index);
              // Vérifier que l'élément existe et est valide avant de l'ajouter
              if (child && child instanceof Node && child.tagName) {
                el.appendChild(child);
              }
            });
          }
        }).catch(error => {
          if (placeholder.parentNode) {
            el.removeChild(placeholder);
          }
          const errorEl = createElement('div', {
            class: 'text-red-500 p-3 text-center'
          }, 'Erreur de chargement');
          el.appendChild(errorEl);
          console.error('Erreur vFor:', error);
        });
      } 
      else if (typeof each === 'number') {
        for (let i = 0; i < each; i++) {
          const child = render(i);
          if (child && child instanceof Node) {
            el.appendChild(child);
          }
        }
      } 
      else if (Array.isArray(each)) {
        each.forEach((item, index) => {
          const child = render(item, index);
          if (child && child instanceof Node) {
            el.appendChild(child);
          }
        });
      }
    } else {
      // Contenu : string | Node | array
      if (Array.isArray(content)) {
        content.forEach((item) => {
          if (typeof item === 'string') {
            el.appendChild(document.createTextNode(item));
          } else if (item instanceof Node) {
            el.appendChild(item);
          }
        });
      } else if (typeof content === 'string') {
        el.textContent = content;
      } else if (content instanceof Node) {
        el.appendChild(content);
      }
    }

  // Méthodes pour chaînage
  el.addElement = function (tag, props = {}, content = '') {
    const newEl = createElement(tag, props, content);
    this.appendChild(newEl);
    return this;
  };
  el.addNode = function (node) {
    this.appendChild(node);
    return this;
  };

  return el;
}

/**
 * 
 * @param {object} props 
 * @returns un élément input HTML
 * @example
 * createInput({ type: 'text', placeholder: 'Enter text' });
 * @description Crée un élément input HTML avec les propriétés spécifiées.
 */

export function createInput(props = {}) {
  return createElement('input', props);
}
/**
 * 
 * @param {object} props 
 * @param {string} content 
 * @returns 
 * Un élément button HTML
 * @example
 * createButton({ class: 'btn-primary' }, 'Click Me');
 */
export function createButton(props = {}, content = '') 
{
  return createElement('button', props, content);
}
/**
 * 
 * @param {string} modalId 
 * @param {string} title 
 * @param {Array} contentElements 
 * @returns un modal
 */
// function createModalComponent(modalId, title, contentElements = []) {
//     // Toggle button (optionnel)
//     const toggleBtn = createElement('button', {
//         type: 'button',
//         'data-modal-target': modalId,
//         'data-modal-toggle': modalId,
//         class: 'block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
//         text: 'Ouvrir le modal'
//     });

//     // Close button
//     const closeButton = createElement('button', {
//         type: 'button',
//         'data-modal-toggle': modalId,
//         class: 'text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
//     }, [
//         createElement('svg', {
//             class: 'w-3 h-3',
//             'aria-hidden': 'true',
//             xmlns: 'http://www.w3.org/2000/svg',
//             fill: 'none',
//             viewBox: '0 0 14 14'
//         }, [
//             createElement('path', {
//                 stroke: 'currentColor',
//                 'stroke-linecap': 'round',
//                 'stroke-linejoin': 'round',
//                 'stroke-width': '2',
//                 d: 'm1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
//             })
//         ]),
//         createElement('span', { class: 'sr-only', text: 'Fermer' })
//     ]);

//     // Header
//     const modalHeader = createElement('div', {
//         class: 'flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200'
//     }, [
//         createElement('h3', {
//             class: 'text-lg font-semibold text-gray-900 dark:text-white',
//             text: title
//         }),
//         closeButton
//     ]);

//     // Body
//     const modalBody = createElement('div', { class: 'p-4 md:p-5' }, contentElements);

//     // Full modal structure
//     const modalContent = createElement('div', {
//         class: 'relative bg-white rounded-lg shadow dark:bg-gray-700'
//     }, [modalHeader, modalBody]);

//     const modalWrapper = createElement('div', {
//         class: 'relative p-4 w-full max-w-md max-h-full'
//     }, [modalContent]);

//     const modal = createElement('div', {
//         id: modalId,
//         tabindex: '-1',
//         'aria-hidden': 'true',
//         class: 'hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full'
//     }, [modalWrapper]);

//     // Container (button + modal)
//     return createElement('div', {}, [toggleBtn, modal]);
// }

export function createModalComponent(modalId, title, contentElements = []) {
    const closeBtn = createElement('button', {
        type: 'button',
        class: 'absolute top-2 right-2 text-gray-500 hover:text-red-600',
    }, ['×']);

    const header = createElement('div', {
        class: 'text-lg font-bold mb-4 text-gray-900',
        text: title
    });

    const body = createElement('div', { class: 'p-4' }, contentElements);

    const modalBox = createElement('div', {
        class: 'bg-white rounded-lg p-6 relative w-full max-w-md shadow-xl',
    }, [closeBtn, header, body]);

    const overlay = createElement('div', {
        id: modalId,
        class: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden'
    }, [modalBox]);

    // Bouton pour fermer le modal
    closeBtn.addEventListener('click', () => {
        overlay.classList.add('hidden');
    });

    return overlay;
}

