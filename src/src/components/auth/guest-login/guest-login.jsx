import React from "react";

import style from "./guest-login.module.scss";
import formStyle from "../../../common/style/form.module.scss";
import { useDispatch } from "react-redux";
import { succesGuestAuth } from "../../../store/actions/auth";

const GuestLogin = () => {
  const dispatch = useDispatch();

  const guestLogin = () => dispatch(succesGuestAuth());

  return (
    <div className={style.Wrapper}>
      or
      <div className={formStyle.SecondaryButton} onClick={guestLogin}>
        Try it as a Guest
      </div>
    </div>
  );
};

export default GuestLogin;
