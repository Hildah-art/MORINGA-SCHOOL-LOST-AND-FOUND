// api.js
const BASE_URL = "http://127.0.0.1:5000/api";

let token = localStorage.getItem("access_token");

function setToken(newToken) {
  token = newToken;
  localStorage.setItem("access_token", newToken);
}

function getHeaders(isJson = true) {
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function request(method, endpoint, data = null, isJson = true) {
  const options = {
    method,
    headers: getHeaders(isJson),
  };

  if (data) {
    options.body = isJson ? JSON.stringify(data) : data;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export const api = {
  setToken,

  registerUser: (data) => request("POST", "/auth/register", data),
  login: async (credentials) => {
    const res = await request("POST", "/auth/login", credentials);
    setToken(res.access_token);
    return res;
  },
  getProfile: () => request("GET", "/auth/profile"),

  getAllUsers: () => request("GET", "/auth/users"),

  getLostItems: () => request("GET", "/lost"),
  getSingleLostItem: (id) => request("GET", `/lost/${id}`),

  reportLostItem: (formData) => {
    return fetch(`${BASE_URL}/lost`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(async (res) => {
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    });
  },

  reportFoundItem: (data) => request("POST", "/found", data),
  getFoundItems: () => request("GET", "/found"),

  ping: () => request("GET", "/test"),
};
