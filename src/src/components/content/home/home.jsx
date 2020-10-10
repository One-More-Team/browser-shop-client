import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectWS } from "../../../store/actions/common";

import logo from "../../../asset/img/logo_final_transparent.png";

import styles from "./home.module.scss";
import formStyle from "../../../common/style/form.module.scss";
import {
  GetDisplayName,
  GetIsConnectingInProgress,
} from "../../../store/selectors/common";

const Home = () => {
  const [hasDisplayNameError, setHasDisplayNameError] = useState(false);
  const displayNameInput = useRef(null);
  const displayName = useSelector(GetDisplayName);
  const isConnectingInProgress = useSelector(GetIsConnectingInProgress);
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
        <div className={styles.Section}>
          <div className={styles.InputBlock}>
            {isConnectingInProgress ? (
              <div className={styles.ActiveName}>
                Please wait {displayName}, connecting to server...
              </div>
            ) : (
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
              isConnectingInProgress && styles.ConnectingButton
            }`}
            onClick={connectionRequest}
          >
            <img src={logo} alt="Logo" className={styles.Logo} />
            <h2>Enter to Shop</h2>
          </div>
        </div>
        {isConnectingInProgress && <div className={styles.Loader} />}
      </div>
    </>
  );
};

export default Home;
