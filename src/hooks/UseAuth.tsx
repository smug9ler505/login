import { createContext, useContext, useState, type ReactNode } from "react";

interface ContextValues {
    authToken: string | null;
    login: (token: string) => void;
    logout: () => void;
}

interface IProps {
    children: ReactNode;
}

const AuthContext = createContext({} as ContextValues);

export const AuthProvider: React.FC<IProps> = ({children}) => {
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('auth_token'));

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem('auth_token');
    }

    const login = (newToken: string) => {
        setAuthToken(newToken);
        localStorage.setItem('auth_token', newToken)
    }

    return (
        <AuthContext.Provider value={{authToken, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);