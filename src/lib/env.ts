export const environment = {
  API_URL: import.meta.env.VITE_PUBLIC_API_URL as string,
  SOCKET_URL: import.meta.env.VITE_PUBLIC_SOCKET_URL as string,
  CRAZYGAMES_AUTH_URL:
    (import.meta.env.VITE_PUBLIC_CRAZYGAMES_AUTH_URL as string | undefined) ||
    `${import.meta.env.VITE_PUBLIC_API_URL as string}/auth/crazygames`,
};
