import React, { createContext, useReducer, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

const initialState = {
    user: null,
    tempRegistration: null, // Holds temporary credentials { email, password } between step 1 and step 2
    loading: true,
    error: null,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return { ...state, user: action.payload, loading: false, error: null };
        case 'LOGIN_FAILURE':
            return { ...state, user: null, loading: false, error: action.payload };
        case 'LOGOUT':
            return { ...state, user: null, tempRegistration: null, loading: false, error: null };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_REGISTRATION_DATA':
            return { ...state, tempRegistration: action.payload, loading: false, error: null };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Initial session recovery check on application mount
    useEffect(() => {
        const checkLoggedUser = async () => {
            const savedUserId = localStorage.getItem('loggedUserId');
            if (savedUserId) {
                try {
                    const data = await authService.checkAuth(savedUserId);
                    if (data.isAuthenticated && data.user) {
                        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
                    } else {
                        localStorage.removeItem('loggedUserId');
                        dispatch({ type: 'LOGIN_FAILURE', payload: 'Session expired' });
                    }
                } catch (err) {
                    localStorage.removeItem('loggedUserId');
                    dispatch({ type: 'LOGIN_FAILURE', payload: 'Sync failed' });
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };
        checkLoggedUser();
    }, []);

    const loginUser = async (email, password) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const data = await authService.login(email, password);
            if (data.success && data.user) {
                localStorage.setItem('loggedUserId', data.user.id);
                dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
                return { success: true };
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Invalid credentials";
            dispatch({ type: 'LOGIN_FAILURE', payload: errorMsg });
            return { success: false, message: errorMsg };
        }
    };

    /**
     * Registration Step 1: Validates email availability. 
     * If available, saves email and password into global context state.
     */
    const registerStep1 = async (email, password) => {
        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            const data = await authService.registerStep1(email, password);
            if (data.success) {
                // Instantly commit the temporary access values into our context registry
                dispatch({ type: 'SET_REGISTRATION_DATA', payload: { email, password } });
                return { success: true };
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Email is already taken";
            dispatch({ type: 'LOGIN_FAILURE', payload: errorMsg });
            return { success: false, message: errorMsg };
        }
    };

    /**
     * Registration Step 2 / Profile Updates: Executes final database transaction parameters.
     */
    const registerStep2 = async (userData) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const data = await authService.registerStep2(userData);
            if (data.success && data.user) {
                localStorage.setItem('loggedUserId', data.user.id);
                dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
                return { success: true };
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Profile assignment failed";
            dispatch({ type: 'LOGIN_FAILURE', payload: errorMsg });
            return { success: false, message: errorMsg };
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('loggedUserId');
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                tempRegistration: state.tempRegistration,
                loading: state.loading,
                error: state.error,
                loginUser,
                registerStep1,   // Unified Step 1 Action Hook Handler
                registerStep2,   // Unified Step 2 Action Hook Handler
                logoutUser
            }}>
            {!state.loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);