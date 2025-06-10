import { navigateTo } from "../components/router.js";  
import { showTosast } from "../utils/helpers.js";
const API_URL = import.meta.env.VITE_API_URL;

    /**
     * 
     * @param {number} number 
     * @returns {Promise<void>} 
     * @description Envoie une requête pour vérifier si l'utilisateur existe dans la base de données.
     * Si l'utilisateur est trouvé, il est enregistré dans le localStorage et une redirection peut être effectuée.
     */
    export function Login(number) 
    {
        // return fetch('http://localhost:3001/users')
        return fetch(`${API_URL}/users`)
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
                    navigateTo('/chat');
                    return user;
                } else {
                    throw new Error('Numéro non trouvé');
                }
            })
            .catch(error => {
                
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


    /**
     * @param {Object} userData - Données de l'utilisateur
     * @param {string} userData.lastName - Nom
     * @param {string} userData.phoneNumber - Numéro de téléphone
     * @param {string} userData.codecountry - indicatif
     * @returns {Promise<Object>} Résultat de l'inscription
     */
    export async function Register(userData) {
        try {
      
            if (!userData.name ||  !userData.telephone) {
                throw new Error('Tous les champs sont requis');
            }
            const users = await fetch(`${API_URL}/users`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Erreur lors de la récupération des utilisateurs');
                    }
                    return res.json();
                });
                console.log(users);
                
            const existingUser = users.find(user => 
                user.telephone === userData.telephone
            );

            if (existingUser) {
                throw new Error('Ce numéro de téléphone est déjà utilisé');
            }

            const newUser = {
                name: userData.name.trim(),
                telephone: userData.telephone,
                codecountry:userData.codecountry,
                status: "hors ligne",
                createdAt: new Date().toISOString()
            };

            const saveResult = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });
            const savedUser = await saveResult.json();
           return {
                success: true,
                user: savedUser,
                message: 'Compte créé avec succès'
            };
            

        } catch (error) {
            let errorMessage = 'Erreur lors de la création du compte';
            if (error.message.includes('déjà utilisé')) {
                errorMessage = 'Ce numéro de téléphone est déjà utilisé';
            } else if (error.message.includes('requis')) {
                errorMessage = 'Veuillez remplir tous les champs';
            } else if (error.message.includes('réseau') || error.message.includes('fetch')) {
                errorMessage = 'Problème de connexion. Vérifiez votre réseau.';
            }
            
            showTosast(errorMessage, 'error');
            
            return {
                success: false,
                error: error.message,
                message: errorMessage
            };
        }
    }

   
