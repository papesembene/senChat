import { createElement,createButton,createInput } from './Function.js';  
import { showTosast, getIndicatifCountry} from '../utils/helpers.js';
import { navigateTo } from './router.js';
import { codeColors } from '../utils/colors.js';
import { Login ,getCurrentUser} from '../Services/auth.js';
import { resetButton } from '../utils/helpers.js';

/**
 * 
 * @returns Un élément div HTML contenant le formulaire de connexion
 * @description Crée une div qui contient le formulaire de connexion
 */
export function ShowLoginForm() 
{
    const form = createForm();
    setTimeout(()=>getIndicatifCountry(),0);
         return createElement('div',{
        class:'flex flex-col items-center justify-center h-screen  w-full h-screen',
    },[
        form
    ]) 
}
/**
 * 
 * @returns Un élément form HTML pour le formulaire de connexion
 * @description Crée un formulaire de connexion avec un champ pour le numéro de téléphone et un bouton de soumission.
 */
export function createForm()
{
    let isloading = false
    const form = createElement('form', {
        class: 'bg-white p-6 rounded-lg shadow-lg w-[420px] max-w-md mx-auto',
        style:{
           'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)'
        },
        id: 'loginForm',
    }, [
        createElement('div', { class: 'text-center mb-8' }, [
            createElement('div', { class: 'flex justify-center mb-4' }, [
                createElement('div', { class: `inline-flex items-center justify-center w-20 h-20 bg-${codeColors.green}-500 rounded-full shadow-xl` }, [
                    createElement('img', {
                        src: 'https://cdn-icons-png.flaticon.com/512/2462/2462719.png',
                        class: 'w-12'
                        })


                  
                ])
            ]),
            createElement('h2', { class: 'text-2xl font-medium text-gray-800 mb-1' }, 'SenChat'),
            createElement('p', { class: 'text-gray-500 text-sm' }, 'Messagerie du Sénégal 🇸🇳')
        ]),
        createElement('div', { class: 'bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-6 rounded' }, [
            createElement('p', { class: 'text-sm text-yellow-800' }, 'Bienvenue sur SenChat. Nous allons vous envoyer un code de vérification par SMS.')
        ]),
        // createElement('div', { class: 'mb-4' }, [
        //     createElement('label', { class: 'block text-sm font-medium text-gray-700 mb-2' }, 'Choisissez un pays'),
        //     createElement('select', {
        //         class: 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white',
        //         id: 'countryCode',
        //     })
        // ]),
        createElement('div', { class: 'mb-6' }, [
            createElement('label', { class: 'block text-sm font-medium text-gray-700 mb-2' }, 'Numéro de téléphone'),
            createInput({ 
                type: 'text',
                id: 'telfiedl', 
                class: `w-full p-3 border border-${codeColors.green}-300 outline-none rounded-lg focus:ring-2 focus:ring-green-500 focus:border-${codeColors.green}-500 text-lg`,
                placeholder: 'Votre numéro de téléphone'
            })
        ]),
        createButton({
            type: 'submit',
            class: `w-full bg-${codeColors.green}-500 hover:bg-${codeColors.green}-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200`,
            onclick: (e) => {
                e.preventDefault();
                if (isloading) return; 
                const btn = e.target;
                const originalText = btn.innerHTML;
                isloading = true;
                btn.disabled = true;
                btn.classList.add('opacity-50', 'cursor-not-allowed');
                btn.innerHTML = `
                     <div class="flex items-center justify-center">
                <svg class="w-5 h-5 text-white animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Vérification...
            </div>
                `; 
                setTimeout(() => { 
                    const phoneNumber = form.querySelector('#telfiedl').value;
                    if(!phoneNumber || phoneNumber.length<8)
                    {
                        isloading = false;
                        resetButton(btn, originalText);
                        showTosast('Veuillez entrer un numéro de téléphone valide.', 'error');
                        return;

                    }
                    Login(phoneNumber)
                    .then(()=>{
                    
                    })
                    .catch((error) => {
                        isloading = false;
                        resetButton(btn, originalText);
                        showTosast('Utilisateur non trouvé', 'error');
                    });
                   
                }, 2000);
            }
         }, 'SUIVANT'),
        createElement('div', { class: 'text-center mt-6 pt-4 border-t border-gray-200' }, [
            createElement('p', { class: 'text-sm text-gray-600 mb-2' }, 'Pas encore de compte ?'),
            createButton({ 
                class: `text-${codeColors.green}-500 hover:text-${codeColors.green}-600 font-medium text-sm`,
                onclick: () => {
                    navigateTo('/register');
                }
            }, 'Créer un nouveau compte')
        ]),

        showTosast('Bienvenue sur SenChat, veuillez entrer votre numéro de téléphone pour vous connecter.', 'success'),
    ])
    return form;
}

