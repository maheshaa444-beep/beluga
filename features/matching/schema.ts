import { z } from "zod";

export const matchTierSchema = z.enum(["High", "Mid", "Least"]);
export type MatchTier = z.infer<typeof matchTierSchema>;

export const callBriefSchema = z.object({
  openingLine: z.string().min(1),
  talkingPoints: z.array(z.string()).min(1),
  likelyObjection: z.string().min(1),
  objectionReply: z.string().min(1),
});
export type CallBrief = z.infer<typeof callBriefSchema>;

export const contactInfoSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().min(1),
  website: z.string().min(1),
});
export type ContactInfo = z.infer<typeof contactInfoSchema>;

export const companyMatchSchema = z.object({
  companyId: z.string().min(1),
  productId: z.string().min(1),
  score: z.number().int().min(0).max(100),
  tier: matchTierSchema,
  fitReasoning: z.string().min(1),
  pitchAngle: z.string().min(1),
  likelyPainPoint: z.string().min(1),
  aboutSummary: z.string().min(1),
  contact: contactInfoSchema,
  callBrief: callBriefSchema,
});
export type CompanyMatch = z.infer<typeof companyMatchSchema>;
