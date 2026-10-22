export interface MerchantAuthResponse {
  token: string;
  user: {
    id: string;
    role: "merchant";
    tin: string;
    businessName: string;
    tradeName?: string;
    status: "Pending" | "Under Review" | "Approved" | "Rejected";
  };
}

export interface OfficerAuthResponse {
  token: string;
  user: {
    id: string;
    role: "officer" | "admin";
    username: string;
    fullName: string;
    department: string;
  };
}
