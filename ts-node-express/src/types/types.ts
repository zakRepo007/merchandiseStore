export interface Merchandise {
    id: number;
    name: string;
    price: number;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: number;
    username: string;
    password: string;
}
export interface AuthRequest extends Request {
    user?: any; 
  }
