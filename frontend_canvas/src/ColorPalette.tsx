import React from 'react';

const ColorPalette: React.FC = () => {
  return (
    <div className="color-palette">
      <div className="color-swatch" style={{ backgroundColor: 'black' }} />
      <div className="color-swatch" style={{ backgroundColor: 'red' }} />
      <div className="color-swatch" style={{ backgroundColor: 'blue' }} />
      <div className="color-swatch" style={{ backgroundColor: 'green' }} />
    </div>
  );
};

export default ColorPalette;
