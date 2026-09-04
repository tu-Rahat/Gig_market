/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { getProfile, logoutUser } from "./authAPI";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {


    const [user, setUser] = useState(() => {

        const savedUser = localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;

    });



    const [token, setToken] = useState(Boolean(user));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProfile()
            .then((data) => {
                setUser(data.user);
                setToken(true);
                localStorage.setItem("user", JSON.stringify(data.user));
            })
            .catch(() => {
                setUser(null);
                setToken(false);
                localStorage.removeItem("user");
            })
            .finally(() => setLoading(false));
    }, []);



    const login = (data) => {

        const { user } = data;


        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


        setToken(true);

        setUser(user);

    };



    const logout = async () => {
        try {
            await logoutUser();
        } finally {
        localStorage.removeItem("user");
        setToken(false);
        setUser(null);
        }
    };



    return (

        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: !!token,
                loading,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

};



export const useAuth = () => {

    return useContext(AuthContext);

};