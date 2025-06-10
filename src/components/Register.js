import { createElement, createButton, createInput } from './Function.js';  
import { showTosast, getIndicatifCountry } from '../utils/helpers.js';
import { navigateTo } from './router.js';
import { codeColors } from '../utils/colors.js';
import { Register } from '../Services/auth.js';
import { resetButton } from '../utils/helpers.js';

/**
 * 
 * @returns Un élément div HTML contenant le formulaire d'inscription
 * @description Crée une div qui contient le formulaire d'inscription
 */
export function ShowRegisterForm() 
{
    const form = createRegisterForm();
    setTimeout(() => getIndicatifCountry(), 0);
    return createElement('div', {
        class: 'flex flex-col items-center justify-center h-screen w-full h-screen',
    }, [
        form
    ])
}

/**
 * 
 * @returns Un élément form HTML pour le formulaire d'inscription
 * @description Crée un formulaire d'inscription avec des champs pour le nom, prénom, numéro de téléphone et un bouton de soumission.
 */
export function createRegisterForm()
{
    let isloading = false
    const form = createElement('form', {
        class: 'bg-white p-6 rounded-lg shadow-lg w-[820px] max-w-md mx-auto',
        // class: 'bg-white p-6 rounded-lg shadow-lg w-[420px] max-w-sm mx-auto',
        style: {
           'box-shadow': '0 2px 10px rgba(0, 0, 0, 0.1)'
        },
        id: 'registerForm',
    }, [
        createElement('div', { class: 'text-center mb-8' }, [
            createElement('div', { class: `inline-flex items-center justify-center w-20 h-20 bg-${codeColors.green}-500 rounded-full mb-4` }, [
               createElement('img',{
                        src:'src/conversation.png',
                        class:'w-12'
                    })
            ]),
            createElement('h2', { class: 'text-2xl font-medium text-gray-800 mb-1' }, 'SenChat'),
            createElement('p', { class: 'text-gray-500 text-sm' }, 'Créer un compte - Messagerie du Sénégal 🇸🇳')
        ]),
        createElement('div', { class: 'bg-blue-50 border-l-4 border-blue-400 p-3 mb-6 rounded' }, [
            createElement('p', { class: 'text-sm text-blue-800' }, 'Créez votre compte SenChat. Nous vous enverrons un code de vérification par SMS.')
        ]),
        createElement('div', { class: 'mb-4' }, [
            createElement('label', { class: 'block text-sm font-medium text-gray-700 mb-2' }, 'Nom'),
            createInput({ 
                type: 'text',
                id: 'NameField', 
                class: `w-full p-3 border border-${codeColors.green}-300 outline-none rounded-lg focus:ring-2 focus:ring-green-500 focus:border-${codeColors.green}-500 text-lg`,
                placeholder: 'Votre nom'
            })
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
                id: 'phoneField', 
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
                Création du compte...
            </div>
                `; 
                setTimeout(() => { 
                   
                    const Name = form.querySelector('#NameField').value;
                    const phoneNumber = form.querySelector('#phoneField').value;
                    const codecountry = form.querySelector('#countryCode').value
                    // Validation des champs
                    
                    
                    if (!Name || Name.trim().length < 2) {
                        isloading = false;
                        resetButton(btn, originalText);
                        showTosast('Veuillez entrer un nom valide (minimum 2 caractères).', 'error');
                        return;
                    }
                    
                    if (!phoneNumber || phoneNumber.length < 8) {
                        isloading = false;
                        resetButton(btn, originalText);
                        showTosast('Veuillez entrer un numéro de téléphone valide.', 'error');
                        return;
                    }
                    const userData = {
                        name: Name.trim(),
                        telephone: phoneNumber,
                        codecountry:codecountry

                    };
                    Register(userData);
                    navigateTo('/')
                    resetButton(btn,originalText)
                    showTosast('Compte créé avec succès ! Vérifiez votre SMS.', 'success');
                    // .then(() => {
                    //     showTosast('Compte créé avec succès ! Vérifiez votre SMS.', 'success');
                    //     // Rediriger vers la page de vérification ou connexion
                    //     // navigateTo('/verify-code');
                    // })
                    // .catch((error) => {
                    //     isloading = false;
                    //     resetButton(btn, originalText);
                    //     showTosast('Erreur lors de la création du compte. Ce numéro existe peut-être déjà.', 'error');
                    // });
                   
                }, 2000);
            }
         }, 'CRÉER MON COMPTE'),
        createElement('div', { class: 'text-center mt-6 pt-4 border-t border-gray-200' }, [
            createElement('p', { class: 'text-sm text-gray-600 mb-2' }, 'Vous avez déjà un compte ?'),
            createButton({ 
                class: `text-${codeColors.green}-500 hover:text-${codeColors.green}-600 font-medium text-sm`,
                onclick: () => {
                    navigateTo('/');
                }
            }, 'Se connecter')
        ]),

        showTosast('Créez votre compte SenChat en remplissant les informations ci-dessous.', 'success'),
    ])
    return form;
}