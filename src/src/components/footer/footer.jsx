import React from "react";
import { useSelector } from "react-redux";
import { browserShopState } from "../../enums/enums";
import { GetBrowserShopState } from "../../store/selectors/common";

import styles from "./footer.module.scss";

const Footer = () => {
  const _browserShopState = useSelector(GetBrowserShopState);

  return (
    <div
      className={`${styles.Footer} ${
        _browserShopState === browserShopState.READY && styles.slideOut
      }`}
    >
      https://browser-shop.com/
    </div>
  );
};

export default Footer;
