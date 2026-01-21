import { supabase } from "@/lib/supabase";

export interface TeamMember {
    id: string;
    full_name: string;
    email: string;
    role: 'admin' | 'user' | 'driver' | 'manager';
    organization_id: string;
    created_at: string;
}

const BACKEND_URL = 'http://localhost:5000/api';

export const userService = {
    /**
     * Lists all users in the current user's organization.
     * Relies on RLS policies to filter the data securely.
     */
    getOrganizationMembers: async (): Promise<TeamMember[]> => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching team details:", error);
            throw error;
        }

        return data as TeamMember[];
    },

    /**
     * Invites a new user to the organization.
     * Calls the dedicated backend because Supabase Invite requires Service Role.
     */
    inviteMember: async (email: string, role: string, organizationId: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/users/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Optional: Send current user's token for backend validation
                    // 'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    email,
                    role,
                    organizationId
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al invitar usuario');
            }

            return await response.json();
        } catch (error) {
            console.error("Error inviting user:", error);
            throw error;
        }
    }
};
