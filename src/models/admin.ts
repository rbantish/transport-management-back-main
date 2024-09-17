export interface Admin {
    id: number;
    name: string;
    email: string;
    password: string;
}

export interface AdminResponse {
    id: number;
    name: string;
    email: string;
    type: string;
}

export interface AdminRequest {
    email: string;
    password: string;
}