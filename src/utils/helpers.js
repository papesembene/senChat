import { createElement } from '../components/Function.js';
/**
 * 
 * @param {string} message 
 * @param {string} type 
 * @description Affiche un toast de notification en haut à gauche de l'écran.
 * @returns Un élément div HTML qui représente le toast de notification
 */
export function showTosast(message, type = 'success') 
{
    const toast = createElement('div', {
        class: `fixed top-4 left-2 p-4 rounded shadow-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`,
    }, message);
    document.body.insertBefore(toast, document.getElementById('app'));
    setTimeout(() => {
        toast.remove();
    }, 1000);
}


/**
 * 
 * @returns Un élément select HTML avec les indicatifs téléphoniques des pays
 * @description Récupère les indicatifs téléphoniques des pays depuis l'API restcountries.com et les ajoute à un élément select
 * 
 */
export function getIndicatifCountry()
{
     const countrySelect = document.getElementById("countryCode");
     const telInput = document.getElementById('telfiedl');
     const apiUrl = window.location.hostname === "localhost"
        ? "https://restcountries.com/v3.1/all"
        : "/api/countries";
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const countries = data
          .filter(c => c.idd && c.idd.root)
          .map(c => ({
            name: c.name.common,
            dialCode: c.idd.root + (c.idd.suffixes ? c.idd.suffixes[0] : ""),
            code: c.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
          
        countries.forEach(country => {
        
          const option = createElement("option");
          option.value = country.dialCode;
          option.textContent = `${country.name} (${country.dialCode})`;
          countrySelect.appendChild(option);
          
        });
        countrySelect.addEventListener('change', function () {
            if (telInput) 
            {
                telInput.placeholder = `${this.value} 123456789`;
            }
        });
         
      });
      return countrySelect;
}

/**
 * 
 * @param {string} btn 
 * @param {string} originalText 
 * @description Réinitialise l'état du bouton après une action, en réactivant le bouton et en restaurant son texte original.
 */
export function resetButton(btn, originalText) 
{
    btn.disabled = false;
    btn.classList.remove('opacity-50', 'cursor-not-allowed');
    btn.innerHTML = originalText;
}

/**
 * 
 * @param {string} name - Le nom complet de l'utilisateur.
 * @returns {string} - Les deux premières lettres du nom en majuscules.
 * @description
 * Prend un nom complet et retourne les deux premières lettres en majuscules.
 */
export function initial(name) {
  return name.split(' ').map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}
