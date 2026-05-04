import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth"
import type { ReactNode } from "react";

interface IProps {
    children: ReactNode;
}

export const ProtectedRoute: React.FC<IProps> = ({children}) => {
    const {checkAuth} = useAuth();

    if (!checkAuth()) {
        return <Navigate to={'login'} replace />
    }

    return children;
}