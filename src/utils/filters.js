/**
 
 * @description Cette fonction prend en entrée une liste de conversations, une liste d'utilisateurs, l'ID de l'utilisateur actuel et une valeur de recherche.
    * Elle retourne une liste de conversations filtrées qui incluent l'utilisateur actuel et correspondent à la valeur de recherche.
    * Si la valeur de recherche est vide, toutes les conversations de l'utilisateur actuel sont retournées.
    * @param {Array} conversations - Liste des conversations à filtrer.
 * @param {Array} users - Liste des utilisateurs pour récupérer les noms.
 * @param {number} currentId - ID de l'utilisateur actuel.
 * @param {string} searchValue - Valeur de recherche pour filtrer les conversations.    
 * @returns {Array} - Liste des conversations filtrées. 
 * @example
 * const filteredConversations = filterConversations(conversations, users, currentUser.id, 'search term');
 */
export function filterConversations(conversations, users, currentId, searchValue) {
  return conversations.filter(conversation => {
    if (!conversation.participants.includes(currentId)) return false;
    const otherParticipantId = conversation.participants.find(id => Number(id) !== currentId);
    const otherParticipant = users.find(user => String(user.id) === String(otherParticipantId));
    const displayName = conversation.type === 'prive'
      ? (otherParticipant ? otherParticipant.name : 'Utilisateur inconnu')
      : (conversation.name || 'Conversation de groupe');
    return !searchValue || displayName.toLowerCase().includes(searchValue.toLowerCase());
  });
}