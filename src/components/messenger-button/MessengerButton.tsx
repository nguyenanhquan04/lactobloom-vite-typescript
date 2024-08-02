import React from 'react';

const MessengerButton = () => {
  const handleClick = () => {
    window.location.href = 'https://m.me/380814168446100';
  };

  return (
    <div className="messenger-button" onClick={handleClick}>
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Facebook_Messenger_logo_2020.svg/768px-Facebook_Messenger_logo_2020.svg.png" alt="Messenger" />
    </div>
  );
};

export default MessengerButton;
