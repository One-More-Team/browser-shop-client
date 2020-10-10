import React, { useRef } from 'react';
import styles from './chat.module.scss';

const Chat = () => {
  const inputField = useRef(null);

  const sendMessageButton = () => {
    console.log(inputField.current.value);
    inputField.current.value = '';
  };

  const sendMessage = (e) => {
    if (e.key === 'Enter') {
      console.log(e.target.value);
      e.target.value = '';
    }
  };

  return (
    <div className={styles['wrapper-chat']}>
      <div className={styles['wrapper-header']}>
        Browser Shop Chat
      </div>
      <div className={styles['wrapper-chatflow']}>
        <div className={styles['message-income']}>
          Hi, did anyone bought the Dell Inspiron? Is it worth it?
        </div>
        <div className={styles['message-own']}>
          Hi, sure best deal here!
        </div>
      </div>
      <div className={styles['wrapper-input']}>
        <input ref={inputField} type="text" className={styles['msg-input']} placeholder="Enter your message..." onKeyDown={sendMessage} />
        <button onClick={sendMessageButton}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
