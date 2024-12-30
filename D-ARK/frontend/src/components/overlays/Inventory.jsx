import React, { useState, useEffect } from 'react';

function Inventory() {
  const [selectedBox, setSelectedBox] = useState(0); // Track the selected box (0-8 for 9 boxes)

  let items=[];

  // Handle key presses for selecting inventory boxes
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = parseInt(event.key, 10);
      if (key >= 1 && key <= 9) {
        setSelectedBox(key - 1); // Set selected box (0-indexed)
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      justifyContent: 'space-between',
      width: '80%',
      maxWidth: '600px',
    }}>
      {Array.from({ length: 9 }, (_, index) => (
        <div key={index} style={{
          width: '60px',
          height: '60px',
          border: '2px solid black',
          backgroundColor: selectedBox === index ? 'lightblue' : 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 5px',
        }}>
          {items[index] ? (
            <img src={items[index].image} alt={items[index].name} style={{ width: '40px', height: '40px' }} />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default Inventory;