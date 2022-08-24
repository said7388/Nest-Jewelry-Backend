export const getProfile = (data: any) => {
  const profile = {
    id: data._id,
    fullName: data.fullName,
    email: data.email,
    role: data.role,
  };
  return profile;
};
