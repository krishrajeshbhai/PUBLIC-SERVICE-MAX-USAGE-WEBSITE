var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
let AuthService = class AuthService {
    users = new Map();
    constructor() {
        this.users.set('passenger@transitone.in', {
            id: 'user-101',
            name: 'Rahul Sharma',
            email: 'passenger@transitone.in',
            password: 'Password@123',
            role: 'passenger',
            country: 'India',
            language: 'en',
            age: 28,
            accessibility: false,
            token: 'jwt-mock-passenger-token-101'
        });
        this.users.set('senior@transitone.in', {
            id: 'user-102',
            name: 'Savitri Devi',
            email: 'senior@transitone.in',
            password: 'Password@123',
            role: 'passenger',
            country: 'India',
            language: 'hi',
            age: 65,
            accessibility: true,
            token: 'jwt-mock-senior-token-102'
        });
        this.users.set('tourist@transitone.in', {
            id: 'user-103',
            name: 'Sophie Martin',
            email: 'tourist@transitone.in',
            password: 'Password@123',
            role: 'visitor',
            country: 'France',
            language: 'fr',
            age: 34,
            accessibility: false,
            token: 'jwt-mock-tourist-token-103'
        });
    }
    async login(email, password) {
        if (!email || !password) {
            throw new BadRequestException('Email and password are required');
        }
        const key = email.toLowerCase().trim();
        const existing = this.users.get(key);
        if (!existing || existing.password !== password) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const { password: _, ...userWithoutPassword } = existing;
        return { user: userWithoutPassword };
    }
    async register(data) {
        if (!data.email || !data.password) {
            throw new BadRequestException('Email and password are required');
        }
        const emailKey = data.email.toLowerCase().trim();
        if (this.users.has(emailKey)) {
            throw new ConflictException('Email is already registered. Please log in.');
        }
        const ageNum = data.age ? parseInt(data.age, 10) : undefined;
        const isSenior = ageNum !== undefined && ageNum > 50;
        const isForeign = data.country && data.country.toLowerCase() !== 'india';
        const newUser = {
            id: `user-${Math.floor(1000 + Math.random() * 9000)}`,
            name: data.name || 'Passenger',
            email: emailKey,
            password: data.password,
            role: isForeign ? 'visitor' : 'passenger',
            country: data.country || 'India',
            language: data.language || 'en',
            age: ageNum,
            accessibility: isSenior ? true : !!data.accessibility,
            preferences: data.preferences || {},
            token: `jwt-register-token-${Date.now()}`
        };
        this.users.set(emailKey, newUser);
        const { password: _, ...userWithoutPassword } = newUser;
        return { user: userWithoutPassword };
    }
    async employeeLogin(staffId, dept, securityPin) {
        if (!staffId || !securityPin) {
            throw new BadRequestException('Staff ID and Security PIN are required');
        }
        if (securityPin.trim() !== '9921') {
            throw new UnauthorizedException('Invalid Staff Credentials or Security PIN');
        }
        const employeeUser = {
            id: staffId.toUpperCase(),
            name: `Officer ${staffId.toUpperCase()}`,
            email: `${staffId.toLowerCase()}@transit.gov.in`,
            role: 'employee',
            country: 'India',
            language: 'en',
            accessibility: false,
            token: `jwt-employee-token-${Date.now()}`
        };
        return { user: employeeUser };
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map