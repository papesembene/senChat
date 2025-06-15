import { createElement } from './Function.js';
import { getCurrentUser } from '../Services/auth.js';
import {  showStatusTypeMenu, showAddTextStatusForm } from './StoriesUI.js';
const API_URL = import.meta.env.VITE_API_URL;

/**
 * 
 * @returns Un élément div HTML contenant la liste des statuts récents
 * @description Cette fonction charge les statuts récents depuis l'API, filtre les statuts expirés, et affiche un menu pour ajouter un nouveau statut.
 * Elle gère également l'affichage des statuts de l'utilisateur actuel et des autres utilisateurs.
 * @example
 * showStories().then(storiesElement => {
 *   document.getElementById('stories-container').appendChild(storiesElement);
 * });
 */
export async function showStories() {
  const currentUser = getCurrentUser();
  let stories = [];
  try {
 
    stories = await fetch(`${API_URL}/stories`)
      .then(res => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      });
    const now = new Date();
    stories = stories.map(story => ({
      ...story,
      items: story.items.filter(item => {
        const itemTime = new Date(item.time);
        const hoursDiff = (now - itemTime) / (1000 * 60 * 60);
        return hoursDiff < 24; 
      })
    }));
    for (const story of stories) {
      if (story.items.length === 0) {
        await fetch(`${API_URL}/stories/${story.id}`, { method: 'DELETE' });
      } else {
        await fetch(`${API_URL}/stories/${story.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(story)
        });
      }
    }
    stories = stories.filter(story => story.items.length > 0);
  } catch (error) {
    return createElement('div', { class: 'p-4 text-red-500' }, 'Erreur lors du chargement des statuts');
  }

  const myStatus = stories.find(s => String(s.userId) === String(currentUser.id));
  const otherStories = stories.filter(s => String(s.userId) !== String(currentUser.id));
  const otherStoriesElements = otherStories.length > 0 ? otherStories.map(story => {
    const element = createElement('div', {
      class: 'flex items-center px-4 py-2 hover:bg-green-400 cursor-pointer',
      onclick: () => showStoryViewer(story)
    }, [
      createElement('img', {
        src: story.avatar || 'https://via.placeholder.com/50',
        class: 'w-12 h-12 rounded-full border-2 border-green-500 mr-4',
        alt: story.user || 'Utilisateur inconnu'
      }),
      createElement('div', {}, [
        createElement('div', { class: 'font-semibold' }, story.user || 'Inconnu'),
        createElement('div', { class: 'text-xs text-gray-400' }, story.items.length > 0
          ? new Date(story.items[story.items.length - 1].time).toLocaleString()
          : 'Aucun statut')
      ])
    ]);
    return element;
  }) : [createElement('div', { class: 'px-4 py-2 text-gray-400' }, 'Aucun statut récent')];


  return createElement('div', { class: 'bg-gray-100 text-black h-full w-full p-0' }, [
    createElement('div', { class: 'p-4 pb-2 flex items-center justify-between' }, [
      createElement('h2', { class: 'text-xl font-bold' }, 'Statut'),
      createElement('button', {
        class: 'text-2xl font-bold relative',
        onclick: (e) => {
          e.stopPropagation();
          showStatusTypeMenu(e.target, handleStatusTypeChoice);
        }
      }, '+')
    ]),
    // Mon statut
    createElement('div', {
      class: 'flex items-center px-4 py-2 hover:bg-green-100 cursor-pointer',
      onclick: myStatus ? () => showStoryViewer(myStatus) : null
    }, [
      createElement('img', {
        src: myStatus ? myStatus.avatar : currentUser.avatar || 'https://via.placeholder.com/50',
        class: `w-12 h-12 rounded-full border-2 ${myStatus ? 'border-green-500' : 'border-gray-300'} mr-4`,
        alt: myStatus ? myStatus.user : currentUser.name || 'Vous'
      }),
      createElement('div', {}, [
        createElement('div', { class: 'font-semibold' }, myStatus ? myStatus.user : 'Votre statut'),
        createElement('div', { class: 'text-xs text-gray-400' }, myStatus && myStatus.items.length > 0
          ? new Date(myStatus.items[myStatus.items.length - 1].time).toLocaleString()
          : 'Aucun statut')
      ])
    ]),
  
    createElement('div', { class: 'px-4 py-2 text-green-400 text-xs font-bold uppercase' }, 'Récents'),
    // Stories des autres
    ...otherStoriesElements
  ]);
}

/**
 * 
 * @description Gère le choix du type de statut (image ou texte) et affiche le formulaire approprié.
 * @example
 * handleStatusTypeChoice('image'); // Pour ajouter une image
 * handleStatusTypeChoice('text'); // Pour ajouter un texte
 * @returns {void}
 * @param {string} type - Le type de statut choisi ('image' ou 'text').
 */
function handleStatusTypeChoice(type) {
  if (type === 'image') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.style.display = 'none';

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        const imageDataUrl = reader.result;
        const currentUser = getCurrentUser();
        const newItem = {
          type: 'image',
          content: imageDataUrl,
          time: new Date().toISOString()
        };
        // Cherche si le user a déjà une story
        const res = await fetch(`${API_URL}/stories?userId=${currentUser.id}`);
        const exist = (await res.json())[0];
        if (exist) {
          exist.items.push(newItem);
          await fetch(`${API_URL}/stories/${exist.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(exist)
          });
        } else {
          const newStory = {
            id: Date.now().toString(),
            userId: currentUser.id,
            user: currentUser.name,
            avatar: currentUser.avatar,
            items: [newItem]
          };
          await fetch(`${API_URL}/stories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStory)
          });
        }
        // Rafraîchir la liste
        const barre = document.getElementById('sidebar-content');
        if (barre) {
          barre.innerHTML = '';
          const storiesEl = await showStories();
          barre.appendChild(storiesEl);
        }
      };
      reader.readAsDataURL(file);
    };

    document.body.appendChild(input);
    input.click();
    setTimeout(() => input.remove(), 1000);
  } else if (type === 'text') {
    showAddTextStatusForm(async (text, color) => {
      const currentUser = getCurrentUser();
      try {
        const newStory = {
          id: Date.now().toString(),
          userId: currentUser.id,
          user: currentUser.name,
          avatar: currentUser.avatar,
          items: [{
            type: 'text',
            content: text,
            color: color,
            time: new Date().toISOString()
          }]
        };
        const res = await fetch(`${API_URL}/stories?userId=${currentUser.id}`);
        if (!res.ok) throw new Error('Erreur lors de la vérification du statut existant');
        const exist = (await res.json())[0];
        if (exist) {
          exist.items.push(newStory.items[0]);
          await fetch(`${API_URL}/stories/${exist.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(exist)
          });
        } else {
          await fetch(`${API_URL}/stories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStory)
          });
        }
        // Mise à jour dynamique
        const barre = document.getElementById('sidebar-content');
        if (barre) {
          barre.innerHTML = '';
          const storiesEl = await showStories();
          barre.appendChild(storiesEl);
        }
      } catch (error) {
        console.error('Erreur lors de l’ajout du statut:', error);
        alert('Erreur lors de l’ajout du statut texte.');
      }
    });
  }
}

/**
 * 
 * @description Affiche un visualiseur de statut pour parcourir les items d'un statut.
 * @example
 * showStoryViewer(story);
 * @param {object} story - L'objet statut contenant les items à afficher.
 * @param {string} story.id - L'identifiant du statut.
 * @param {string} story.userId - L'identifiant de l'utilisateur qui a créé le statut.
 * @param {string} story.user - Le nom de l'utilisateur qui a créé le statut.
 * @param {string} story.avatar - L'URL de l'avatar de l'utilisateur.
 * @param {Array} story.items - La liste des items du statut, chaque item ayant un type et un contenu.
 */
function showStoryViewer(story) {
  if (!story || !story.items || story.items.length === 0) {
    console.error('Statut invalide ou sans items');
    alert('Aucun contenu à afficher pour ce statut.');
    return;
  }

  document.querySelectorAll('.story-viewer-modal').forEach(e => e.remove());

  const modal =createElement('div',{
    class:'story-viewer-modal fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50'
  });

  let index = 0;
  function render() {
    modal.innerHTML = '';
    const item = story.items[index];
    if (!item) {
      console.error('Item introuvable à l’index:', index);
      return;
    }

    const header = createElement('div',{
      class:'absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2'
    });
    header.innerHTML = `
      <img src="${story.avatar}" class="w-10 h-10 rounded-full border-2 border-white" alt="${story.user}">
      <span class="text-white font-semibold">${story.user === getCurrentUser().name ? 'Vous' : story.user}</span>
      <span class="text-gray-200 text-xs">${new Date(item.time).toLocaleString()}</span>
    `;

    let content;
    if (item.type === 'image') {
      content = createElement('img', {
        src: item.content,
        class: 'max-w-full max-h-full object-contain',
        alt: `Statut de ${story.user}`
      });
    } else if (item.type === 'text') {
      content = createElement('div', {
        class: 'p-4 rounded-lg',
        style: `background-color: ${item.color};`
      }, item.content);
    }

    const prevButton = createElement('button', {
      class: 'absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 p-2 rounded-full',
      onclick: () => {
        index = (index - 1 + story.items.length) % story.items.length;
        render();
      }
    }, '‹');

    const nextButton = createElement('button', {
      class: 'absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 p-2 rounded-full',
      onclick: () => {
        index = (index + 1) % story.items.length;
        render();
      }
    }, '›');

    modal.appendChild(header);
    modal.appendChild(content);
    modal.appendChild(prevButton);
    modal.appendChild(nextButton);

    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    };
  }

  render();
  document.body.appendChild(modal);
}