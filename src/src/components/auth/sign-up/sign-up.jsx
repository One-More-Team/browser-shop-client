import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { auth } from "../../../firebase";

import authStyles from "../auth.module.scss";
import formStyle from "../../../common/style/form.module.scss";
import GuestLogin from "../guest-login/guest-login";

const SignUp = ({ toggleAuthType }) => {
  const { register, handleSubmit, errors } = useForm();
  const [serverError, setServerError] = useState();

  const hasEmailError = serverError?.code === "auth/email-already-in-use";
  const clearEmailError = () => hasEmailError && setServerError(null);

  const hasPasswordError = serverError?.code === "auth/weak-password";
  const clearPasswordError = () => hasPasswordError && setServerError(null);

  const onSignUp = async ({ email, password }) => {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      console.log("SUCCESS", user);
      //generateUserDocument(user, { displayName });
    } catch (error) {
      setServerError(error);
    }
  };

  return (
    <div className={authStyles.Wrapper}>
      <form className={authStyles.Form} onSubmit={handleSubmit(onSignUp)}>
        <h1>Create a new user</h1>
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
        <input className={formStyle.Button} type="submit" value="Sign up" />
        or
        <div className={formStyle.SecondaryButton} onClick={toggleAuthType}>
          Sign in
        </div>
      </form>
      <GuestLogin />
    </div>
  );
};

export default SignUp;
