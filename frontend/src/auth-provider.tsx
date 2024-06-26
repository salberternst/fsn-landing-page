async function fetchUserInfo() {
  const response = await fetch("/user/info");
  const userInfo = await response.json();
  return {
    id: userInfo.name,
    fullName: userInfo.name,
  };
}

async function fetchAuth() {
  const response = await fetch("/user/auth");
  const auth = await response.json();
  return auth;
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
