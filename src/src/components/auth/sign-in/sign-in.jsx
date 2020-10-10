import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { auth } from "../../../firebase";

import authStyles from "../auth.module.scss";
import formStyle from "../../../common/style/form.module.scss";
import { useDispatch } from "react-redux";
import { succesfulAuth } from "../../../store/actions/auth";

import logo from "../../../asset/img/logo_final_transparent.png";

const SignIn = ({ toggleAuthType }) => {
  const { register, handleSubmit, errors } = useForm();
  const [serverError, setServerError] = useState();
  const dispatch = useDispatch();

  const hasEmailError = serverError?.code === "auth/user-not-found";
  const clearEmailError = () => hasEmailError && setServerError(null);

  const hasPasswordError = serverError?.code === "auth/wrong-password";
  const clearPasswordError = () => hasPasswordError && setServerError(null);

  const onSignIn = async ({ email, password }) => {
    try {
      const { user } = await auth.signInWithEmailAndPassword(email, password);
      console.log("SUCCESS", user);
      dispatch(succesfulAuth(user));
      //generateUserDocument(user, { displayName });
    } catch (error) {
      console.log("SUCCESS", error);
      setServerError(error);
    }
  };

  return (
    <div className={authStyles.Wrapper}>
      <form className={authStyles.Form} onSubmit={handleSubmit(onSignIn)}>
        <img src={logo} alt="Logo" className={authStyles.Logo} />
        <div className={authStyles.InputBlock}>
          <input
            className={formStyle.Input}
            name="email"
            placeholder="Your e-mail address"
            type="email"
            ref={register({ required: true })}
            onFocus={clearEmailError}
          />
          {(errors.email || hasEmailError) && (
            <span className={formStyle.InputError}>
              {serverError?.message || "This field is required"}
            </span>
          )}
          <i className={`fas fa-at ${authStyles.InputIcon}`}></i>
        </div>
        <div className={authStyles.InputBlock}>
          <input
            className={formStyle.Input}
            name="password"
            autoComplete="webapp-password"
            placeholder="Your password"
            type="password"
            ref={register({ required: true })}
            onFocus={clearPasswordError}
          />
          {(errors.password || hasPasswordError) && (
            <span className={formStyle.InputError}>
              {serverError?.message || "This field is required"}
            </span>
          )}
          <i className={`fas fa-key ${authStyles.InputIcon}`}></i>
        </div>
        <input className={formStyle.Button} type="submit" value="Sign in" />
        or
        <div className={formStyle.SecondaryButton} onClick={toggleAuthType}>
          Sign up
        </div>
      </form>
    </div>
  );
};

export default SignIn;
