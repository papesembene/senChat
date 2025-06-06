import { createElement,createButton,createInput } from './Function.js';
import { codeColors } from '../utils/colors.js';
import { btnicon } from '../utils/constants.js'

/**
 * ShowChat - Composant pour afficher une interface de chat
 * @returns {HTMLElement} L'élément HTML représentant l'interface de chat
 * @description Crée une interface de chat avec une barre latérale, une zone de conversation et une zone de saisie.
 */

// export function ShowChat() 
// {
//     return createElement('div', {
//         class: 'w-full h-screen bg-gray-100 flex items-center justify-center',
//     }, [
//         createElement('div', { class: 'bg-white flex rounded-lg shadow-lg w-[1400px] mx-4 h-[850px] overflow-hidden' }, [
          
//             createElement('div', { class: `w-[3%] h-full bg-${codeColors.green}-500 flex flex-col items-center py-4` }, [
               
//                 createElement('div', { class: 'flex flex-col space-y-4 justify-center items-center' }, [
//                     btnicon.message,
//                     btnicon.story,
//                     btnicon.channel,
//                     btnicon.groupe,
//                     btnicon.settings,
//                     createElement('img',{
//                         src: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
//                         alt: 'Logo',
//                         class: 'w-8 h-8 rounded-full mt-4 cursor-pointer hover:bg-gray-200 p-1 transition-colors'
//                     })
//                 ])
//             ]),
//             createElement('div', { class: 'w-[25%] h-full bg-white border-r border-gray-200 flex flex-col' }, [
//                 // Header des conversations
//                 createElement('div', { class: 'p-4 bg-gray-50 border-b border-gray-200' }, [
//                     createElement('div', { class: 'flex items-center justify-between mb-3' }, [
//                         createElement('h2', { class: 'text-lg font-medium text-gray-900' }, 'SenChat 🇸🇳'),
//                         createElement('div', { class: 'flex space-x-2' }, [
//                             createElement('button', { class: 'p-2 hover:bg-gray-200 rounded-full transition-colors' }, [
//                                 createElement('svg', { class: 'w-5 h-5 text-gray-600', fill: 'currentColor', viewBox: '0 0 24 24' }, [
//                                     createElement('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z' })
//                                 ])
//                             ])
//                         ])
//                     ]),
//                     // Barre de recherche
//                     createElement('div', { class: 'relative' }, [
//                         createElement('input', { 
//                             class: 'w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none focus:border-green-500',
//                             placeholder: 'Rechercher une conversation...',
//                         }),  
//                     ]),
//                     // Boutons de filtrage
//                     createElement('div',{
//                             class:'flex items-center  justify-center mb-3 text-sm mt-4',
//                         },[
//                             createButton({
//                                 class: 'p-2 hover:bg-gray-100 w-[25%] h-[50%] border border-solid border-green-500 rounded-full transition-colors mr-1',
//                                 type: 'button'
//                             }, 'Toutes'),
//                             createButton({
//                                 class: 'p-2 hover:bg-gray-100 w-[25%] rounded-full border border-solid border-green-500  transition-colors text-ellipsis whitespace-nowrap',
//                                 type: 'button'
//                             }, 'Non Lues'),
//                             createButton({
//                                 class: 'p-2 hover:bg-gray-100 w-[25%] rounded-full border border-solid border-green-500 transition-colors ml-1',
//                                 type: 'button'
//                             }, 'Favoris'),
//                             createButton({
//                                 class: 'p-2 hover:bg-gray-100 w-[25%] rounded-full border border-solid border-green-500 transition-colors ml-1',
//                                 type: 'button'
//                             }, 'Groupes'),

//                         ]),
                    
//                 ]),
                
