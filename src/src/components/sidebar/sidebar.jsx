import React from "react";
import { Link, useLocation } from "react-router-dom";

import styles from "./sidebar.module.scss";

const SideBar = () => {
  const location = useLocation();

  return (
    <div className={styles.Sidebar}>
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
        <Link to="/sample">
          <div
            className={`${styles.Item} ${
              location.pathname === "/sample" && styles.SelectedItem
            }`}
          >
            <i className={`${styles.Icon} ${"fas fa-spell-check"}`}></i>
            <div className={styles.Label}>Sample</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
