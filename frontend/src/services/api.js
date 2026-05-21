export const API_BASE = "http://localhost:5000/api";

const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const headers = {
    "Content-Type": "application/json",
  };
  if (user?.token) {
    headers["Authorization"] = `Bearer ${user.token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    throw new Error(data.message || "An error occurred");
  }
  return data;
};

export const apiGet = async (url) => {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: getHeaders(),
  });
  return handleResponse(response);
};

export const apiPost = async (url, body) => {
  const response = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(response);
};

export const apiPut = async (url, body) => {
  const response = await fetch(`${API_BASE}${url}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(response);
};

export const apiDelete = async (url) => {
  const response = await fetch(`${API_BASE}${url}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(response);
};
