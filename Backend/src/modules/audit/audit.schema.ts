import { z } from "zod";

export const auditFilterSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, "Start date must be YYYY-MM or YYYY-MM-DD"),
  endDate: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, "End date must be YYYY-MM or YYYY-MM-DD"),
});

export const approveTaxSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  approvedAmount: z.number().nonnegative(),
  notes: z.string().optional(),
});

export type AuditFilterInput = z.infer<typeof auditFilterSchema>;
export type ApproveTaxInput = z.infer<typeof approveTaxSchema>;
