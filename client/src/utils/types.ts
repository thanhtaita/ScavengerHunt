export interface GameRow {
  id: number;
  name: string;
  starttime: string;
  endtime: string;
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

export interface ClueInfo {
  clueID: number;
  clueText: string;
  imageURL: string;
  location: string;
  QR_text: string;
}
