import { createContext, useContext, useState, type ReactNode } from "react";

interface ContextValues {
    authToken: string | null;
    login: (token: string, expires:string ) => void;
    logout: () => void;
    checkAuth: () => boolean;
}

interface IProps {
    children: ReactNode;
}

const AuthContext = createContext({} as ContextValues);

export const AuthProvider: React.FC<IProps> = ({children}) => {
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('auth_token'));
    const [tokenExpire, setTokenExpire] = useState(() => localStorage.getItem('token_expire'));


    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem('auth_token');
    }

    const login = (newToken: string, expires: string) => {
        setAuthToken(newToken);
        setTokenExpire(expires)
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('token_expire', expires);
    }

    const checkAuth = () => {
        if (!authToken || !tokenExpire) {
            return false;
        }

        if (+tokenExpire < Math.floor(Date.now() / 1000)) {
            return false;
        }

        return true;
    }

    return (
        <AuthContext.Provider value={{authToken, login, logout, checkAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);