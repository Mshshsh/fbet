import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './HeroSlider.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const INTERVAL_MS = 5000;

const HeroSlider = ({ slides = [] }) => {
  const [current, setCurrent] = useState(0);

  // Ref ile her zaman güncel index'i tut —
  // interval callback'i state'e bağımlı olmadan doğru slayta geçer
  const currentRef = useRef(0);
  const intervalRef = useRef(null);
  const totalRef = useRef(slides.length);

  // slides değişince totalRef'i güncelle
  useEffect(() => { totalRef.current = slides.length; }, [slides.length]);

  const goTo = useCallback((index) => {
    if (totalRef.current < 2) return;
    const idx = ((index % totalRef.current) + totalRef.current) % totalRef.current;
    currentRef.current = idx;
    setCurrent(idx);
  }, []);

  const next = useCallback(() => goTo(currentRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(currentRef.current - 1), [goTo]);

  // Timer — sadece slides.length değişince yeniden kurulur,
  // her slayt geçişinde sıfırlanmaz
  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (totalRef.current > 1) {
      intervalRef.current = setInterval(() => {
        goTo(currentRef.current + 1);
      }, INTERVAL_MS);
    }
  }, [goTo]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current);
  }, [startTimer, slides.length]);

  const pause  = () => clearInterval(intervalRef.current);
  const resume = () => startTimer();

  if (!slides.length) return null;

  const slide = slides[current];
  const getSrc = (url) => url?.startsWith('http') ? url : `${API_BASE}${url}`;

  return (
    <div className="hero-slider" onMouseEnter={pause} onMouseLeave={resume}>

      {/* ── Arkaplan slaytları ── */}
      <div className="hero-slider__track">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`hero-slide ${i === current ? 'hero-slide--active' : ''}`}
            style={{ backgroundImage: `url(${getSrc(s.imageUrl)})` }}
          />
        ))}
      </div>

      {/* ── Karanlık overlay ── */}
      <div className="hero-slider__overlay" />

      {/* ── İçerik ── */}
      <div className="hero-slider__content">
        {slide.title && <h1 className="hero-slider__title">{slide.title}</h1>}
        {slide.subtitle && <p className="hero-slider__subtitle">{slide.subtitle}</p>}
        {slide.buttonText && (
          slide.buttonLink?.startsWith('http') ? (
            <a href={slide.buttonLink} target="_blank" rel="noopener noreferrer" className="hero-slider__btn">
              {slide.buttonText}
            </a>
          ) : (
            <Link to={slide.buttonLink || '/'} className="hero-slider__btn">
              {slide.buttonText}
            </Link>
          )
        )}
      </div>

      {/* ── Ok butonları ── */}
      {slides.length > 1 && (
        <>
          <button className="hero-slider__arrow hero-slider__arrow--prev" onClick={prev} aria-label="Önceki">‹</button>
          <button className="hero-slider__arrow hero-slider__arrow--next" onClick={next} aria-label="Sonraki">›</button>
        </>
      )}

      {/* ── Dot göstergeler ── */}
      {slides.length > 1 && (
        <div className="hero-slider__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === current ? 'hero-dot--active' : ''}`}
              onClick={() => { goTo(i); startTimer(); }}
              aria-label={`Slayt ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlider;
