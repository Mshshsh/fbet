import React from 'react';

const GAMES = [
  { name: 'Dice', emoji: '🎲', description: 'Zar at, kazanmayı dene!', color: '#ef4444' },
  { name: 'Limbo', emoji: '📈', description: 'Ne kadar yükseğe çıkabilirsin?', color: '#f59e0b' },
  { name: 'Mines', emoji: '💣', description: 'Mayınlardan kaçınarak yolunu bul!', color: '#3b82f6' },
  { name: 'Plinko', emoji: '🎯', description: 'Topu bırak ve kazancını izle!', color: '#10b981' },
  { name: 'Blackjack', emoji: '🃏', description: '21\'e ulaş, bankeri yen!', color: '#00e257' },
  { name: 'Wheel', emoji: '🎡', description: 'Çarkı döndür, ödülü kap!', color: '#8b5cf6' },
];

const Oyunlar = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">Oyunlar</h1>
      <div className="grid-3">
        {GAMES.map((game) => (
          <div
            key={game.name}
            className="card"
            style={{
              display: 'flex', alignItems: 'center', gap: 16,
              borderColor: `${game.color}33`, cursor: 'pointer',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = game.color;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${game.color}33`;
              e.currentTarget.style.transform = '';
            }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 12,
              background: `${game.color}22`, display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0,
            }}>
              {game.emoji}
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: game.color }}>{game.name}</h3>
              <p style={{ fontSize: 12, color: '#8a8fa8', marginTop: 4 }}>{game.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Oyunlar;
