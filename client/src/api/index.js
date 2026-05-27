import api from './axiosInstance';

// Hero Slides
export const getHeroSlidesApi = () => api.get('/hero-slides');

// Partners
export const getPartnersApi = () => api.get('/partners');
export const getPartnerApi = (id) => api.get(`/partners/${id}`);

// Pages (CMS)
export const getPageApi = (slug) => api.get(`/pages/${slug}`);

// Chat
export const getChatMessagesApi = () => api.get('/chat/messages');
export const getPinnedMessageApi = () => api.get('/chat/pin');

// Tasks
export const getTasksApi = () => api.get('/tasks');
export const completeTaskApi = (id) => api.post(`/tasks/${id}/complete`);

// Market
export const getMarketItemsApi = () => api.get('/market/items');
export const purchaseItemApi = (id) => api.post(`/market/items/${id}/purchase`);
export const getMyTransactionsApi = () => api.get('/market/transactions');

// Tickets
export const getTicketsApi = () => api.get('/tickets');
export const getTicketApi = (id) => api.get(`/tickets/${id}`);
export const enterTicketApi = (id, data) => api.post(`/tickets/${id}/enter`, data);

// Tournaments
export const getTournamentsApi = () => api.get('/tournaments');
export const getTournamentApi = (id) => api.get(`/tournaments/${id}`);
export const joinTournamentApi = (id) => api.post(`/tournaments/${id}/join`);

// Events
export const getEventsApi = () => api.get('/events');
export const getEventApi = (id) => api.get(`/events/${id}`);

// Bonus Buy
export const getBonusBuysApi = () => api.get('/bonus-buy');

// Bonus Hunt
export const getBonusHuntsApi = () => api.get('/bonus-hunt');
export const getBonusHuntApi = (id) => api.get(`/bonus-hunt/${id}`);

// Special Odds
export const getSpecialOddsApi = () => api.get('/special-odds');

// Stream
export const getStreamApi = () => api.get('/stream');

// Wins
export const getWinsApi = () => api.get('/wins');

// Users
export const getUserApi = (id) => api.get(`/users/${id}`);
export const updateAvatarApi = (data) => api.put('/users/me/avatar', data);
