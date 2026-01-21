import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    tenantId: string | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithMicrosoft: () => Promise<void>;
    signInWithPassword: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom interface for our App's metadata
export interface AppMetadata {
    role?: string;
    tenant_id?: string;
    tenant_name?: string;
    debug_org_name?: string;
    [key: string]: unknown;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const updateUserState = (newSession: Session | null) => {
        setSession(newSession);
        setLoading(false);

        if (newSession?.user) {
            const metadata = newSession.user.app_metadata as AppMetadata;

            // AUTOMATIC REFRESH FIX:
            // If we have a user but NO tenant_name (and we expect one), 
            // the session might be stale relative to the Hook.
            if (!metadata.tenant_name && !metadata.debug_org_name) {
                console.warn("Missing Custom Claims. Attempting FORCE REFRESH...");
                // Use a flag to prevent infinite loops if claims really don't exist
                if (!sessionStorage.getItem('auth_refresh_attempted')) {
                    sessionStorage.setItem('auth_refresh_attempted', 'true');
                    supabase.auth.refreshSession().then(({ data }) => {
                        if (data.session) {
                            console.log("Refreshed Session!", data.session.user.app_metadata);
                            updateUserState(data.session);
                        }
                    });
                    return; // Wait for the refresh
                }
            } else {
                // Clear the flag on success
                sessionStorage.removeItem('auth_refresh_attempted');
            }

            setUser({
                ...newSession.user,
                role: metadata.role || 'guest', // Override standard role with our custom claim
            } as User);

            setTenantId(metadata.tenant_id || null);

            console.log("User Context Loaded:", {
                role: metadata.role,
                tenant: metadata.tenant_name,
                id: metadata.tenant_id
            });
        } else {
            setUser(null);
            setTenantId(null);
        }
    };

    useEffect(() => {
        // 1. Initial Session Check
        supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
            updateUserState(initialSession);
        });

        // 2. Listen for Auth Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            if (_event === 'TOKEN_REFRESHED' || _event === 'SIGNED_IN') {
                console.log("Auth Event:", _event);
                updateUserState(currentSession);
            } else if (_event === 'SIGNED_OUT') {
                updateUserState(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`,
            },
        });
        if (error) throw error;
    };

    const signInWithMicrosoft = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'azure', // Azure AD is used for Microsoft accounts
            options: {
                redirectTo: `${window.location.origin}/`,
                scopes: 'email profile openid',
            },
        });
        if (error) throw error;
    };

    const signInWithPassword = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{ session, user, tenantId, loading, signInWithGoogle, signInWithMicrosoft, signInWithPassword, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
