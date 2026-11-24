import { useContext, useEffect } from "react";
import { AuthContext } from "../auth-context";
import { login, register, logout, getMe, googleAuth } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;


 const handleLogin = async ({ email, password}) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            if (data?.token) {
                localStorage.setItem("token", data.token);
            }
            setUser(data.user);
            return data.user;
        } catch (err) {
            console.error("Login failed:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }
    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            if (data?.token) {
                localStorage.setItem("token", data.token);
            }
            setUser(data.user);
            return data.user;
        } catch (err) {
            console.error("Register failed:", err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const handleGoogleAuth = async ({ credential, accessToken }) => {
        setLoading(true);
        try {
            const data = await googleAuth({ credential, accessToken });
            if (data?.token) {
                localStorage.setItem("token", data.token);
            }
            setUser(data.user);
            return data.user;
        } catch (err) {
            console.error("Google authentication failed:", err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setLoading(true);
        try{
            await logout();
            localStorage.removeItem("token");
            setUser(null);
        } catch (err){
            localStorage.removeItem("token");
            console.error("Logout failed:", err);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        if (user) {
            setLoading(false);
            return;
        }

        const getAndSetUser = async () => {
            try {
                const data = await getMe();
                setUser(data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, [user, setUser, setLoading]);


    return { user, loading, handleLogin, handleRegister, handleGoogleAuth, handleLogout };

}