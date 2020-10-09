export const SUCCESFUL_AUTH = "SUCCESFUL_AUTH";

export const succesfulAuth = (user) => {
  return { type: SUCCESFUL_AUTH, user };
};
