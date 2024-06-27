async function fetchUserInfo() {
  const response = await fetch("/oauth2/userinfo");
  const userInfo = await response.json();
  return userInfo;
}

async function fetchAuth() {
  const response = await fetch("/oauth2/auth");
  if (response.status === 401 || response.status === 403) {
    throw new Error("Unauthorized");
  }
}

const authProvider = {
  checkAuth: () => fetchAuth(),
  checkError: () => fetchAuth(),
  getIdentity: () => fetchUserInfo(),
  getPermissions: () => Promise.resolve(""),
};

export default authProvider;
