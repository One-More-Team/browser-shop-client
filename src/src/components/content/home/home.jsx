import React from "react";
import { useSelector } from "react-redux";
import { GetTestData } from "../../../store/selectors/common";

import styles from "./home.module.scss";

const Home = () => {
  const testData = useSelector(GetTestData);

  return (
    <div className={styles.Container}>
      <div className={styles.Section}>Simple Section {testData}</div>
    </div>
  );
};

export default Home;
