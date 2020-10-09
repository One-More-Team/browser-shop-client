import React, { useState } from "react";
import SignIn from "./sign-in/sign-in";
import SignUp from "./sign-up/sign-up";

const Auth = () => {
  const [isSignInState, setIsSignInState] = useState(true);
  const toggleAuthType = () => setIsSignInState((prev) => !prev);

  return isSignInState ? (
    <SignIn toggleAuthType={toggleAuthType} />
  ) : (
    <SignUp toggleAuthType={toggleAuthType} />
  );
};

export default Auth;
