import React, { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { data: session, isPending, error } = authClient.useSession();

    return (
        <AuthContext.Provider value={{ session, isPending, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
