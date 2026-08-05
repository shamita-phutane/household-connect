import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function getStoredUser() {
    const token = localStorage.getItem("token");

    if (!token) return null;

    return {
        token,
        role: localStorage.getItem("role"),
        userId: localStorage.getItem("userId"),
        name: localStorage.getItem("name"),
        email: localStorage.getItem("email"),
    };
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getStoredUser);

    const login = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", data.email);

        setUser(data);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}