export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Credentials {
  email: string;
  password: string;
  remember: boolean;
}
