export const BASE: { URL: string } = { URL: null };

export const setBaseUrl = address => (BASE.URL = address ? `http://${address}:8083` : null);
