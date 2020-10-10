import React from "react";
import { useSelector } from "react-redux";
import { connectionState } from "../../enums/enums";
import { GetConnectionStatus } from "../../store/selectors/common";

import styles from "./footer.module.scss";

const Footer = () => {
  const connectionStatus = useSelector(GetConnectionStatus);

  const connected = connectionStatus === connectionState.CONNECTION_CONNECTED;

  return (
    <div className={`${styles.Footer} ${connected ? styles.slideOut : ""}`}>
      https://browser-shop.com/
    </div>
  );
};

export default Footer;
