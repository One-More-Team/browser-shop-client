import React from "react";
import { useSelector } from "react-redux";

import { GetChatUsers } from "../../store/selectors/common";

import styles from "./user-list.module.scss";

const UserList = () => {
  const chatUsers = useSelector(GetChatUsers);

  return (
    <div className={styles.Wrapper}>
      {chatUsers.map((data) => (
        <div key={data.id} className={styles.User}>
          <div>
            <div className={styles.Avatar}>{data.name.charAt(0)}</div>
            {data.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
