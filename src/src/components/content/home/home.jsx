import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectWS } from "../../../store/actions/common";
import { GetTestData } from "../../../store/selectors/common";

import styles from "./home.module.scss";

const Home = () => {
  const testData = useSelector(GetTestData);
  const dispatch = useDispatch();

  const testConnection = () => {
    dispatch(connectWS());
  };

  return (
    <div className={styles.Container}>
      <div className={styles.Section}>
        Simple Section
        {testData}
      </div>
      <div role="button" onClick={testConnection}>
        Test Connection
      </div>
    </div>
  );
};

export default Home;
