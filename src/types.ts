import React, {
  InputHTMLAttributes,
  ButtonHTMLAttributes,
  Dispatch,
  SetStateAction,
} from "react";

export interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean | string | undefined;
  width?: number | string | undefined;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export interface UserProps {
  bio: string;
  createdAt: string;
  email: string;
  id: number;
  image: string;
  token: string;
  updatedAt: string;
  username: string;
  password?: string;
  following?: boolean;
}

export interface AuthContextProps {
  signed: boolean;
  loading: boolean;
  getUser: () => Promise<UserProps | undefined>;
  setLoading: (loading: boolean) => void;
  deleteUser: () => void;
  saveUser: (token: string, user: UserProps) => Promise<void>;
  setSigned: Dispatch<SetStateAction<boolean>>;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
}
