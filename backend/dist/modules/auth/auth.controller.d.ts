import { AuthService } from './auth.service.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        password?: string;
    }): Promise<{
        user: import("./auth.service.js").UserProfile;
    }>;
    register(body: any): Promise<{
        user: import("./auth.service.js").UserProfile;
    }>;
    employeeLogin(body: {
        staffId: string;
        dept: string;
        securityPin: string;
    }): Promise<{
        user: import("./auth.service.js").UserProfile;
    }>;
}
