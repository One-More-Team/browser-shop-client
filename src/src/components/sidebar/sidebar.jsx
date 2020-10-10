import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { browserShopState } from "../../enums/enums";
import { GetBrowserShopState } from "../../store/selectors/common";

import styles from "./sidebar.module.scss";

const SideBar = () => {
  const location = useLocation();
  const _browserShopState = useSelector(GetBrowserShopState);

  return (
    <div
      className={`${styles.Sidebar} ${
        _browserShopState === browserShopState.READY ? styles.slideOut : ""
      }`}
    >
      <div className={styles.ItemContainer}>
        <Link to="/">
          <div
            className={`${styles.Item} ${
              location.pathname === "/" && styles.SelectedItem
            }`}
          >
            <i className={`${styles.Icon} ${"fas fa-house-user"}`}></i>
            <div className={styles.Label}>Home</div>
          </div>
        </Link>
        <Link to="/account">
          <div
            className={`${styles.Item} ${
              location.pathname === "/account" && styles.SelectedItem
            }`}
          >
            <i className={`${styles.Icon} ${"fas fa-user"}`}></i>
            <div className={styles.Label}>My Account</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
