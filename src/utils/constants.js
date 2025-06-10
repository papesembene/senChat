import { createElement,createModalComponent } from '../components/Function.js';
const btnicon = {
  message: (() => {
    const button = createElement('button', {
      class: ' text-white p-2 rounded-full shadow-lg ',
      type: 'button',
      id: 'btnmessage',
     'title': 'Message',
     onclick: (e) => {
        e.preventDefault();
        const chatContainer = document.getElementById('conversation-list');
        fetch('http://localhost:3001/conversations')
          .then(response => response.json())
          .then(data => {
            chatContainer.innerHTML = ''; 
            data.forEach(conversation => {
              const conversationItem = createElement('div', {
                class: 'conversation-item p-2 hover:bg-gray-100 cursor-pointer',
                'data-id': conversation.id,
              }, conversation.lastMessage);
              chatContainer.appendChild(conversationItem);
            });
          })
          .catch(error => {
            console.error('Error fetching conversations:', error);
            const errorMessage = createElement('div', {
              class: 'text-red-500 p-3 text-center',
            }, 'Erreur de chargement des conversations');
            chatContainer.appendChild(errorMessage);
          });
      }
    });

    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="bi bi-chat-text-fill" viewBox="0 0 16 16">
        <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M4.5 5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z"/>
      </svg>
    `;

    return button;
  })(),
  story:(()=>{
    const button = createElement('button', {
         class: 'text-white p-2 rounded-full shadow-lg ',
      type: 'button',
      id: 'btnstory',
     'title': 'Status',
    },)
    button.innerHTML=`
    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24">
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
    <path d="M12 2c5.524 0 10 4.478 10 10s-4.476 10-10 10m-3-.5a11 11 0 0 1-3.277-1.754m0-15.492A11.3 11.3 0 0 1 9 2.5m-7 7.746a9.6 9.6 0 0 1 1.296-3.305M2 13.754a9.6 9.6 0 0 0 1.296 3.305"/>
    <path d="M8 16.5c2.073-2.198 5.905-2.301 8 0m-1.782-6.75c0 1.243-.996 2.25-2.226 2.25s-2.225-1.007-2.225-2.25s.996-2.25 2.226-2.25s2.225 1.007 2.225 2.25"/>
    </g></svg>
    `
    return button;
  })(),
  channel:(()=>{
    const button = createElement('button', {
      class: 'text-white p-2 rounded-full shadow-lg ',
      type: 'button',
      id: 'btnchannel',
        'title': 'Chaines',
    });
    button.innerHTML=`
       <svg fill="white" width="23px" height="23px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
       <path d="M12,10a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V11A1,1,0,0,0,12,10ZM8,13a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V14A1,1,0,0,0,8,13ZM12,2A10,10,0,0,0,2,12a9.89,9.89,0,0,0,2.26,6.33l-2,2a1,1,0,0,0-.21,1.09A1,1,0,0,0,3,22h9A10,10,0,0,0,12,2Zm0,18H5.41l.93-.93a1,1,0,0,0,.3-.71,1,1,0,0,0-.3-.7A8,8,0,1,1,12,20ZM16,8a1,1,0,0,0-1,1v6a1,1,0,0,0,2,0V9A1,1,0,0,0,16,8Z"/>
       </svg>
    `
    return button;
  })(),
  groupe:(()=>{
    const button = createElement('button', {
      class: 'text-white p-2 rounded-full shadow-lg ',
      type: 'button',
      id: 'btngroupe',
      'title': 'Groupes',
    });
    button.innerHTML=`
    <svg width="23px" height="23px" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="2.5" stroke="white" stroke-linecap="round"/>
    <path d="M13.7679 6.5C13.9657 6.15743 14.2607 5.88121 14.6154 5.70625C14.9702 5.5313 15.3689 5.46548 15.7611 5.51711C16.1532 5.56874 16.5213 5.73551 16.8187 5.99632C17.1161 6.25713 17.3295 6.60028 17.4319 6.98236C17.5342 7.36445 17.521 7.76831 17.3939 8.14288C17.2667 8.51745 17.0313 8.8459 16.7175 9.08671C16.4037 9.32751 16.0255 9.46985 15.6308 9.49572C15.2361 9.52159 14.8426 9.42983 14.5 9.23205" stroke="white"/>
    <path d="M10.2321 6.5C10.0343 6.15743 9.73935 5.88121 9.38458 5.70625C9.02981 5.5313 8.63113 5.46548 8.23895 5.51711C7.84677 5.56874 7.47871 5.73551 7.18131 5.99632C6.88391 6.25713 6.67053 6.60028 6.56815 6.98236C6.46577 7.36445 6.47899 7.76831 6.60614 8.14288C6.73329 8.51745 6.96866 8.8459 7.28248 9.08671C7.5963 9.32751 7.97448 9.46985 8.36919 9.49572C8.76391 9.52159 9.15743 9.42983 9.5 9.23205" stroke="white"/>
    <path d="M12 12.5C16.0802 12.5 17.1335 15.8022 17.4054 17.507C17.4924 18.0524 17.0523 18.5 16.5 18.5H7.5C6.94771 18.5 6.50763 18.0524 6.59461 17.507C6.86649 15.8022 7.91976 12.5 12 12.5Z" stroke="white" stroke-linecap="round"/>
    <path d="M19.2965 15.4162L18.8115 15.5377L19.2965 15.4162ZM13.0871 12.5859L12.7179 12.2488L12.0974 12.9283L13.0051 13.0791L13.0871 12.5859ZM17.1813 16.5L16.701 16.639L16.8055 17H17.1813V16.5ZM15.5 12C16.5277 12 17.2495 12.5027 17.7783 13.2069C18.3177 13.9253 18.6344 14.8306 18.8115 15.5377L19.7816 15.2948C19.5904 14.5315 19.2329 13.4787 18.578 12.6065C17.9126 11.7203 16.9202 11 15.5 11V12ZM13.4563 12.923C13.9567 12.375 14.6107 12 15.5 12V11C14.2828 11 13.3736 11.5306 12.7179 12.2488L13.4563 12.923ZM13.0051 13.0791C15.3056 13.4614 16.279 15.1801 16.701 16.639L17.6616 16.361C17.1905 14.7326 16.019 12.5663 13.1691 12.0927L13.0051 13.0791ZM18.395 16H17.1813V17H18.395V16ZM18.8115 15.5377C18.8653 15.7526 18.7075 16 18.395 16V17C19.2657 17 20.0152 16.2277 19.7816 15.2948L18.8115 15.5377Z" fill="white"/>
    <path d="M10.9129 12.5859L10.9949 13.0791L11.9026 12.9283L11.2821 12.2488L10.9129 12.5859ZM4.70343 15.4162L5.18845 15.5377L4.70343 15.4162ZM6.81868 16.5V17H7.19453L7.29898 16.639L6.81868 16.5ZM8.49999 12C9.38931 12 10.0433 12.375 10.5436 12.923L11.2821 12.2488C10.6264 11.5306 9.71723 11 8.49999 11V12ZM5.18845 15.5377C5.36554 14.8306 5.68228 13.9253 6.22167 13.2069C6.75048 12.5027 7.47226 12 8.49999 12V11C7.0798 11 6.08743 11.7203 5.42199 12.6065C4.76713 13.4787 4.40955 14.5315 4.21841 15.2948L5.18845 15.5377ZM5.60498 16C5.29247 16 5.13465 15.7526 5.18845 15.5377L4.21841 15.2948C3.98477 16.2277 4.73424 17 5.60498 17V16ZM6.81868 16H5.60498V17H6.81868V16ZM7.29898 16.639C7.72104 15.1801 8.69435 13.4614 10.9949 13.0791L10.8309 12.0927C7.98101 12.5663 6.8095 14.7326 6.33838 16.361L7.29898 16.639Z" fill="white"/>
    </svg>
    `
    return button;
  })(),
  settings:(()=>{
    const button = createElement('button', {
      class: 'text-white p-2 rounded-full shadow-lg ',
      style:{
        marginTop:'500px',
      },
      type: 'button',
      id: 'btnsettings',
      'title': 'Paramètres',
    });
    button.innerHTML=`
    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0"/></g></svg>
    `
    return button;
  })(),
  chat:(()=>{
    const button = createElement('button', {
      class: 'text-white p-2 rounded-full',
      type: 'button',
      id: 'chatter',
      'title': '',
    });
    button.innerHTML=`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="green" class="bi bi-wechat" viewBox="0 0 16 16">
  <path d="M11.176 14.429c-2.665 0-4.826-1.8-4.826-4.018 0-2.22 2.159-4.02 4.824-4.02S16 8.191 16 10.411c0 1.21-.65 2.301-1.666 3.036a.32.32 0 0 0-.12.366l.218.81a.6.6 0 0 1 .029.117.166.166 0 0 1-.162.162.2.2 0 0 1-.092-.03l-1.057-.61a.5.5 0 0 0-.256-.074.5.5 0 0 0-.142.021 5.7 5.7 0 0 1-1.576.22M9.064 9.542a.647.647 0 1 0 .557-1 .645.645 0 0 0-.646.647.6.6 0 0 0 .09.353Zm3.232.001a.646.646 0 1 0 .546-1 .645.645 0 0 0-.644.644.63.63 0 0 0 .098.356"/>
  <path d="M0 6.826c0 1.455.781 2.765 2.001 3.656a.385.385 0 0 1 .143.439l-.161.6-.1.373a.5.5 0 0 0-.032.14.19.19 0 0 0 .193.193q.06 0 .111-.029l1.268-.733a.6.6 0 0 1 .308-.088q.088 0 .171.025a6.8 6.8 0 0 0 1.625.26 4.5 4.5 0 0 1-.177-1.251c0-2.936 2.785-5.02 5.824-5.02l.15.002C10.587 3.429 8.392 2 5.796 2 2.596 2 0 4.16 0 6.826m4.632-1.555a.77.77 0 1 1-1.54 0 .77.77 0 0 1 1.54 0m3.875 0a.77.77 0 1 1-1.54 0 .77.77 0 0 1 1.54 0"/>
</svg>
    `
    return button;
  })(),
  search:(()=>{
    const btn = createElement('button',{
      class: 'text-white p-2 rounded-full',
      type: 'button',
      id: 'search',
      'title': '',
    },)
    btn.innerHTML=`
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg>
    `
    return btn
  })(),
   send:(()=>{
    const btn = createElement('button',{
      class: 'text-white p-2 rounded-full',
      type: 'button',
      id: 'send',
      'title': '',
    },)
    btn.innerHTML=`
   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
</svg>
    `
    return btn
  })(),
dots: (() => {
    const btn = createElement('button', {
        class: 'text-white p-2 rounded-full relative',
        type: 'button',
        id: 'dot',
        title: '',
    });
    
    btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
        </svg>
    `;

    // Créer le menu déroulant
    const dropdownMenu = createElement('div', {
        class: 'absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 hidden z-50',
        id: 'dropdown-menu'
    });

    // Options du menu
    const menuItems = [
        { text: 'Infos du contact', icon: '👤' },
        { text: 'Sélectionner des messages', icon: '✓' },
        { text: 'Mode silencieux', icon: '🔕' },
        { text: 'Messages éphémères', icon: '⏰' },
        { text: 'Ajouter aux Favoris', icon: '⭐' },
        { text: 'Fermer la discussion', icon: '🔒' },
        { text: 'Signaler', icon: '⚠️' },
        { text: 'Bloquer', icon: '🚫' },
        { text: 'Effacer la discussion', icon: '🗑️' },
        { text: 'Supprimer la discussion', icon: '❌' }
    ];

    // Créer les éléments du menu
    menuItems.forEach(item => {
        const menuItem = createElement('div', {
            class: 'px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center'
        });
        
        menuItem.innerHTML = `
            <span class="mr-3">${item.icon}</span>
            <span>${item.text}</span>
        `;
        
        // Ajouter l'événement click pour chaque élément
        menuItem.addEventListener('click', () => {
            console.log(`Action: ${item.text}`);
            dropdownMenu.classList.add('hidden');
        });
        
        dropdownMenu.appendChild(menuItem);
    });

    // Container pour le bouton et le menu
    const container = createElement('div', { class: 'relative' });
    container.appendChild(btn);
    container.appendChild(dropdownMenu);

    // Événement pour ouvrir/fermer le menu
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('hidden');
    });

    // Fermer le menu si on clique ailleurs
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            dropdownMenu.classList.add('hidden');
        }
    });

    return container;
})()


};
export { btnicon };