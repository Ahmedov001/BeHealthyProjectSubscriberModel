export const isAuthenticated = () => {
    return !!sessionStorage.getItem("token");
};

export const getUserRole = () => {
    return sessionStorage.getItem("role")?.toLowerCase();
};
