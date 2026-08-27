import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';

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

@Injectable()
export class AuthService {
  private users: Map<string, UserProfile> = new Map();

  constructor() {
    // Pre-seeded accounts
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

  async login(email: string, password?: string): Promise<{ user: UserProfile }> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const key = email.toLowerCase().trim();
    const existing = this.users.get(key);

    if (!existing || existing.password !== password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = existing;
    return { user: userWithoutPassword as UserProfile };
  }

  async register(data: any): Promise<{ user: UserProfile }> {
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

    const newUser: UserProfile = {
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
    return { user: userWithoutPassword as UserProfile };
  }

  async employeeLogin(staffId: string, dept: string, securityPin: string): Promise<{ user: UserProfile }> {
    if (!staffId || !securityPin) {
      throw new BadRequestException('Staff ID and Security PIN are required');
    }
    if (securityPin.trim() !== '9921') {
      throw new UnauthorizedException('Invalid Staff Credentials or Security PIN');
    }

    const employeeUser: UserProfile = {
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
}
