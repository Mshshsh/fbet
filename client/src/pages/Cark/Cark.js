import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Cark.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Segmentler artık API'den geliyor — bu sadece yükleme sırasında fallback
const DEFAULT_SEGMENTS = [
  { label: '10',  points: 10,  color: '#2a2008', textColor: '#c9a84c' },
  { label: '100', points: 100, color: '#5a3d10', textColor: '#ffd700' },
  { label: '25',  points: 25,  color: '#1e1608', textColor: '#c9a84c' },
  { label: '500', points: 500, color: '#8a6820', textColor: '#080808' },
  { label: '10',  points: 10,  color: '#2a2008', textColor: '#c9a84c' },
  { label: '50',  points: 50,  color: '#3d2d0e', textColor: '#e8c567' },
  { label: '25',  points: 25,  color: '#1e1608', textColor: '#c9a84c' },
  { label: '200', points: 200, color: '#c9a84c', textColor: '#080808' },
];

function drawWheel(canvas, rotation, segments) {
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  ctx.clearRect(0, 0, size, size);

  const segAngle = 360 / segments.length;
  segments.forEach((seg, i) => {
    const startAngle = ((i * segAngle - 90 + rotation) * Math.PI) / 180;
    const endAngle = (((i + 1) * segAngle - 90 + rotation) * Math.PI) / 180;

    // Dilim
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    ctx.strokeStyle = '#c9a84c';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Metin
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + (segAngle * Math.PI) / 180 / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = seg.textColor;
    ctx.font = `bold ${size * 0.055}px "Segoe UI", sans-serif`;
    ctx.fillText(seg.label, r - 12, 5);
    ctx.font = `${size * 0.03}px "Segoe UI", sans-serif`;
    ctx.fillStyle = seg.textColor + 'bb';
    ctx.fillText('PUAN', r - 12, size * 0.055 + 6);
    ctx.restore();
  });

  // Merkez daire
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = '#080808';
  ctx.fill();
  ctx.strokeStyle = '#c9a84c';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Merkez logo metni
  ctx.fillStyle = '#c9a84c';
  ctx.font = `bold ${size * 0.04}px "Segoe UI", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('JB', cx, cy);
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 4);
}

export default function Cark() {
  const { user, token, setUser } = useAuth();
  const canvasRef = useRef(null);
  const rotRef = useRef(0);
  const rafRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState(420);

  // Responsive canvas size
  useEffect(() => {
    const update = () => {
      const size = Math.min(420, window.innerWidth - 48);
      setCanvasSize(size);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const [status, setStatus] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [codeMsg, setCodeMsg] = useState(null);
  const [codeLoading, setCodeLoading] = useState(false);

  // Countdown state
  const [countdown, setCountdown] = useState('');

  const segmentsRef = useRef(DEFAULT_SEGMENTS);

  const draw = useCallback(() => {
    if (canvasRef.current) drawWheel(canvasRef.current, rotRef.current, segmentsRef.current);
  }, []);

  useEffect(() => {
    draw();
  }, [draw, canvasSize]);

  useEffect(() => {
    if (!user || !token) {
      // Giriş yoksa varsayılan çarkı göster
      drawWheel(canvasRef.current, 0, DEFAULT_SEGMENTS);
      return;
    }
    fetch(`${API_BASE}/api/wheel/status`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setStatus(d.data);
          if (d.data.segments?.length) {
            segmentsRef.current = d.data.segments;
            draw();
          }
        }
      });
  }, [user, token, draw]);

  // Countdown timer
  useEffect(() => {
    if (!status?.nextSpin) return;
    const tick = () => {
      const diff = new Date(status.nextSpin) - new Date();
      if (diff <= 0) { setCountdown(''); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${h}s ${m}d ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [status?.nextSpin]);

  const handleSpin = async () => {
    if (!user) { setError('Çark çevirmek için giriş yapmalısınız.'); return; }
    if (spinning) return;

    setError('');
    setResult(null);
    setSpinning(true);

    try {
      const res = await fetch(`${API_BASE}/api/wheel/spin`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Hata oluştu.');
        if (data.data?.nextSpin) setStatus(s => ({ ...s, canSpin: false, nextSpin: data.data.nextSpin }));
        setSpinning(false);
        return;
      }

      const { segmentIndex, reward, nextSpin, totalPoints } = data.data;

      const segCount = segmentsRef.current.length;
      const segAngle = 360 / segCount;
      const targetAngle = -(segmentIndex * segAngle + segAngle / 2);
      const currentRot = rotRef.current % 360;
      const totalRotation = 360 * 8 + targetAngle - currentRot;

      const duration = 5000;
      const startRot = rotRef.current;
      const startTime = performance.now();

      const animate = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        rotRef.current = startRot + totalRotation * easeOut(t);
        draw();

        if (t < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setSpinning(false);
          setResult({ reward, segmentIndex });
          setStatus(s => ({ ...s, canSpin: false, nextSpin }));
          if (setUser) setUser(u => ({ ...u, points: totalPoints }));
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    } catch {
      setError('Sunucuya ulaşılamadı.');
      setSpinning(false);
    }
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setCodeLoading(true);
    setCodeMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/point-codes/redeem`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.success) {
        setCodeMsg({ type: 'success', text: `+${data.data.reward} puan kazandınız! Toplam: ${data.data.totalPoints}` });
        setCode('');
        if (setUser) setUser(u => ({ ...u, points: data.data.totalPoints }));
      } else {
        setCodeMsg({ type: 'error', text: data.error });
      }
    } catch {
      setCodeMsg({ type: 'error', text: 'Sunucuya ulaşılamadı.' });
    } finally {
      setCodeLoading(false);
    }
  };

  return (
    <div className="cark-page page-container">
      <div className="page-header-bar">
        <h1 className="page-title-text">Şans Çarkı</h1>
        <p className="page-subtitle">Her gün bir kez çevir, puan kazan!</p>
      </div>

      <div className="cark-layout">
        {/* Sol: Çark */}
        <div className="cark-wheel-section">
          <div className="cark-wheel-wrap">
            {/* Pointer */}
            <div className="cark-pointer" />
            <canvas ref={canvasRef} width={canvasSize} height={canvasSize} className="cark-canvas" />
          </div>

          {error && <div className="cark-alert cark-alert--error">{error}</div>}
          {result && (
            <div className="cark-result">
              <span className="cark-result__label">Tebrikler!</span>
              <span className="cark-result__value">+{result.reward} Puan</span>
            </div>
          )}

          <button
            className={`cark-btn ${spinning ? 'cark-btn--spinning' : ''} ${!status?.canSpin && !spinning ? 'cark-btn--disabled' : ''}`}
            onClick={handleSpin}
            disabled={spinning || (status && !status.canSpin)}
          >
            {spinning ? 'Çevriliyor...' : status?.canSpin === false ? 'Çark Çevrildi' : 'Çark Çevir'}
          </button>

          {!status?.canSpin && countdown && (
            <p className="cark-countdown">Sonraki çeviri: <strong>{countdown}</strong></p>
          )}

          {user && (
            <div className="cark-points-display">
              <span>Toplam Puanın</span>
              <strong>{user.points ?? 0}</strong>
            </div>
          )}
        </div>

        {/* Sağ: Bilgi + Kod */}
        <div className="cark-info-section">
          <div className="cark-info-card">
            <h3>Ödüller</h3>
            <div className="cark-prizes">
              {(status?.segments || DEFAULT_SEGMENTS)
                .filter((s, i, arr) => arr.findIndex(x => x.points === s.points) === i)
                .sort((a, b) => a.points - b.points)
                .map(seg => (
                  <div key={seg.points} className="cark-prize-row">
                    <span className="cark-prize-dot" style={{ background: seg.color, border: `1px solid ${seg.textColor}` }} />
                    <span>{seg.points} Puan</span>
                  </div>
                ))}
            </div>
            <p className="cark-info-note">Her gün 00:00'da yeni hakkın açılır.</p>
          </div>

          {user && (
            <div className="cark-code-card">
              <h3>Puan Kodu Kullan</h3>
              <p>Sana verilen kodu girerek puan kazan.</p>
              <form onSubmit={handleRedeem} className="cark-code-form">
                <input
                  type="text"
                  placeholder="KODU GİR"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  maxLength={32}
                />
                <button type="submit" disabled={codeLoading}>
                  {codeLoading ? '...' : 'Kullan'}
                </button>
              </form>
              {codeMsg && (
                <div className={`cark-code-msg cark-code-msg--${codeMsg.type}`}>
                  {codeMsg.text}
                </div>
              )}
            </div>
          )}

          {!user && (
            <div className="cark-login-prompt">
              Çark çevirmek ve puan kazanmak için <strong>giriş yapın</strong>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
