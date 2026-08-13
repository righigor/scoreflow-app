import { create } from 'zustand';

export type UserRole = 'FEDERATION_ADMIN' | 'CLUB_ADMIN' | 'JUDGE' | 'SYSADMIN';

export interface UserProfile {
  id: string;
  role: UserRole;
  full_name: string | null;
  federation_id: string | null;
  status: "ACTIVE" | "INACTIVE" | "TRIAL";
  club_id: string | null;
}

interface AuthState {
  profile: UserProfile | null;
  isLoading: boolean;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  clearProfile: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  isLoading: true,
  setProfile: (profile) => set({ profile, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  clearProfile: () => set({ profile: null, isLoading: false }),
}));