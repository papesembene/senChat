import { createElement,createModalComponent } from '../components/Function.js';
import { navigateTo } from '../components/router.js';
import { DisplayContact } from '../components/Contacts.js';
import { showChatBase } from '../components/ChatUI.js';
import { showStories } from '../components/Stories.js'; 
import { showSettingsSidebar } from '../components/Settings.js';
const btnicon = {

  message: (() => {
  const button = createElement('button', {
    class: ' text-white p-2 rounded-full shadow-lg ',
    type: 'button',
    id: 'btnmessage',
    title: 'Message',
    onclick: async (e) => {
      e.preventDefault();
      setActiveSidebarButton('btnmessage');
      const sidebar = document.getElementById('sidebar-content');
      if (sidebar) {
        sidebar.innerHTML = '';
        const elements = await showChatBase({
          onSelect: (conversation, user) => {
            window.selectedConversation = conversation;
            window.selectedUser = user;
            if (window.renderChatArea) window.renderChatArea();
            if (window.chatPollingInterval) clearInterval(window.chatPollingInterval);
            startChatPolling();
          }
        });
        elements.forEach(el => sidebar.appendChild(el));
      }
    }
  });

  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" class="bi bi-chat-text-fill" viewBox="0 0 16 16">
      <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M4.5 5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z"/>
    </svg>
  `;

  return button;
})(),
  story: (() => {
  const button = createElement('button', {
    class: 'text-white p-2 rounded-full shadow-lg ',
    type: 'button',
    id: 'btnstory',
    title: 'Status',
    onclick: async() => {
      setActiveSidebarButton('btnstory');
       if (window.conversationPollingInterval) clearInterval(window.conversationPollingInterval);
      const sidebar = document.getElementById('sidebar-content');
      if (sidebar) {
        sidebar.innerHTML = '';
        const storiesEl = await showStories();
      sidebar.appendChild(storiesEl);
      }
    }
  });
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
        <path d="M12 2c5.524 0 10 4.478 10 10s-4.476 10-10 10m-3-.5a11 11 0 0 1-3.277-1.754m0-15.492A11.3 11.3 0 0 1 9 2.5m-7 7.746a9.6 9.6 0 0 1 1.296-3.305M2 13.754a9.6 9.6 0 0 0 1.296 3.305"/>
        <path d="M8 16.5c2.073-2.198 5.905-2.301 8 0m-1.782-6.75c0 1.243-.996 2.25-2.226 2.25s-2.225-1.007-2.225-2.25s.996-2.25 2.226-2.25s2.225 1.007 2.225 2.25"/>
      </g>
    </svg>
  `;
  return button;
})(),
  channel:(()=>{
    const button = createElement('button', {
      class: 'text-white p-2 rounded-full shadow-lg ',
      type: 'button',
      id: 'btnchannel',
        'title': 'Chaines',
        onclick:()=>{
          alert('Cette fonctionnalité n\'est pas encore implémentée');
        }
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
      class: 'text-white  p-2 rounded-full shadow-lg ',
      type: 'button',
      id: 'btngroupe',
      'title': 'Groupes',
      onclick:()=>{
        alert('Cette fonctionnalité n\'est pas encore implémentée');
      }
        
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
  add: (() => {
    const button = createElement('button', {
      class: 'p-2 rounded-full',
      type: 'button',
      id: 'add',
      'title': 'Nouvelle Discussion',
      onclick: (e) => {
        e.preventDefault()
        setActiveSidebarButton('add');
         if (window.conversationPollingInterval) clearInterval(window.conversationPollingInterval); 
        const barre = document.getElementById('sidebar-content'); 
        if (barre) {
          barre.innerHTML = '';
          DisplayContact().then(contactElement => {
            barre.appendChild(contactElement);
          }).catch(error => {
            console.error('Erreur lors du chargement des contacts:', error);
            const errorElement = createElement('div', {
              class: 'p-4 text-center text-red-500'
            }, 'Erreur lors du chargement des contacts');
            barre.appendChild(errorElement);
          });
        }
      }
    });
    
    button.innerHTML = `
      <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="" fill="none">
        <title></title>
        <path d="M9.53277 12.9911H11.5086V14.9671C11.5086 15.3999 11.7634 15.8175 12.1762 15.9488C12.8608 16.1661 13.4909 15.6613 13.4909 15.009V12.9911H15.4672C15.9005 12.9911 16.3181 12.7358 16.449 12.3226C16.6659 11.6381 16.1606 11.0089 15.5086 11.0089H13.4909V9.03332C13.4909 8.60007 13.2361 8.18252 12.8233 8.05119C12.1391 7.83391 11.5086 8.33872 11.5086 8.991V11.0089H9.49088C8.83941 11.0089 8.33411 11.6381 8.55097 12.3226C8.68144 12.7358 9.09947 12.9911 9.53277 12.9911Z" fill="currentColor"></path>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.944298 5.52617L2.99998 8.84848V17.3333C2.99998 18.8061 4.19389 20 5.66665 20H19.3333C20.8061 20 22 18.8061 22 17.3333V6.66667C22 5.19391 20.8061 4 19.3333 4H1.79468C1.01126 4 0.532088 4.85997 0.944298 5.52617ZM4.99998 8.27977V17.3333C4.99998 17.7015 5.29845 18 5.66665 18H19.3333C19.7015 18 20 17.7015 20 17.3333V6.66667C20 6.29848 19.7015 6 19.3333 6H3.58937L4.99998 8.27977Z" fill="currentColor"></path>
      </svg>
    `;
    
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
       onclick: () => {
      showSettingsSidebar();
      setActiveSidebarButton('btnsettings');
    }
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
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="green-400" class="bi bi-wechat" viewBox="0 0 16 16">
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
    micro:(()=>{
    const btn = createElement('button',{
      class: 'text-white p-2 rounded-full',
      type: 'button',
      id: 'micro',
      'title': '',
     
    },)
    btn.innerHTML=`
   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-mic-fill" viewBox="0 0 16 16">
  <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z"/>
  <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
</svg>
    `
    return btn
  })(),
  arrow_left: (() => {
  const btn = createElement('button', {
    class: 'text-white p-2 rounded-full',
    type: 'button',
    id: 'arrow',
    'title': '',
    onclick: () => {
      const barre = document.getElementById('sidebar-content'); // <-- Correction ici
      if (barre) {
        barre.innerHTML = '';
        showChatBase({
          onSelect: (conversation, user) => {
            window.selectedConversation = conversation;
            window.selectedUser = user;
            if (window.renderChatArea) window.renderChatArea();
          }
        }).then(elements => {
          if (Array.isArray(elements)) {
            elements.forEach(el => {
              if (el && el.nodeType === Node.ELEMENT_NODE) {
                barre.appendChild(el);
              }
            });
          } else if (elements && elements.nodeType === Node.ELEMENT_NODE) {
            barre.appendChild(elements);
          }
          if (window.startConversationPolling) window.startConversationPolling();
        }).catch(error => {
          const errorElement = createElement('div', {
            class: 'p-4 text-center text-red-500'
          }, 'Erreur lors du chargement du contenu par défaut');
          barre.appendChild(errorElement);
        });
      }
    }
  });
    btn.innerHTML=`
   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-arrow-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
</svg>
    `
    return btn
  })(),
  new_group:(()=>{
    const btn = createElement('button',{
      class: ' p-2  rounded-full flex  bg-green-500 w-[50px] h-[50px] justify-center items-center',
      type: 'button',
      id: 'newgroupe',
      'title': '',
    },)
    btn.innerHTML=`
    <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="xh8yej3 x5yr21d" fill="white"><title>community-filled-refreshed</title><path fill-rule="evenodd" clip-rule="evenodd" d="M9.66933 12.2512C10.2819 12.1029 11.0497 12 12 12C12.9503 12 13.718 12.1029 14.3307 12.2512C14.9723 12.4065 15.6758 12.6891 16.2609 13.1293C16.8493 13.572 17.3782 14.2245 17.4979 15.1068C17.5601 15.5661 17.5363 16.5993 17.5208 17.1232C17.4988 17.8762 16.8803 18.4615 16.1401 18.4615H7.8599C7.1197 18.4615 6.50123 17.8762 6.47914 17.1232C6.46377 16.5993 6.43991 15.5661 6.50218 15.1068C6.6218 14.2245 7.1507 13.572 7.73908 13.1293C8.32419 12.6891 9.02768 12.4065 9.66933 12.2512Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M6.15899 12.0496C5.831 12.0181 5.4711 12 5.07692 12C4.20582 12 3.50202 12.0882 2.94047 12.2153C2.3523 12.3485 1.70742 12.5906 1.17107 12.9679C0.631727 13.3474 0.14689 13.9067 0.0372512 14.663C-0.0198334 15.0567 0.0020426 15.9423 0.0161272 16.3913C0.0363762 17.0368 0.603305 17.5385 1.28183 17.5385H4.66434C4.64768 17.4202 4.63737 17.2998 4.63378 17.1773C4.62053 16.7253 4.58502 15.506 4.67276 14.8588C4.84072 13.6199 5.47411 12.6934 6.15899 12.0496Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M17.841 12.0496C18.169 12.0181 18.5289 12 18.9231 12C19.7942 12 20.498 12.0882 21.0595 12.2153C21.6477 12.3485 22.2926 12.5906 22.8289 12.9679C23.3682 13.3474 23.8531 13.9067 23.9627 14.663C24.0198 15.0567 23.998 15.9423 23.9838 16.3913C23.9636 17.0368 23.3967 17.5385 22.7182 17.5385H19.3357C19.3523 17.4202 19.3626 17.2998 19.3662 17.1773C19.3794 16.7253 19.415 15.506 19.3272 14.8588C19.1593 13.6199 18.5259 12.6934 17.841 12.0496Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M16.6154 7.84614C16.6154 6.31674 17.8552 5.0769 19.3846 5.0769C20.9141 5.0769 22.1538 6.31674 22.1538 7.84614C22.1538 9.37558 20.9141 10.6154 19.3846 10.6154C17.8552 10.6154 16.6154 9.37558 16.6154 7.84614Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M8.30768 7.38463C8.30768 5.34542 9.96082 3.69232 12 3.69232C14.0392 3.69232 15.6923 5.34542 15.6923 7.38463C15.6923 9.4238 14.0392 11.0769 12 11.0769C9.96082 11.0769 8.30768 9.4238 8.30768 7.38463Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M1.84616 7.84614C1.84616 6.31674 3.08599 5.0769 4.61539 5.0769C6.14479 5.0769 7.38462 6.31674 7.38462 7.84614C7.38462 9.37558 6.14479 10.6154 4.61539 10.6154C3.08599 10.6154 1.84616 9.37558 1.84616 7.84614Z" fill="white"></path></svg>
    `
    return btn
  })(),
   new_contact:(()=>{
    const btn = createElement('button',{
      class: ' p-2 rounded-full bg-green-500 rounded-full flex  w-[50px] h-[50px] justify-center items-center',
      type: 'button',
      id: 'newcontact',
      'title': '',
    },)
    btn.innerHTML=`
    <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="xh8yej3 x5yr21d" fill="white"><path d="M18 11H16C15.7167 11 15.4792 10.9042 15.2875 10.7125C15.0958 10.5208 15 10.2833 15 10C15 9.71667 15.0958 9.47917 15.2875 9.2875C15.4792 9.09583 15.7167 9 16 9H18V7C18 6.71667 18.0958 6.47917 18.2875 6.2875C18.4792 6.09583 18.7167 6 19 6C19.2833 6 19.5208 6.09583 19.7125 6.2875C19.9042 6.47917 20 6.71667 20 7V9H22C22.2833 9 22.5208 9.09583 22.7125 9.2875C22.9042 9.47917 23 9.71667 23 10C23 10.2833 22.9042 10.5208 22.7125 10.7125C22.5208 10.9042 22.2833 11 22 11H20V13C20 13.2833 19.9042 13.5208 19.7125 13.7125C19.5208 13.9042 19.2833 14 19 14C18.7167 14 18.4792 13.9042 18.2875 13.7125C18.0958 13.5208 18 13.2833 18 13V11ZM9 12C7.9 12 6.95833 11.6083 6.175 10.825C5.39167 10.0417 5 9.1 5 8C5 6.9 5.39167 5.95833 6.175 5.175C6.95833 4.39167 7.9 4 9 4C10.1 4 11.0417 4.39167 11.825 5.175C12.6083 5.95833 13 6.9 13 8C13 9.1 12.6083 10.0417 11.825 10.825C11.0417 11.6083 10.1 12 9 12ZM1 18V17.2C1 16.6333 1.14583 16.1125 1.4375 15.6375C1.72917 15.1625 2.11667 14.8 2.6 14.55C3.63333 14.0333 4.68333 13.6458 5.75 13.3875C6.81667 13.1292 7.9 13 9 13C10.1 13 11.1833 13.1292 12.25 13.3875C13.3167 13.6458 14.3667 14.0333 15.4 14.55C15.8833 14.8 16.2708 15.1625 16.5625 15.6375C16.8542 16.1125 17 16.6333 17 17.2V18C17 18.55 16.8042 19.0208 16.4125 19.4125C16.0208 19.8042 15.55 20 15 20H3C2.45 20 1.97917 19.8042 1.5875 19.4125C1.19583 19.0208 1 18.55 1 18Z" fill="white"></path></svg>
    `
    return btn
  })(),
   new_community:(()=>{
    const btn = createElement('button',{
      class: 'text-white p-2  bg-green-500 rounded-full flex  w-[50px] h-[50px] justify-center items-center',
      type: 'button',
      id: 'newcommunity',
      'title': '',
    },)
    btn.innerHTML=`
    <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" class="xh8yej3 x5yr21d" fill="white"><title>new-group-refreshed-filled</title><path d="M12.5 11.95C12.9833 11.4167 13.3542 10.8083 13.6125 10.125C13.8708 9.44167 14 8.73333 14 8C14 7.26667 13.8708 6.55833 13.6125 5.875C13.3542 5.19167 12.9833 4.58333 12.5 4.05C13.5 4.18333 14.3333 4.625 15 5.375C15.6667 6.125 16 7 16 8C16 9 15.6667 9.875 15 10.625C14.3333 11.375 13.5 11.8167 12.5 11.95ZM17.45 20C17.6333 19.7 17.7708 19.3792 17.8625 19.0375C17.9542 18.6958 18 18.35 18 18V17C18 16.4 17.8667 15.8292 17.6 15.2875C17.3333 14.7458 16.9833 14.2667 16.55 13.85C17.4 14.15 18.1875 14.5375 18.9125 15.0125C19.6375 15.4875 20 16.15 20 17V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H17.45ZM20 11H19C18.7167 11 18.4792 10.9042 18.2875 10.7125C18.0958 10.5208 18 10.2833 18 10C18 9.71667 18.0958 9.47917 18.2875 9.2875C18.4792 9.09583 18.7167 9 19 9H20V8C20 7.71667 20.0958 7.47917 20.2875 7.2875C20.4792 7.09583 20.7167 7 21 7C21.2833 7 21.5208 7.09583 21.7125 7.2875C21.9042 7.47917 22 7.71667 22 8V9H23C23.2833 9 23.5208 9.09583 23.7125 9.2875C23.9042 9.47917 24 9.71667 24 10C24 10.2833 23.9042 10.5208 23.7125 10.7125C23.5208 10.9042 23.2833 11 23 11H22V12C22 12.2833 21.9042 12.5208 21.7125 12.7125C21.5208 12.9042 21.2833 13 21 13C20.7167 13 20.4792 12.9042 20.2875 12.7125C20.0958 12.5208 20 12.2833 20 12V11ZM8 12C6.9 12 5.95833 11.6083 5.175 10.825C4.39167 10.0417 4 9.1 4 8C4 6.9 4.39167 5.95833 5.175 5.175C5.95833 4.39167 6.9 4 8 4C9.1 4 10.0417 4.39167 10.825 5.175C11.6083 5.95833 12 6.9 12 8C12 9.1 11.6083 10.0417 10.825 10.825C10.0417 11.6083 9.1 12 8 12ZM0 18V17.2C0 16.6333 0.145833 16.1125 0.4375 15.6375C0.729167 15.1625 1.11667 14.8 1.6 14.55C2.63333 14.0333 3.68333 13.6458 4.75 13.3875C5.81667 13.1292 6.9 13 8 13C9.1 13 10.1833 13.1292 11.25 13.3875C12.3167 13.6458 13.3667 14.0333 14.4 14.55C14.8833 14.8 15.2708 15.1625 15.5625 15.6375C15.8542 16.1125 16 16.6333 16 17.2V18C16 18.55 15.8042 19.0208 15.4125 19.4125C15.0208 19.8042 14.55 20 14 20H2C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18Z" fill="white"></path></svg>
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
  })(),
  dots2: (() => {
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

      const menuItems = [
          { text: 'Nouveau Groupe'},
          { text: ' Messages importants'},
          { text: 'sélectionné les discussions', },
          { text: 'Déconnexion'}
      ];

      // Créer les éléments du menu
      menuItems.forEach(item=> {
          const menuItem = createElement('div', {
              class: 'px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center',
              
          });
          
          menuItem.innerHTML = `
              <span>${item.text}</span>
          `;
          
          // Ajouter l'événement click pour chaque élément
          menuItem.addEventListener('click', () => {
            
              dropdownMenu.classList.add('hidden');
              if (item.text === 'Déconnexion') 
              {
                localStorage.removeItem('user')
                location.replace('/');
              }
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

export function setActiveSidebarButton(activeId) {
  // Liste des IDs de boutons à gérer
  const ids = [
    'btnmessage',
    'btnstory',
    'btnchannel',
    'btngroupe',
    'btnsettings'
  ];
  ids.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      if (id === activeId) {
        btn.classList.add('btn-sidebar-active');
      } else {
        btn.classList.remove('btn-sidebar-active');
      }
    }
  });
}
export { btnicon };