import React from 'react';
import { AVATAR_CATEGORIES, AVATAR_PER_CATEGORY } from '../../constants';
import './Auth.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AvatarPicker = ({ selected, onSelect }) => {
  const avatars = [];
  for (let cat = 1; cat <= AVATAR_CATEGORIES; cat++) {
    for (let num = 1; num <= AVATAR_PER_CATEGORY; num++) {
      avatars.push({ cat, num });
    }
  }

  return (
    <div className="avatar-picker">
      <p className="avatar-picker__label">Avatar Seç</p>
      <div className="avatar-picker__grid">
        {avatars.map(({ cat, num }) => {
          const isSelected = selected?.cat === cat && selected?.num === num;
          return (
            <button
              key={`${cat}-${num}`}
              type="button"
              className={`avatar-picker__item ${isSelected ? 'avatar-picker__item--selected' : ''}`}
              onClick={() => onSelect({ cat, num })}
            >
              <img
                src={`${API_URL}/uploads/avatars/${cat}/${num}.jpg`}
                alt={`avatar-${cat}-${num}`}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?background=random&name=${num}&size=48`;
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarPicker;
