import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectWS } from "../../../store/actions/common";

import logo from "../../../asset/img/logo_final_transparent.png";

import styles from "./home.module.scss";
import formStyle from "../../../common/style/form.module.scss";
import {
  GetConnectionStatus,
  GetDisplayName,
} from "../../../store/selectors/common";
import { connectionState } from "../../../enums/enums";

const Home = () => {
  const [hasDisplayNameError, setHasDisplayNameError] = useState(false);
  const displayNameInput = useRef(null);
  const displayName = useSelector(GetDisplayName);
  const connectionStatus = useSelector(GetConnectionStatus);
  const dispatch = useDispatch();

  const connectionRequest = () => {
    const requestedDisplayName = displayNameInput.current.value.trim();
    if (requestedDisplayName === "") {
      setHasDisplayNameError(true);
    } else dispatch(connectWS(requestedDisplayName));
  };

  const clearDisplayNameError = () => {
    setHasDisplayNameError(false);
  };

  return (
    <>
      <div className={styles.Container}>
        {connectionStatus != connectionState.CONNECTION_CONNECTED && (
          <>
            <div className={styles.Section}>
              <div className={styles.InputBlock}>
                {connectionStatus === connectionState.CONNECTION_CONNECTING && (
                  <div className={styles.ActiveName}>
                    Please wait {displayName}, connecting to server...
                  </div>
                )}
                {connectionStatus === connectionState.CONNECTION_INITIAL && (
                  <div className={styles.InputContainer}>
                    <input
                      className={formStyle.Input}
                      name="displayName"
                      placeholder="Your display name"
                      type="text"
                      ref={displayNameInput}
                      onFocus={clearDisplayNameError}
                    />
                    {hasDisplayNameError && (
                      <span className={formStyle.InputError}>
                        This field is required
                      </span>
                    )}
                    <i className={`fas fa-user ${styles.InputIcon}`}></i>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.Section}>
              <div
                className={`${styles.EnterButton} ${
                  connectionStatus === connectionState.CONNECTION_CONNECTING &&
                  styles.ConnectingButton
                }`}
                onClick={connectionRequest}
              >
                <img src={logo} alt="Logo" className={styles.Logo} />
                <h2>Enter to Shop</h2>
              </div>
            </div>
            {connectionStatus === connectionState.CONNECTION_CONNECTING && (
              <div className={styles.Loader} />
            )}
          </>
        )}
        {connectionStatus === connectionState.CONNECTION_CONNECTED && (
          <>CONNECTED</>
        )}
      </div>
    </>
  );
};

export default Home;
