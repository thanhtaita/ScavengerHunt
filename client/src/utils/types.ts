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
export interface loc {
  Longitude: number;
  Latitude: number;
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

export interface GameInfo {
  code: null;
  description: string;
  email: string;
  endtime: string;
  starttime: string;
  gid: number;
  hints: ClueInfo[];
  link: null;
  name: string;
  published: boolean;
}

export interface ClueShowInfo {
  clueText: string;
  imageURL: string;
}
