export interface GameRow {
  id: number;
  name: string;
  startDate: string;
  clues: number;
}

export interface User {
  name?: string;
  email?: string;
  picture?: string;
}

export interface AuthContextType {
  loggedIn: null;
  user: User | null;
  checkLoginState: () => void;
}
