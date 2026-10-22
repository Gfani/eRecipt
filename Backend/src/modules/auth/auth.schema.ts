import { z } from "zod";

export const merchantLoginSchema = z.object({
  tin: z
    .string()
    .length(10, { message: "TIN must be exactly 10 digits" })
    .regex(/^\d+$/, { message: "TIN must contain only numbers" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

export const officerLoginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberOfficer: z.boolean().optional(),
});

export type MerchantLoginInput = z.infer<typeof merchantLoginSchema>;
export type OfficerLoginInput = z.infer<typeof officerLoginSchema>;
