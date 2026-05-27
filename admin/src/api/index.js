import api from './axiosInstance';

// Hero Slides
export const getHeroSlidesApi = () => api.get('/hero-slides/all');
export const createHeroSlideApi = (data) => api.post('/hero-slides', data);
export const updateHeroSlideApi = (id, data) => api.put(`/hero-slides/${id}`, data);
export const deleteHeroSlideApi = (id) => api.delete(`/hero-slides/${id}`);

// Auth
export const loginApi = (data) => api.post('/auth/login', data);
export const getMeApi = () => api.get('/auth/me');

// Users
export const getUsersApi = (params) => api.get('/users', { params });
export const setRoleApi = (id, role) => api.put(`/users/${id}/role`, { role });
export const setBanApi = (id, isBanned) => api.put(`/users/${id}/ban`, { isBanned });
export const setVipApi = (id, vipLevel) => api.put(`/users/${id}/vip`, { vipLevel });
export const setPointsApi = (id, points) => api.put(`/users/${id}/points`, { points });

// Chat
export const getChatMessagesApi = () => api.get('/chat/messages');
export const deleteMessageApi = (id) => api.delete(`/chat/messages/${id}`);
export const pinMessageApi = (content) => api.post('/chat/pin', { content });
export const unpinMessageApi = () => api.delete('/chat/pin');
export const muteUserApi = (id, isMuted) => api.put(`/chat/users/${id}/mute`, { isMuted });

// Partners
export const getPartnersApi = () => api.get('/partners/all');
export const createPartnerApi = (data) => api.post('/partners', data);
export const updatePartnerApi = (id, data) => api.put(`/partners/${id}`, data);
export const deletePartnerApi = (id) => api.delete(`/partners/${id}`);

// Pages
export const getPagesApi = () => api.get('/pages');
export const createPageApi = (data) => api.post('/pages', data);
export const updatePageApi = (id, data) => api.put(`/pages/${id}`, data);
export const deletePageApi = (id) => api.delete(`/pages/${id}`);

// Tasks
export const getTasksApi = () => api.get('/tasks');
export const createTaskApi = (data) => api.post('/tasks', data);
export const updateTaskApi = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTaskApi = (id) => api.delete(`/tasks/${id}`);

// Market
export const getMarketItemsApi = () => api.get('/market/items');
export const createMarketItemApi = (data) => api.post('/market/items', data);
export const updateMarketItemApi = (id, data) => api.put(`/market/items/${id}`, data);
export const deleteMarketItemApi = (id) => api.delete(`/market/items/${id}`);

// Tickets
export const getTicketsApi = () => api.get('/tickets/all');
export const createTicketApi = (data) => api.post('/tickets', data);
export const updateTicketApi = (id, data) => api.put(`/tickets/${id}`, data);
export const drawTicketApi = (id) => api.post(`/tickets/${id}/draw`);

// Tournaments
export const getTournamentsApi = () => api.get('/tournaments');
export const createTournamentApi = (data) => api.post('/tournaments', data);
export const updateTournamentApi = (id, data) => api.put(`/tournaments/${id}`, data);

// Events
export const getEventsApi = () => api.get('/events/all');
export const createEventApi = (data) => api.post('/events', data);
export const updateEventApi = (id, data) => api.put(`/events/${id}`, data);
export const deleteEventApi = (id) => api.delete(`/events/${id}`);

// Bonus Buy
export const getBonusBuysApi = () => api.get('/bonus-buy');
export const createBonusBuyApi = (data) => api.post('/bonus-buy', data);
export const updateBonusBuyApi = (id, data) => api.put(`/bonus-buy/${id}`, data);
export const deleteBonusBuyApi = (id) => api.delete(`/bonus-buy/${id}`);

// Bonus Hunt
export const getBonusHuntsApi = () => api.get('/bonus-hunt');
export const getBonusHuntApi = (id) => api.get(`/bonus-hunt/${id}`);
export const createBonusHuntApi = (data) => api.post('/bonus-hunt', data);
export const updateBonusHuntApi = (id, data) => api.put(`/bonus-hunt/${id}`, data);
export const addBonusHuntSlotApi = (id, data) => api.post(`/bonus-hunt/${id}/slots`, data);

// Special Odds
export const getSpecialOddsApi = () => api.get('/special-odds/all');
export const createSpecialOddApi = (data) => api.post('/special-odds', data);
export const updateSpecialOddApi = (id, data) => api.put(`/special-odds/${id}`, data);
export const deleteSpecialOddApi = (id) => api.delete(`/special-odds/${id}`);

// Stream
export const getStreamApi = () => api.get('/stream');
export const updateStreamApi = (data) => api.put('/stream', data);

// Wins
export const getWinsApi = () => api.get('/wins');
export const createWinApi = (data) => api.post('/wins', data);
export const deleteWinApi = (id) => api.delete(`/wins/${id}`);

// Upload
export const uploadImageApi = (formData) =>
  api.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
