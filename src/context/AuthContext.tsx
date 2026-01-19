import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Initial Session Check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchTenantId(session.user);
            } else {
                setLoading(false);
            }
        });

        // 2. Listen for Auth Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log("Auth State Change:", _event, session);
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                fetchTenantId(session.user);
            } else {
                setTenantId(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchTenantId = async (user: User) => {
        try {
            // TODO: Replace with your actual table and logic
            // Assuming there is a 'users_tenants' or 'profiles' table that links users to tenants
            // const { data, error } = await supabase
            //     .from('profiles')
            //     .select('organization_id')
            //     .eq('id', user.id)
            //     .single();

            // if (error) throw error;
            // setTenantId(data?.organization_id || null);

            // MOCK implementation for now until DB is ready
            // We can determine tenant from metadata if using standard claims, or just Mock it
            console.log("Fetching tenant for user:", user.email);
            setTenantId("tenant-123-mock"); // Default mock
        } catch (error) {
            console.error("Error fetching tenant:", error);
        } finally {
            setLoading(false);
        }
    };

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
