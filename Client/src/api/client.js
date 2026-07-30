// Thin wrapper around fetch that always sends cookies, always attaches
// JSON headers when a body is present, and normalizes error handling so
// every caller doesn't have to repeat the same response.ok/try-catch dance.
const request = async (url, options = {}) => {
  const hasBody = options.body !== undefined;

  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || "Request failed");
  }

  return data;
};

export default request;
