async function fetchUserInfo() {
  const response = await fetch("/user/info");
  const userInfo = await response.json();
  return {
    id: userInfo.name,
    fullName: userInfo.name,
  };
}

const authProvider = {
  checkAuth: () => Promise.resolve(),
  checkError: () => {
    return fetchUserInfo();
  },
  getIdentity: async () => {
    return fetchUserInfo();
  },
  getPermissions: () => Promise.resolve(""),
};

export default authProvider;
