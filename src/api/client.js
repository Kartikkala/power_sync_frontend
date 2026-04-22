import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

/**
 * Decode the JWT payload from the 'jwt' cookie.
 * Returns null if the cookie is missing or malformed.
 */
export function parseJwtFromCookie() {
  try {
    const match = document.cookie.split('; ').find(row => row.startsWith('jwt='));
    if (!match) return null;
    const token = match.split('=')[1];
    const payload = JSON.parse(atob(token.split('.')[1]));

    // JWT stores roles as: roles: ["ROLE_TENANT"] or roles: ["ROLE_LANDLORD"]
    let role = '';
    if (Array.isArray(payload.roles) && payload.roles.length > 0) {
      role = payload.roles[0].replace(/^ROLE_/i, '').toLowerCase();
    } else if (payload.role) {
      role = payload.role.replace(/^ROLE_/i, '').toLowerCase();
    }

    return {
      email: payload.sub || payload.email,
      role,
      fullname: payload.fullname || payload.name || payload.sub,
    };
  } catch {
    return null;
  }
}

export default apiClient;
