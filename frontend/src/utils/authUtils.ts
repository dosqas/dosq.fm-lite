/**
 * Checks if the user is logged in by verifying the presence of a token in localStorage.
 * @returns {boolean} True if the user is logged in, false otherwise.
 */
export const isLoggedIn = (): boolean => {
    const token = localStorage.getItem("token");
    return !!token; // Returns true if a token exists, false otherwise
  };
  
  /**
   * Stores the authentication token in localStorage.
   * @param {string} token - The authentication token to store.
   */
  export const setToken = (token: string): void => {
    localStorage.setItem("token", token);
  };
  
  /**
   * Clears the authentication token from localStorage.
   */
  export const clearToken = (): void => {
    localStorage.removeItem("token");
  };