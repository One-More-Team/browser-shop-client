import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendChatMessage } from "../../store/actions/common";
import styles from "./chat.module.scss";
import { GetMyId, GetChatMessages } from "../../store/selectors/common";

const Chat = () => {
  const [isOpened, setIsOpened] = useState(false);
  const inputField = useRef(null);
  const chatFlowContainer = useRef(null);
  const dispatch = useDispatch();

  const myId = useSelector(GetMyId);

  const chatMessages = useSelector(GetChatMessages);

  const sendMessage = (e) => {
    if (e.key === "Enter") {
      const message = inputField.current.value.trim();
      if (message !== "") dispatch(sendChatMessage(message));
      inputField.current.value = "";
    }
  };

  useEffect(() => {
    if (chatFlowContainer.current !== null) {
      chatFlowContainer.current.scrollTop =
        chatFlowContainer.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    document.onkeypress = (e) => {
      if (e.key === "Enter") {
        setIsOpened((prev) => !prev);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpened) inputField.current.focus();
  }, [isOpened]);

  return (
    <>
      <div className={styles["wrapper-chat"]}>
        <div
          className={`${styles.WrapperBack} ${
            isOpened && styles.ShowWrapperBack
          }`}
        ></div>
        <div className={styles["wrapper-chatflow"]} ref={chatFlowContainer}>
          {chatMessages.map((data) => {
            return data.id === myId ? (
              <div key={data.uid} className={styles["message-own"]}>
                {data.message}
              </div>
            ) : (
              <div key={data.uid} className={styles["message-income"]}>
                <div className={styles.Name}>{data.name}</div>
                {data.message}
              </div>
            );
          })}
        </div>
        {isOpened && (
          <div className={styles["wrapper-input"]}>
            <input
              ref={inputField}
              type="text"
              className={styles["msg-input"]}
              placeholder="Enter your message..."
              onKeyDown={sendMessage}
              autoFocus
            />
            <div className={styles.Info}>Press enter to send a message</div>
          </div>
        )}
        {!isOpened && (
          <div className={styles.StandaloneInfo}>
            Press enter to send a message
          </div>
        )}
      </div>
    </>
  );
};

export default Chat;
