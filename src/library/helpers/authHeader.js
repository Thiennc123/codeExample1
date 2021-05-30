export function authHeader() {
  return { 
    Authorization: 'Bearer ' + localStorage.getItem('id_token') || undefined,
    "Content-Type": "application/json",
    Accept: 'application/json',
  };
}
