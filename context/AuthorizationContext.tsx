import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface AuthorizationContextType {
    user: { email: string; type: string } | null;
    checkPermission: (permission: string) => boolean;
  }
  
const AuthorizationContext = createContext<AuthorizationContextType>({
    user: null,
    checkPermission: () => false, 
});

export const AuthorizationProvider = ({children} :any)=> {
    const token = Cookies.get("auth_token");
    const[user, setUser] = useState<any>(null)
    const[permission, setPermission] = useState<string[]>([])

    const router = useRouter()

    const getUserPermission = () => {
        if (token) {
            const decodedToken = jwtDecode(token)
            setUser({ email : decodedToken.EMAIL, type:  decodedToken.TYPE})
            setPermission(decodedToken.PERMISSION)
        }
    }

    useEffect(() => {
        getUserPermission()
    }, [token])

    const checkPermission = (requestPermission :any) => {
        return permission.some((permission) => permission === requestPermission)        
    }

    return (
        <AuthorizationContext.Provider value={{ user, checkPermission }}>
            {children}
        </AuthorizationContext.Provider>
    )
}

export const useAuthorization = () => {
    return useContext(AuthorizationContext)
}