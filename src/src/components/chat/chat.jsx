import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendChatMessage } from "../../store/actions/common";
import styles from "./chat.module.scss";
import {
  GetMyId,
  GetChatMessages,
  GetBrowserShopState,
} from "../../store/selectors/common";
import { browserShopState } from "../../enums/enums";

const Chat = () => {
  const inputField = useRef(null);
  const chatFlowContainer = useRef(null);
  const dispatch = useDispatch();

  const myId = useSelector(GetMyId);

  const chatMessages = useSelector(GetChatMessages);
  const _browserShopState = useSelector(GetBrowserShopState);

  const sendMessageButton = () => {
    dispatch(sendChatMessage(inputField.current.value));
    inputField.current.value = "";
  };

  const sendMessage = (e) => {
    if (e.key === "Enter") {
      sendMessageButton();
    }
  };

  useEffect(() => {
    if (chatFlowContainer.current != null) {
      chatFlowContainer.current.scrollTop =
        chatFlowContainer.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <>
      {_browserShopState === browserShopState.READY && (
        <div className={styles["wrapper-chat"]}>
          <div className={styles["wrapper-header"]}>Browser Shop Chat</div>
          <div className={styles["wrapper-chatflow"]} ref={chatFlowContainer}>
            {chatMessages.map((data) => {
              return data.id === myId ? (
                <div key={data.uid} className={styles["message-own"]}>
                  {data.message}
                </div>
              ) : (
                <div key={data.uid} className={styles["message-income"]}>
                  {data.message}
                </div>
              );
            })}
          </div>
          <div className={styles["wrapper-input"]}>
            <input
              ref={inputField}
              type="text"
              className={styles["msg-input"]}
              placeholder="Enter your message..."
              onKeyDown={sendMessage}
            />
            <button onClick={sendMessageButton}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
