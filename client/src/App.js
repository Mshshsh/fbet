import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import Navbar from './components/common/Navbar/Navbar';
import ChatWidget from './components/chat/ChatWidget';
import './styles/global.css';

// Pages
import Home from './pages/Home/Home';
import Sponsorlar from './pages/Sponsorlar/Sponsorlar';
import Yayin from './pages/Yayin/Yayin';
import Gorevler from './pages/Gorevler/Gorevler';
import VIP from './pages/VIP/VIP';
import Market from './pages/Market/Market';
import Oyunlar from './pages/Oyunlar/Oyunlar';
import Turnuva from './pages/Turnuva/Turnuva';
import Biletler from './pages/Biletler/Biletler';
import Etkinlikler from './pages/Etkinlikler/Etkinlikler';
import OzelOranlar from './pages/OzelOranlar/OzelOranlar';
import BonusBuy from './pages/BonusBuy/BonusBuy';
import BonusHunt from './pages/BonusHunt/BonusHunt';
import Turnuvalar from './pages/Turnuvalar/Turnuvalar';
import Cark from './pages/Cark/Cark';
import Profil from './pages/Profil/Profil';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30000, retry: 1 } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatProvider>
          <BrowserRouter>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sponsorlar" element={<Sponsorlar />} />
                <Route path="/yayin" element={<Yayin />} />
                <Route path="/gorevler" element={<Gorevler />} />
                <Route path="/vip" element={<VIP />} />
                <Route path="/market" element={<Market />} />
                <Route path="/games" element={<Oyunlar />} />
                <Route path="/turnuva" element={<Turnuva />} />
                <Route path="/biletler" element={<Biletler />} />
                <Route path="/etkinlikler" element={<Etkinlikler />} />
                <Route path="/ozeloran" element={<OzelOranlar />} />
                <Route path="/bonus-buy" element={<BonusBuy />} />
                <Route path="/bonus-hunts" element={<BonusHunt />} />
                <Route path="/turnuvalar" element={<Turnuvalar />} />
                <Route path="/cark" element={<Cark />} />
                <Route path="/profil/:username" element={<Profil />} />
              </Routes>
            </main>
            <ChatWidget />
          </BrowserRouter>
        </ChatProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
