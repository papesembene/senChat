import { navigateTo } from "../components/router.js";  
import { showTosast } from "../utils/helpers.js";
/**
 * 
 * @param {number} number 
 * @returns {Promise<void>} 
 * @description Envoie une requête pour vérifier si l'utilisateur existe dans la base de données.
 * Si l'utilisateur est trouvé, il est enregistré dans le localStorage et une redirection peut être effectuée.
 */
export function Login(number) 
{
    return fetch('http://localhost:3001/users')
        .then(res => {
            if (!res.ok) {
                throw new Error('Erreur serveur');
            }
            return res.json();
        })
        .then(users => {
            const user = users.find(user => user.telephone === number);
            
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                console.log(user);
                navigateTo('/chat');
                return user;
            } else {
                throw new Error('Numéro non trouvé');
            }
        })
        .catch(error => {
            // console.error('Erreur Login:', error);
            throw error;
        });
}

/**
 * 
 * @returns {Object|null}
 * @description Récupère l'utilisateur actuellement connecté à partir du localStorage.
 * Si l'utilisateur est trouvé, il est renvoyé sous forme d'objet, sinon null est renvoyé.
 */
export function  getCurrentUser() {
    const user = localStorage.getItem('user');
    if (user) {
        console.log(user);
        return JSON.parse(user);
        
        
    } else {
        return null;
    }
}
/**
 * * @description Déconnecte l'utilisateur en supprimant ses informations du localStorage et en affichant un message de succès.
 * Redirige ensuite l'utilisateur vers la page d'accueil.
 */
export function logout() {
    localStorage.removeItem('user');
    showTosast('Vous avez été déconnecté avec succès', 'success');
    navigateTo('/');
}