//                 // Liste des conversations
//                 // createElement('div', { class: 'flex-1 overflow-y-auto' }, [
//                 //     // Conversation exemple
//                 //     createElement('div', { class: 'flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100',
//                 //         vFor:{
//                 //             each:fetch('http://localhost:3001/contacts')
//                 //             .then(res => res.json())
//                 //             .then(contact => contact),
//                 //             render:(contact, index) => 
//                 //             {
//                 //                 return createElement('div', { class: 'w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-3' }, [
//                 //                 createElement('span', { class: 'text-white font-medium' }, `${contact[index].name.split(' ')[0].charAt(0).toUpperCase()}${contact[index].name.split(' ')[1].charAt(0).toUpperCase()}`)
//                 //             ]),
//                 //                 createElement('div', { class: 'flex-1 min-w-0' }, [
//                 //                 createElement('div', { class: 'flex items-center justify-between mb-1' }, [
//                 //                 createElement('h3', { class: 'text-sm font-medium text-gray-900 truncate' }, `${contact[index].name}`),
//                 //                 createElement('span', { class: 'text-xs text-gray-500' }, '14:30')
//                 //             ]),
//                 //                 createElement('p', { class: 'text-sm text-gray-600 truncate' }, ``)
//                 //         ])
//                 //             }
//                 //      }}, [
//                 //         // createElement('div', { class: 'w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-3' }, [
//                 //         //     createElement('span', { class: 'text-white font-medium' }, 'AM')
//                 //         // ]),
//                 //         // createElement('div', { class: 'flex-1 min-w-0' }, [
//                 //         //     createElement('div', { class: 'flex items-center justify-between mb-1' }, [
//                 //         //         createElement('h3', { class: 'text-sm font-medium text-gray-900 truncate' }, 'Amadou Diop'),
//                 //         //         createElement('span', { class: 'text-xs text-gray-500' }, '14:30')
//                 //         //     ]),
//                 //         //     createElement('p', { class: 'text-sm text-gray-600 truncate' }, 'Salut, comment ça va ?')
//                 //         // ])
//                 //     ]),
                    
//                 //     // Autre conversation
//                 //     // createElement('div', { class: 'flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100' }, [
//                 //     //     createElement('div', { class: 'w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-3' }, [
//                 //     //         createElement('span', { class: 'text-white font-medium' }, 'FS')
//                 //     //     ]),
//                 //     //     createElement('div', { class: 'flex-1 min-w-0' }, [
//                 //     //         createElement('div', { class: 'flex items-center justify-between mb-1' }, [
//                 //     //             createElement('h3', { class: 'text-sm font-medium text-gray-900 truncate' }, 'Fatou Sall'),
//                 //     //             createElement('span', { class: 'text-xs text-gray-500' }, '12:15')
//                 //     //         ]),
//                 //     //         createElement('p', { class: 'text-sm text-gray-600 truncate' }, 'À tout à l\'heure !')
//                 //     //     ])
//                 //     // ])
//                 // ])
                
//             ]),
            
            
//             // Zone de chat principale (72%) - Style WhatsApp
//             createElement('div', { class: 'w-[72%] h-full bg-gray-50 flex flex-col' }, [
//                 // Header du chat
//                 createElement('div', { class: 'p-4 bg-white border-b border-gray-200 flex items-center' }, [
//                     createElement('div', { class: 'w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3' }, [
//                         createElement('span', { class: 'text-white font-medium text-sm' }, 'AM')
//                     ]),
//                     createElement('div', { class: 'flex-1' }, [
//                         createElement('h3', { class: 'font-medium text-gray-900' }, 'Amadou Diop'),
//                         createElement('p', { class: 'text-sm text-gray-500' }, 'En ligne')
//                     ]),
//                     createElement('div', { class: 'flex space-x-2' }, [
//                         createElement('button', { class: 'p-2 hover:bg-gray-100 rounded-full transition-colors' }, [
//                             createElement('svg', { class: 'w-5 h-5 text-gray-600', fill: 'currentColor', viewBox: '0 0 24 24' }, [
//                                 createElement('path', { d: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z' })
//                             ])
//                         ]),
//                         createElement('button', { class: 'p-2 hover:bg-gray-100 rounded-full transition-colors' }, [
//                             createElement('svg', { class: 'w-5 h-5 text-gray-600', fill: 'currentColor', viewBox: '0 0 24 24' }, [
//                                 createElement('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' })
//                             ])
//                         ])
//                     ])
//                 ]),
                
//                 // Zone des messages
//                 createElement('div', { class: 'flex-1 overflow-y-auto p-4 space-y-4' }, [
//                     // Message reçu
//                     createElement('div', { class: 'flex items-start' }, [
//                         createElement('div', { class: 'bg-white rounded-lg p-3 max-w-xs shadow-sm' }, [
//                             createElement('p', { class: 'text-sm text-gray-800' }, 'Salut ! Comment ça va ?'),
//                             createElement('span', { class: 'text-xs text-gray-500 mt-1 block' }, '14:30')
//                         ])
//                     ]),
                    
//                     // Message envoyé
//                     createElement('div', { class: 'flex items-start justify-end' }, [
//                         createElement('div', { class: 'bg-green-500 text-white rounded-lg p-3 max-w-xs' }, [
//                             createElement('p', { class: 'text-sm' }, 'Ça va bien, merci ! Et toi ?'),
//                             createElement('span', { class: 'text-xs text-green-100 mt-1 block' }, '14:32')
//                         ])
//                     ])
//                 ]),
                
