import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function Inventory() {
  const [selectedBox, setSelectedBox] = useState(0); // Track the selected box (0-8 for 9 boxes)

  let data=useSelector(state=>state.user);
  const [items,setItems]=useState([]);

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

  useEffect(()=>{
    setItems(data ? data.items:[]);
  },[data])

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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 5px',
          filter: selectedBox===index?'brightness(50%)':''
        }}>
          {items[index] ? (
            <img src={items[index].url} alt={items[index].name} style={{ width: '40px', height: '40px' }} />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default Inventory;