export const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
};

export const isAdmin = () => {
    return localStorage.getItem("role") === "ADMIN";
};