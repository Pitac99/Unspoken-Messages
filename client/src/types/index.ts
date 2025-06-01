export * from "@shared/schema";

export interface NavigationState {
  currentPage: string;
  previousPage?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  sessionExpiry?: number;
}

export interface PinState {
  current: string;
  confirmed?: string;
  isConfirming: boolean;
}

export type AvatarColor = 
  | "from-pink-500 to-rose-600"
  | "from-blue-500 to-indigo-600" 
  | "from-purple-500 to-violet-600"
  | "from-green-500 to-emerald-600"
  | "from-orange-500 to-amber-600"
  | "from-red-500 to-pink-600"
  | "from-cyan-500 to-blue-600"
  | "from-violet-500 to-purple-600";
