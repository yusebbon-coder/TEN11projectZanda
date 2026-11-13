const USERS_KEY = "users";
const SESSION_KEY = "currentUserEmail";

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const getUsers = () => read(USERS_KEY, []);
const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

export function registerUser({ name, email, password }) {
  const users = getUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return { ok: false, error: "Email already registered." };

  const user = { id: Date.now(), name, email, password, phone: "", address: "" };
  saveUsers([...users, user]);
  return { ok: true };
}

export function loginUser(email, password) {
  const user = getUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) return { ok: false, error: "Invalid email or password." };
  localStorage.setItem(SESSION_KEY, user.email);
  return { ok: true, user };
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  const email = localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  return getUsers().find((u) => u.email === email) || null;
}

export function updateUser(updates) {
  const current = getCurrentUser();
  if (!current) return { ok: false, error: "Not logged in." };
  const users = getUsers().map((u) => (u.id === current.id ? { ...u, ...updates } : u));
  saveUsers(users);
  return { ok: true };
}