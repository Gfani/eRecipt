export type OfficerRole = 'REVENUE_OFFICER' | 'SENIOR_AUDITOR' | 'ADMIN';

export interface OfficerUser {
  id: string;
  username: string;
  name: string;
  badgeNumber: string;
  role: OfficerRole;
  email: string;
  branch: string;
  createdAt: string;
}

export interface OfficerLoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface OfficerAuthResponse {
  token: string;
  expiresIn: string;
  officer: OfficerUser;
}

export interface OfficerRegisterRequest {
  fullName: string;
  username: string;
  badgeNumber: string;
  email: string;
  branch: string;
  role?: OfficerRole;
  password: string;
}
