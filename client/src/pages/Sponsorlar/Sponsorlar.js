import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPartnersApi } from '../../api';
import './Sponsorlar.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getSrc = (url) => url?.startsWith('http') ? url : url ? `${API_BASE}${url}` : null;

const Sponsorlar = () => {
  const { data, isLoading } = useQuery({ queryKey: ['partners'], queryFn: getPartnersApi });
  const partners = data?.data?.data || [];

  if (isLoading) return <div className="loading-spinner">Yükleniyor...</div>;

  return (
    <div className="page-container">
      <div className="sponsors-header">
        <h1 className="page-title">Sponsorlarımız</h1>
        <p className="sponsors-subtitle">
          Güvenilir partnerlerimiz aracılığıyla en iyi bonusları ve fırsatları yakalayın.
        </p>
      </div>

      {partners.length === 0 ? (
        <div className="empty-state"><p>Henüz sponsor eklenmemiş.</p></div>
      ) : (
        <div className="sponsors-grid">
          {partners.map((p) => (
            <div key={p.id} className="sponsor-card">
              {/* Üst parlama efekti */}
              <div className="sponsor-card__glow" />

              {/* Logo alanı */}
              <div className="sponsor-card__logo-wrap">
                {getSrc(p.logoUrl) ? (
                  <img
                    src={getSrc(p.logoUrl)}
                    alt={p.name}
                    className="sponsor-card__logo"
                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div className="sponsor-card__logo-fallback" style={{ display: getSrc(p.logoUrl) ? 'none' : 'flex' }}>
                  <span>{p.name.charAt(0)}</span>
                </div>
              </div>

              {/* İçerik */}
              <div className="sponsor-card__body">
                <h3 className="sponsor-card__name">{p.name}</h3>

                {p.bonusInfo && (
                  <div className="sponsor-card__bonus">
                    <span className="sponsor-card__bonus-icon">🎁</span>
                    <span>{p.bonusInfo}</span>
                  </div>
                )}

                {p.description && (
                  <p className="sponsor-card__desc">{p.description}</p>
                )}

                {p.features && p.features.length > 0 && (
                  <div className="sponsor-card__features">
                    {p.features.map((f, i) => (
                      <span key={i} className="sponsor-card__feature-tag">{f}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA */}
              {p.websiteUrl && (
                <a
                  href={p.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sponsor-card__cta"
                >
                  <span>Siteye Git</span>
                  <span className="sponsor-card__cta-arrow">→</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sponsorlar;
