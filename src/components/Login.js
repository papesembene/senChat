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
        class: 'bg-white p-6 rounded-lg shadow-lg w-96 max-w-sm mx-auto',
        style:{
           'box-shadow': '0 2px 10px rgba(0, 0, 0, 0.1)'
        },
        id: 'loginForm',
    }, [
        createElement('div', { class: 'text-center mb-8' }, [
            createElement('div', { class: `inline-flex items-center justify-center w-20 h-20 bg-${codeColors.green}-500 rounded-full mb-4` }, [
                createElement('svg', { 
                    class: 'w-12 h-12 text-white',
                    fill: 'currentColor',
                    viewBox: '0 0 24 24'
                }, [
                    createElement('path', { d: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488' })
                ])
            ]),
            createElement('h2', { class: 'text-2xl font-medium text-gray-800 mb-1' }, 'SenChat'),
            createElement('p', { class: 'text-gray-500 text-sm' }, 'Messagerie du Sénégal 🇸🇳')
        ]),
        createElement('div', { class: 'bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-6 rounded' }, [
            createElement('p', { class: 'text-sm text-yellow-800' }, 'Bienvenue sur SenChat. Nous allons vous envoyer un code de vérification par SMS.')
        ]),
        createElement('div', { class: 'mb-4' }, [
            createElement('label', { class: 'block text-sm font-medium text-gray-700 mb-2' }, 'Choisissez un pays'),
            createElement('select', {
                class: 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white',
                id: 'countryCode',
            })
        ]),
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
                    
                }
            }, 'Créer un nouveau compte')
        ]),

        showTosast('Bienvenue sur SenChat, veuillez entrer votre numéro de téléphone pour vous connecter.', 'success'),
    ])
    return form;
}

