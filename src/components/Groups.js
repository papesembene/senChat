import { createElement } from "./Function.js";
import { getCurrentUser } from "../Services/auth.js";
const API_URL = import.meta.env.VITE_API_URL;

export async function AddGroupcomposant() {
  const contacts = await fetch(`${API_URL}/contacts`).then(res => res.json());
  const currentUserId = getCurrentUser().id;
  const userContacts = contacts.filter(c => c.ownerId == currentUserId);

  let selectedContacts = [];

  // Affichage des contacts sélectionnés
  const selectedContainer = createElement('div', { class: 'flex items-center gap-2 px-4 py-2 min-h-[48px]' });

  function refreshSelected() {
    selectedContainer.innerHTML = '';
    selectedContacts.forEach(contact => {
      const chip = createElement('div', {
        class: 'flex items-center bg-green-200 text-green-900 rounded-full px-3 py-1 mr-2'
      }, [
        createElement('span', { class: 'mr-1' }, contact.name),
        createElement('button', {
          class: 'ml-1 text-red-500 hover:text-red-700',
          onclick: () => {
            selectedContacts = selectedContacts.filter(c => c.id !== contact.id);
            refreshSelected();
            refreshArrow();
          }
        }, '✕')
      ]);
      selectedContainer.appendChild(chip);
    });
  }

  // Barre de recherche
  const searchInput = createElement('input', {
    class: 'w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none focus:border-green-500 mb-4',
    placeholder: 'Rechercher un nom ou un numéro...',
    autofocus: true,
    oninput: (e) => {
      const value = e.target.value.toLowerCase();
      contactList.innerHTML = '';
      userContacts
        .filter(c => c.name.toLowerCase().includes(value) || c.telephone.includes(value))
        .forEach(c => contactList.appendChild(createContactItem(c)));
    }
  });

  // Liste des contacts
  function createContactItem(contact) {
    const isSelected = selectedContacts.some(c => c.id === contact.id);
    return createElement('div', {
      class: `flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 mb-1 ${isSelected ? 'bg-green-100' : 'hover:bg-green-50'}`,
      onclick: () => {
        if (!isSelected) {
          selectedContacts.push(contact);
        } else {
          selectedContacts = selectedContacts.filter(c => c.id !== contact.id);
        }
        refreshSelected();
        refreshArrow();
        refreshList();
      }
    }, [
      createElement('div', {
        class: 'w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-3'
      }, [
        createElement('span', {}, contact.name.charAt(0).toUpperCase())
      ]),
      createElement('div', { class: 'flex-1' }, [
        createElement('h4', { class: 'font-medium text-gray-900' }, contact.name),
        createElement('p', { class: 'text-sm text-gray-500' }, `${contact.codecountry} ${contact.telephone}`)
      ])
    ]);
  }

  function refreshList() {
    contactList.innerHTML = '';
    userContacts.forEach(c => contactList.appendChild(createContactItem(c)));
  }

  // Flèche verte (bouton validation)
  const arrowBtn = createElement('button', {
    class: 'flex items-center justify-center mx-auto mt-4 mb-2 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg transition-all duration-200',
    style: 'display:none;',
    onclick: () => {
      // Affiche l’interface de création du groupe (voir étape 3)
      showCreateGroupInterface(selectedContacts);
    }
  }, []);
  arrowBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
    </svg>
  `;

  function refreshArrow() {
    arrowBtn.style.display = selectedContacts.length > 0 ? 'block' : 'none';
  }

  const contactList = createElement('div', {}, []);
  refreshList();

  // Header
  const header = createElement('div', { class: 'p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-4' }, [
    createElement('div', { class: 'flex' }, [
      // bouton retour si besoin
    ]),
    createElement('h2', { class: 'font-semibold text-lg' }, 'Ajouter des membres au groupe')
  ]);

  // Container principal
  const container = createElement('div', { class: 'h-full flex flex-col bg-white relative' }, [
    header,
    selectedContainer,
    createElement('div', { class: 'p-4' }, [
      searchInput,
      contactList,
       arrowBtn
    ]),
   
  ]);

  refreshArrow();
  refreshSelected();

  return container;
}
function showCreateGroupInterface(members) {
  const barre = document.getElementById('sidebar-content');
  if (!barre) return;
  let groupPhotoDataUrl = null;
  let groupDefaultIcon = null;
  const groupNameInput = createElement('input', {
    class: 'w-full border-b-2 border-green-500 text-center text-lg mb-4 outline-none bg-transparent text-gray-800',
    placeholder: 'Nom du groupe'
  });
  const photoInput = createElement('input', {
    type: 'file',
    accept: 'image/*',
    style: 'display:none;',
    onchange: (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          groupPhotoDataUrl = evt.target.result;
          groupPhoto.style.backgroundImage = `url('${groupPhotoDataUrl}')`;
          if (groupDefaultIcon) groupDefaultIcon.style.display = 'none';
        };
        reader.readAsDataURL(file);
      }
    }
  });
  const groupPhoto = createElement('div', {
    class: 'w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl mb-2 shadow-lg cursor-pointer relative group',
    style: 'background-size:cover;background-position:center;',
    onclick: () => photoInput.click(),
    title: "Ajouter/modifier la photo du groupe"
  });

  groupPhoto.innerHTML = `
    <svg id="groupDefaultIcon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm4-3a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM2 13s-1 0-1-1 1-4 7-4 7 3 7 4-1 1-1 1H2zm13-1c0-1-2.686-3-7-3s-7 2-7 3 2.686 3 7 3 7-2 7-3z"/>
    </svg>
    <div class="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow group-hover:scale-110 transition pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-camera" viewBox="0 0 16 16">
        <path d="M9.5 2a.5.5 0 0 1 .5.5V3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1v-.5a.5.5 0 0 1 .5-.5h3zm-3 1V2h3v1h-3zm-2 1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7zm3.5 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zm0 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
      </svg>
    </div>
  `;

  const header = createElement('div', { class: 'w-full relative mb-6 flex items-center' }, [
    createElement('button', {
      class: 'absolute left-0 top-1 text-green-600 hover:text-green-800 p-2 rounded-full',
      style: 'background:transparent;',
      onclick: () => {
        barre.innerHTML = '';
        AddGroupcomposant().then(el => barre.appendChild(el));
      }
    }, [
      (() => {
        const div = document.createElement('div');
        div.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 7.5H14.5A.5.5 0 0 1 15 8"/>
        `;
        return div.firstChild;
      })()
    ]),
    createElement('h2', { class: 'flex-1 text-center text-lg font-semibold text-gray-800' }, 'Nouveau groupe')
  ]);
  const validateBtn = createElement('button', {
    class: 'flex items-center justify-center mx-auto mt-8 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-200',
    style: 'position:relative;',
    onclick: async () => {
      const groupName = groupNameInput.value.trim();
      if (!groupName) {
        alert('Veuillez saisir un nom de groupe.');
        groupNameInput.focus();
        return;
      }
      const currentUser = getCurrentUser();
      const participants = Array.from(new Set([String(currentUser.id), ...members.map(m => String(m.id))]));
      const groupData = {
        name: groupName,
        participants,
        createdAt: new Date().toISOString(),
        photo: groupPhotoDataUrl ,
        type: 'groupe',
      };
      const response = await fetch(`${API_URL}/groupes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData)
      });
      if (response.ok) {
        barre.innerHTML = '';
        const { showChatBase } = await import('./ChatUI.js');
        const elements = await showChatBase({
          onSelect: (conversation, user) => {
            window.selectedConversation = conversation;
            window.selectedUser = user;
            if (window.renderChatArea) window.renderChatArea();
          }
        });
        elements.forEach(el => barre.appendChild(el));
        if (window.startConversationPolling) window.startConversationPolling();
      } else {
        alert("Erreur lors de la création du groupe.");
      }
    }
  });
  validateBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
    </svg>
  `;
  const container = createElement('div', {
    class: 'flex flex-col items-center justify-center h-full p-8 bg-white relative'
  }, [
    header,
    groupPhoto,
    photoInput,
    createElement('div', { class: 'text-xs text-gray-500 text-center mb-4' }, 'Ajouter une photo au groupe'),
    groupNameInput,
    validateBtn
  ]);

  barre.innerHTML = '';
  barre.appendChild(container);
}