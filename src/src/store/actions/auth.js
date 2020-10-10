export const SUCCESFUL_AUTH = "SUCCESFUL_AUTH";
export const GUEST_AUTH = "GUEST_AUTH";

export const succesfulAuth = (user) => {
  return { type: SUCCESFUL_AUTH, user };
};

export const succesGuestAuth = () => {
  return { type: GUEST_AUTH };
};
