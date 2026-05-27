import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPartnersApi, getWinsApi, getPageApi, getHeroSlidesApi } from '../../api';
import HeroSlider from '../../components/hero/HeroSlider';
import './Home.css';

const Home = () => {
  const { data: slidesRes } = useQuery({ queryKey: ['hero-slides'], queryFn: getHeroSlidesApi });
  const { data: partnersRes } = useQuery({ queryKey: ['partners'], queryFn: getPartnersApi });
  const { data: winsRes } = useQuery({ queryKey: ['wins'], queryFn: getWinsApi });
  const { data: pageRes } = useQuery({
    queryKey: ['page', 'home'],
    queryFn: () => getPageApi('home'),
    retry: false,
  });

  const slides = slidesRes?.data?.data || [];
  const partners = partnersRes?.data?.data || [];
  const wins = winsRes?.data?.data || [];
  const pageContent = pageRes?.data?.data?.content || '';

  return (
    <div>
      {/* ─── Hero Slider ─── */}
      {slides.length > 0 && <HeroSlider slides={slides} />}

      <div className="page-container">

        {/* ─── CMS İçerik ─── */}
        {pageContent && (
          <div
            className="home-cms-content card"
            dangerouslySetInnerHTML={{ __html: pageContent }}
            style={{ marginBottom: 36 }}
          />
        )}

        {/* ─── Partnerler ─── */}
        {partners.length > 0 && (
          <section className="home-section">
            <h2 className="section-title">Partnerlerimiz</h2>
            <div className="partners-grid">
              {partners.map((p) => (
                <a
                  key={p.id}
                  href={p.websiteUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="partner-card"
                >
                  {p.logoUrl && <img src={p.logoUrl} alt={p.name} className="partner-logo" />}
                  <div className="partner-info">
                    <h3>{p.name}</h3>
                    {p.bonusInfo && <p className="partner-bonus">{p.bonusInfo}</p>}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ─── Son Kazananlar ─── */}
        {wins.length > 0 && (
          <section className="home-section">
            <h2 className="section-title">Son Kazananlar</h2>
            <div className="wins-list">
              {wins.slice(0, 10).map((w) => (
                <div key={w.id} className="win-item">
                  <span className="win-username">{w.username}</span>
                  <span className="win-game">{w.gameName}</span>
                  {w.multiplier && (
                    <span className="win-multiplier">{w.multiplier}x</span>
                  )}
                  {w.winAmount && (
                    <span className="win-amount">
                      {Number(w.winAmount).toLocaleString('tr-TR')} {w.currency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {slides.length === 0 && partners.length === 0 && wins.length === 0 && !pageContent && (
          <div className="empty-state">
            <p>🎯 Hoş geldiniz! İçerikler yükleniyor...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