//                 // Zone de saisie
//                 createElement('div', { class: 'p-4 bg-white border-t border-gray-200' }, [
//                     createElement('div', { class: 'flex items-center space-x-3' }, [
//                         createElement('button', { class: 'p-2 hover:bg-gray-100 rounded-full transition-colors' }, [
//                             createElement('svg', { class: 'w-5 h-5 text-gray-600', fill: 'currentColor', viewBox: '0 0 24 24' }, [
//                                 createElement('path', { d: 'M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z' })
//                             ])
//                         ]),
//                         createElement('div', { class: 'flex-1' }, [
//                             createElement('input', { 
//                                 class: 'w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors',
//                                 placeholder: 'Tapez votre message...'
//                             })
//                         ]),
//                         createElement('button', { class: 'p-2 bg-green-500 hover:bg-green-600 rounded-full transition-colors' }, [
//                             createElement('svg', { class: 'w-5 h-5 text-white', fill: 'currentColor', viewBox: '0 0 24 24' }, [
//                                 createElement('path', { d: 'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z' })
//                             ])
//                         ])
//                     ])
//                 ])
//             ])
//         ])
//     ]);
// }

export function ShowChat() {
    return createElement('div', {
        class: 'w-full h-screen bg-gray-100 flex items-center justify-center',
    }, [
        createElement('div', { class: 'bg-white flex rounded-lg shadow-lg w-[1400px] mx-4 h-[850px] overflow-hidden' }, [
            // Barre latérale gauche (3%)
            createElement('div', { class: `w-[3%] h-full bg-${codeColors.green}-500 flex flex-col items-center py-4` }, [
                createElement('div', { class: 'flex flex-col space-y-4 justify-center items-center' }, [
                    btnicon.message,
                    btnicon.story,
                    btnicon.channel,
                    btnicon.groupe,
                    btnicon.settings,
                    createElement('img',{
                        src: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
                        alt: 'Logo',
                        class: 'w-8 h-8 rounded-full mt-4 cursor-pointer hover:bg-gray-200 p-1 transition-colors'
                    })
                ])
            ]),
            // Barre latérale des conversations (25%)
            createElement('div', { class: 'w-[25%] h-full bg-white border-r border-gray-200 flex flex-col' }, [
                // Header des conversations
                createElement('div', { class: 'p-4 bg-gray-50 border-b border-gray-200' }, [
                    createElement('div', { class: 'flex items-center justify-between mb-3' }, [
                        createElement('h2', { class: 'text-lg font-medium text-gray-900' }, 'SenChat 🇸🇳'),
                        createElement('div', { class: 'flex space-x-2' }, [
                            createElement('button', { class: 'p-2 hover:bg-gray-200 rounded-full transition-colors' }, [
                                createElement('svg', { class: 'w-5 h-5 text-gray-600', fill: 'currentColor', viewBox: '0 0 24 24' }, [
                                    createElement('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z' })
                                ])
                            ])
                        ])
                    ]),
                    // Barre de recherche
                    createElement('div', { class: 'relative' }, [
                        createElement('input', { 
                            class: 'w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none focus:border-green-500',
                            placeholder: 'Rechercher une conversation...',
                        }),  
                    ]),
                    // Boutons de filtrage
                    createElement('div',{
                        class:'flex items-center justify-center mb-3 text-sm mt-4',
                    },[
                        createButton({
                            class: 'p-2 hover:bg-gray-100 w-[25%] h-[50%] border border-solid border-green-500 rounded-full transition-colors mr-1',
                            type: 'button'
                        }, 'Toutes'),
                        createButton({
                            class: 'p-2 hover:bg-gray-100 w-[25%] rounded-full border border-solid border-green-500 transition-colors text-ellipsis whitespace-nowrap',
                            type: 'button'
                        }, 'Non Lues'),
                        createButton({
                            class: 'p-2 hover:bg-gray-100 w-[25%] rounded-full border border-solid border-green-500 transition-colors ml-1',
                            type: 'button'
                        }, 'Favoris'),
                        createButton({
                            class: 'p-2 hover:bg-gray-100 w-[25%] rounded-full border border-solid border-green-500 transition-colors ml-1',
                            type: 'button'
                        }, 'Groupes'),
                    ]),
                ]),
                
                // Liste des conversations
                createElement('div', { 
                    class: 'flex-1 overflow-y-auto',
                    vFor: {
                        each: fetch('http://localhost:3001/contacts')
                            .then(res => res.json()),
                        render: (contact, index) => {
                            return createElement('div', { 
                                class: 'flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100'
                            }, [
                                createElement('div', { class: 'w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-3' }, [
                                    createElement('span', { class: 'text-white font-medium' }, 
                                        `${contact.name.split(' ')[0].charAt(0).toUpperCase()}${contact.name.split(' ')[1]?.charAt(0).toUpperCase() || ''}`)
                                ]),
                                createElement('div', { class: 'flex-1 min-w-0' }, [
                                    createElement('div', { class: 'flex items-center justify-between mb-1' }, [
                                        createElement('h3', { class: 'text-sm font-medium text-gray-900 truncate' }, contact.name),
                                        createElement('span', { class: 'text-xs text-gray-500' }, '14:30')
                                    ]),
                                    createElement('p', { class: 'text-sm text-gray-600 truncate' }, contact.lastMessage || 'Aucun message')
                                ])
                            ]);
                        }
                    }
                })
            ]),
            
            // Zone de chat principale (72%) - Style WhatsApp
            createElement('div', { class: 'w-[72%] h-full bg-gray-50 flex flex-col' }, [
                // Header du chat
                createElement('div', { class: 'p-4 bg-white border-b border-gray-200 flex items-center' }, [
                    createElement('div', { class: 'w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3' }, [
                        createElement('span', { class: 'text-white font-medium text-sm' }, 'AM')
                    ]),
                    createElement('div', { class: 'flex-1' }, [
                        createElement('h3', { class: 'font-medium text-gray-900' }, 'Amadou Diop'),
                        createElement('p', { class: 'text-sm text-gray-500' }, 'En ligne')
                    ]),
                    createElement('div', { class: 'flex space-x-2' }, [
                        createElement('button', { class: 'p-2 hover:bg-gray-100 rounded-full transition-colors' }, [
                            createElement('svg', { class: 'w-5 h-5 text-gray-600', fill: 'currentColor', viewBox: '0 0 24 24' }, [
                                createElement('path', { d: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z' })
                            ])
                        ]),
                        createElement('button', { class: 'p-2 hover:bg-gray-100 rounded-full transition-colors' }, [
                            createElement('svg', { class: 'w-5 h-5 text-gray-600', fill: 'currentColor', viewBox: '0 0 24 24' }, [
                                createElement('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' })
                            ])
                        ])
                    ])
                ]),
                
                // Zone des messages
                createElement('div', { class: 'flex-1 overflow-y-auto p-4 space-y-4' }, [
                    // Message reçu
                    createElement('div', { class: 'flex items-start' }, [
                        createElement('div', { class: 'bg-white rounded-lg p-3 max-w-xs shadow-sm' }, [
                            createElement('p', { class: 'text-sm text-gray-800' }, 'Salut ! Comment ça va ?'),
                            createElement('span', { class: 'text-xs text-gray-500 mt-1 block' }, '14:30')
                        ])
                    ]),
                    
                    // Message envoyé
                    createElement('div', { class: 'flex items-start justify-end' }, [
                        createElement('div', { class: 'bg-green-500 text-white rounded-lg p-3 max-w-xs' }, [
                            createElement('p', { class: 'text-sm' }, 'Ça va bien, merci ! Et toi ?'),
                            createElement('span', { class: 'text-xs text-green-100 mt-1 block' }, '14:32')
                        ])
                    ])
                ]),
                
                // Zone de saisie
                createElement('div', { class: 'p-4 bg-white border-t border-gray-200' }, [
                    createElement('div', { class: 'flex items-center space-x-3' }, [
                        createElement('button', { class: 'p-2 hover:bg-gray-100 rounded-full transition-colors' }, [
                            createElement('svg', { class: 'w-5 h-5 text-gray-600', fill: 'currentColor', viewBox: '0 0 24 24' }, [
                                createElement('path', { d: 'M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z' })
                            ])
                        ]),
                        createElement('div', { class: 'flex-1' }, [
                            createElement('input', { 
                                class: 'w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors',
                                placeholder: 'Tapez votre message...'
                            })
                        ]),
                        createElement('button', { class: 'p-2 bg-green-500 hover:bg-green-600 rounded-full transition-colors' }, [
                            createElement('svg', { class: 'w-5 h-5 text-white', fill: 'currentColor', viewBox: '0 0 24 24' }, [
                                createElement('path', { d: 'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z' })
                            ])
                        ])
                    ])
                ])
            ])
        ])
    ]);
}