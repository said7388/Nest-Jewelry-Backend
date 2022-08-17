export const getProfile = (data: any) => {
  const profile = {
    id: data._id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    role: data.role,
  };
  return profile;
};
