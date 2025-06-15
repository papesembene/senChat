import { createElement } from './Function.js';

const colors = ['#4ade80', '#fbbf24', '#60a5fa', '#f472b6', '#a78bfa', '#f87171', '#34d399', '#facc15', '#38bdf8', '#f472b6'];

/**
 * 
 * @description Affiche un formulaire pour ajouter un statut avec une image.
 * @example
 * showAddImageStatusForm((imageData) => {
 *   console.log('Image ajoutée:', imageData);
 * });
 * @returns {void}
 * @param {function} onSubmit - Fonction appelée lors de la soumission du formulaire avec les données de l'image.
 * 
 */
export function showAddStatusForm(onSubmit) {
  const form = document.createElement('form');
  form.className = 'flex flex-col items-center p-4';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.className = 'mb-2';

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Ajouter';
  submitBtn.className = 'bg-green-500 text-white px-4 py-2 rounded';

  form.appendChild(fileInput);
  form.appendChild(submitBtn);

  form.onsubmit = async (e) => {
    e.preventDefault();
    if (!fileInput.files[0]) return alert('Choisissez une image');
    const reader = new FileReader();
    reader.onload = () => {
      onSubmit(reader.result);
      form.remove();
    };
    reader.readAsDataURL(fileInput.files[0]);
  };

  document.body.appendChild(form);
}

/**
 
 * @description Affiche un menu contextuel pour choisir le type de statut (image ou texte).
 * @example
 * showStatusTypeMenu(anchorElement, (type) => {
 *   console.log('Type choisi:', type);
 * });
 * @returns {void}
 * @param {HTMLElement} anchor - L'élément HTML sur lequel le menu sera ancré.
 * @param {function} onChoice - Fonction appelée avec le type de statut choisi ('image' ou 'text').
 */
export function showStatusTypeMenu(anchor, onChoice) {
  // Supprimer un ancien menu s'il existe dans le même parent
  const parent = anchor.parentNode;
  parent.querySelectorAll('.status-type-menu').forEach(m => m.remove());

  // Créer le menu
  const menu = createElement('div', {
    class: 'status-type-menu absolute bg-white shadow-lg rounded z-50 p-2',
    style: 'min-width:160px;top:110%;right:0;'
  }, [
    createElement('div', {
      class: 'cursor-pointer p-2 hover:bg-gray-100 flex items-center  ',
      onclick: () => { menu.remove(); onChoice('image'); }
    }, [
      createElement('span', { class: 'mr-2' }, ''),
      'Photos et vidéos'
    ]),
    createElement('div', {
      class: 'cursor-pointer p-2 hover:bg-gray-100 flex items-center',
      onclick: () => { menu.remove(); onChoice('text'); }
    }, [
      createElement('span', { class: 'mr-2' }, ''),
      'Texte'
    ])
  ]);
  parent.style.position = 'relative';
  parent.appendChild(menu);
  setTimeout(() => {
    document.addEventListener('click', function handler(e) {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', handler);
      }
    });
  }, 10);
}



/**
 * 
 * @description Affiche un formulaire pour ajouter un statut texte.
 * @example
 * showAddTextStatusForm((text, color) => {
 *   console.log('Statut ajouté:', text, color);
 * }
 * @returns {void}
 * @param {function} onSubmit - Fonction appelée lors de la soumission du formulaire avec le texte et la couleur sélectionnée.
    * 
 */
export function showAddTextStatusForm(onSubmit) {
  document.querySelectorAll('.add-text-status-form').forEach(f => f.remove());
  const bgColor = colors[Math.floor(Math.random() * colors.length)];
  const appContainer = document.getElementById('main-container'); 
  const overlay = createElement('div', {
    class: 'add-text-status-form absolute inset-0 flex items-center justify-center z-50',
    style: 'background:rgba(0,0,0,0.15);'
  });
  const box = createElement('div', {
    class: 'relative flex flex-col items-center justify-center rounded-lg shadow-lg',
    style: `background:${bgColor}; width:80%; height:80%;`
  });

  const closeBtn = createElement('button', {
    type: 'button',
    class: 'absolute top-4 right-4 text-white text-3xl',
    style: 'background:transparent;border:none;cursor:pointer;',
    onclick: () => overlay.remove()
  });
  closeBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
    </svg>
  `;

  // Zone de texte
  const textarea = createElement('textarea', {
    placeholder: 'Écrivez un statut',
    class: 'w-full h-2/3 text-3xl p-4 rounded bg-transparent text-white text-center border-none outline-none resize-none',
    style: 'background:transparent;height:60%;font-size:2.5rem;text-align:center;'
  });

  
  const sendBtn = createElement('button', {
    type: 'submit',
    class: 'absolute bottom-6 right-6 bg-green-700 p-3 rounded-full flex items-center justify-center shadow-lg z-10',
    style: 'border:none;cursor:pointer;',
  });
  sendBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
      <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
    </svg>
  `;


  const form = createElement('form', {
    class: 'w-full h-full flex flex-col items-center justify-center relative'
  }, [
    closeBtn,
    textarea,
    sendBtn
  ]);

  form.onsubmit = (e) => {
    e.preventDefault();
    if (!textarea.value.trim()) return;
    onSubmit(textarea.value.trim(), bgColor);
    overlay.remove();
  };

  box.appendChild(form);
  overlay.appendChild(box);

 
  if (appContainer) {
    appContainer.appendChild(overlay);
  } else {
    document.body.appendChild(overlay); 
  }
}