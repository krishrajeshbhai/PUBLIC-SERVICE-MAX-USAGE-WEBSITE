export interface UserProfile {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: 'passenger' | 'visitor' | 'employee';
    country: string;
    language: string;
    age?: number;
    accessibility: boolean;
    preferences?: any;
    token: string;
}
export declare class AuthService {
    private users;
    constructor();
    login(email: string, password?: string): Promise<{
        user: UserProfile;
    }>;
    register(data: any): Promise<{
        user: UserProfile;
    }>;
    employeeLogin(staffId: string, dept: string, securityPin: string): Promise<{
        user: UserProfile;
    }>;
}
