import { createElement } from './Function.js';

export function showStaticStories() {
  // Statut de l'utilisateur courant
  const myStatus = {
    user: "Mon statut",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    time: "Aujourd'hui à 08:59"
  };

  // Stories récentes
  const stories = [
    {
      user: "Amy Colle",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      time: "Aujourd'hui à 11:43"
    },
    {
      user: "Diewrin",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      time: "Aujourd'hui à 11:41"
    },
    {
      user: "Omar ",
      avatar: "https://randomuser.me/api/portraits/men/55.jpg",
      time: "Aujourd'hui à 11:56"
    },
    {
      user: "Rama",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      time: "Aujourd'hui à 11:18"
    },
    {
      user: "Awa Diouf",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      time: "Aujourd'hui à 11:11"
    }
  ];

  return createElement('div', { class: 'bg-gray-100 text-black h-full w-full p-0' }, [
    createElement('div', { class: 'p-4 pb-2 flex items-center justify-between' }, [
      createElement('h2', { class: 'text-xl font-bold' }, 'Statut'),
      createElement('button', { class: 'text-2xl font-bold' }, '+')
    ]),
    // Mon statut
    createElement('div', { class: 'flex items-center px-4 py-2 hover:bg-green-100 cursor-pointer' }, [
      createElement('img', {
        src: myStatus.avatar,
        class: 'w-12 h-12 rounded-full border-2 border-green-500 mr-4',
        alt: myStatus.user
      }),
      createElement('div', {}, [
        createElement('div', { class: 'font-semibold' }, myStatus.user),
        createElement('div', { class: 'text-xs text-gray-400' }, myStatus.time)
      ])
    ]),
    // Séparateur
    createElement('div', { class: 'px-4 py-2 text-green-400 text-xs font-bold uppercase' }, 'Récents'),
    // Stories récentes
    ...stories.map(story =>
      createElement('div', { class: 'flex items-center px-4 py-2 hover:bg-green-400 cursor-pointer' }, [
        createElement('img', {
          src: story.avatar,
          class: 'w-12 h-12 rounded-full border-2 border-green-500 mr-4',
          alt: story.user
        }),
        createElement('div', {}, [
          createElement('div', { class: 'font-semibold' }, story.user),
          createElement('div', { class: 'text-xs text-gray-400' }, story.time)
        ])
      ])
    )
  ]);
}