"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface AuthorizationContextType {
    userLogin: { email: string; type: string } | null;
    permission: string[];
    checkPermission: (permission: string) =>  Promise<boolean>;
}

interface DecodedToken {
    ID: number;
    EMAIL: string;
    TYPE: string;
    PERMISSION: string[];
}

const AuthorizationContext = createContext<AuthorizationContextType>({
    userLogin: null,
    permission: [],
    checkPermission: async () => false,
});

export const AuthorizationProvider = ({ children }: { children: React.ReactNode }) => {
    const token = Cookies.get("auth_token");    
    const [userLogin, setUser] = useState<any>(null);
    const [id, setId] = useState(null);


    const getUserPermission = async() => {        
        if (token) {
            try {
                const decodedToken: DecodedToken = jwtDecode(token) as DecodedToken;                
                setUser({ email: decodedToken.EMAIL, type: decodedToken.TYPE });
                setId(decodedToken.ID)

            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }

    useEffect(() => {
        getUserPermission();
    }, []);

    const checkPermission = async (requestPermission: string): Promise<boolean> => {
        if (!token) {
            return false; // Token tidak tersedia
        }
    
        try {
            const decodedToken: DecodedToken = jwtDecode(token) as DecodedToken;
            const userId = decodedToken.ID;
    
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_PERMISSION_EDIT_URL_API}${userId}`,
                {
                    cache: "no-store",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            const result = await response.json();
    
            if (result.status === 200 && result.message) {
                const permissions = result.data; 
                const hasPermission = permissions.some((p: any) => p.PERMISSION === requestPermission);
    
                return hasPermission;
            }
    
            return false; 
        } catch (error) {
            console.error("Error checking permission:", error);
            return false;
        }
    };

    return (
        <AuthorizationContext.Provider value={{ 
            userLogin, 
            permission: [],
            checkPermission 
        }}>
            {children}
        </AuthorizationContext.Provider>
    )
}

export const useAuthorization = () => {
    const context = useContext(AuthorizationContext);
    if (!context) {
        throw new Error('useAuthorization must be used within an AuthorizationProvider');
    }
    return context;
}