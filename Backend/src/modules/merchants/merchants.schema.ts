import { z } from "zod";

export const merchantRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z.string().min(9, "Valid phone number required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  sellerLegalName: z.string().min(2, "Seller legal name is required"),
  tradeName: z.string().min(2, "Trade name is required"),
  tin: z
    .string()
    .length(10, "TIN must be exactly 10 digits")
    .regex(/^\d+$/, "TIN must contain only numbers"),
  businessLicenseNumber: z.string().min(3, "Business license number is required"),
  category: z.string().optional().default("General Merchant"),
  uploadedFileName: z.string().optional().default(""),
  uploadedFileSize: z.string().optional().default(""),
  isDocumentReady: z.boolean().optional().default(false),
  city: z.string().min(2, "City is required"),
  subCity: z.string().min(2, "Sub-city is required"),
  buildingName: z.string().optional().default(""),
  floor: z.string().optional().default(""),
  gpsLocation: z.string().optional().default(""),
  certified: z.boolean().refine((val) => val === true, {
    message: "You must certify that all provided information is accurate",
  }),
});

export const updateMerchantStatusSchema = z.object({
  status: z.enum([
    "Pending",
    "Under Review",
    "Additional Information Required",
    "Approved",
    "Rejected",
  ]),
  reason: z.string().optional(),
});

export type MerchantRegistrationInput = z.infer<typeof merchantRegistrationSchema>;
export type UpdateMerchantStatusInput = z.infer<typeof updateMerchantStatusSchema>;
