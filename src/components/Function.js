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
// export function createElement(tag, props = {}, content = '') {
//   if (typeof tag !== 'string') return null;
//   // Gestion de v-if
//   if ('vIf' in props && !props.vIf) return null;

//   // Gestion de v-for (retourne un fragment)

//   const el = document.createElement(tag);

//   for (const key in props) {
//     const value = props[key];

//     // Classes

//     if (key === 'class' || key === 'className') {
//       el.className = Array.isArray(value) ? value.join(' ') : value;
//     }

//     // Événements
//     else if (key.startsWith('on') && typeof value === 'function') {
//       const eventName = key.slice(2).toLowerCase();
//       el.addEventListener(eventName, value);
//     }

//     // v-show => toggle `display: none`
//     else if (key === 'vShow') {
//       el.style.display = value ? '' : 'none';
//     }

//     // vIf et vFor
//     else if (key === 'vIf' || key === 'vFor') {
//       continue;
//     }

//     // :attr => dynamic binding
//     else if (key.startsWith(':')) {
//       const realAttr = key.slice(1);
//       el.setAttribute(realAttr, value);
//     }

//     // style objet
//     else if (key === 'style' && typeof value === 'object') {
//       Object.assign(el.style, value);
//     }

//     // Attribut HTML classique
//     else {
//       el.setAttribute(key, value);
//     }
//   }

//   // Gestion de v-for (injecte les enfants dynamiquement)
//   if ('vFor' in props) {
//     const { each, render } = props.vFor;
//        // Gestion des Promises
//         if (each && typeof each.then === 'function') {
//             // Ajouter un placeholder pendant le chargement
//             const placeholder = createElement('div');
//             placeholder.textContent = 'Chargement...';
//             placeholder.className = 'text-gray-500 p-3 text-center';
//             el.appendChild(placeholder);
            
//             each.then(data => {
//                 // Supprimer le placeholder
//                 el.removeChild(placeholder);
                
//                 // Traiter les données
//                 if (Array.isArray(data)) {
//                     data.forEach((item, index) => {
//                         const child = render(item, index);
//                         if (child instanceof Node) {
//                             el.appendChild(child);
//                         }
//                     });
//                 }
//             }).catch(error => {
//                 el.removeChild(placeholder);
//                 const errorEl = createElement('div');
//                 errorEl.textContent = 'Erreur de chargement';
//                 errorEl.className = 'text-red-500 p-3 text-center';
//                 el.appendChild(errorEl);
//                 console.error('Erreur vFor:', error);
//             });
//         }else 
//     if (typeof each === 'number') {
//       for (let i = 0; i < each; i++) {
//         const child = render(i);
//         if (child instanceof Node) {
//           el.appendChild(child);
//         }
//       }
//     } else if (Array.isArray(each)) {
//       each.forEach((item, index) => {
//         const child = render(item, index);
//         if (child instanceof Node) {
//           el.appendChild(child);
//         }
//       });
//     }
//   } else {
//     // Contenu : string | Node | array
//     if (Array.isArray(content)) {
//       content.forEach((item) => {
//         if (typeof item === 'string') {
//           el.appendChild(document.createTextNode(item));
//         } else if (item instanceof Node) {
//           el.appendChild(item);
//         }
//       });
//     } else if (typeof content === 'string') {
//       el.textContent = content;
//     } else if (content instanceof Node) {
//       el.appendChild(content);
//     }
//   }

//   // Méthodes pour chaînage
//   el.addElement = function (tag, props = {}, content = '') {
//     const newEl = createElement(tag, props, content);
//     this.appendChild(newEl);
//     return this;
//   };
//   el.addNode = function (node) {
//     this.appendChild(node);
//     return this;
//   };

//   return el;
// }
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

// export function createSelect(props = {}, options = []) {
//   const selectElement = createElement('select', props);
//   options.forEach(option => {
//     const optionElement = createElement('option', { value: option.value }, option.label);
//     selectElement.appendChild(optionElement);
//   });
//   return selectElement;
// }