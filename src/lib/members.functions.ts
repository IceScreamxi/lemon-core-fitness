import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { appendToSheet, getSheetData, initializeSheet } from "./google-sheets.service";

export const MEMBERSHIP_PLANS = [
  { id: "monthly", label: "Monthly", months: 1, studentPrice: 800, regularPrice: 1000 },
  { id: "day-pass", label: "Day Pass", months: 0, studentPrice: 80, regularPrice: 90 },
] as const;

export type MembershipPlanId = (typeof MEMBERSHIP_PLANS)[number]["id"];

const memberSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthdate: z.string().min(1),
  sex: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  emergencyName: z.string().min(1),
  emergencyRelationship: z.string().min(1),
  emergencyPhone: z.string().min(1),
  plan: z.enum(["monthly", "day-pass"]),
  paymentMethod: z.string().min(1),
  isStudentOrSenior: z.boolean(),
  fitnessGoal: z.string().optional(),
  experienceLevel: z.string().optional(),
  medicalNotes: z.string().optional(),
});

export type MemberInput = z.infer<typeof memberSchema>;

export type MemberRecord = MemberInput & {
  memberId: string;
  planLabel: string;
  amount: number;
  startDate: string;
  expiryDate: string;
  registeredAt: string;
};

export const HEADERS = [
  "Member ID",
  "First Name",
  "Last Name",
  "Birthdate",
  "Sex",
  "Email",
  "Phone",
  "Address",
  "Emergency Contact",
  "Relationship",
  "Emergency Phone",
  "Plan",
  "Amount (PHP)",
  "Payment Method",
  "Student/Senior",
  "Fitness Goal",
  "Experience Level",
  "Medical Notes",
  "Start Date",
  "Expiry Date",
  "Registered At",
] as const;

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const registerMember = createServerFn({ method: "POST" })
  .inputValidator((data) => memberSchema.parse(data))
  .handler(async ({ data }): Promise<MemberRecord> => {
    // Initialize sheet with headers if needed
    await initializeSheet([...HEADERS]);

    // Get existing data to determine next member number
    const existingData = await getSheetData();
    const memberRows = existingData
      .slice(1)
      .filter((r) => typeof r?.[0] === "string" && r[0].startsWith("GYM-"));
    const nextNumber = memberRows.length + 1;

    const plan = MEMBERSHIP_PLANS.find((p) => p.id === data.plan)!;
    const amount = data.isStudentOrSenior ? plan.studentPrice : plan.regularPrice;
    const start = new Date();
    const expiry = new Date(start);
    expiry.setMonth(expiry.getMonth() + plan.months);

    const record: MemberRecord = {
      ...data,
      memberId: `GYM-${String(nextNumber).padStart(5, "0")}`,
      planLabel: plan.label,
      amount: amount,
      startDate: formatDate(start),
      expiryDate: formatDate(expiry),
      registeredAt: start.toISOString(),
    };

    const row = [
      record.memberId,
      record.firstName,
      record.lastName,
      record.birthdate,
      record.sex,
      record.email,
      record.phone,
      record.address,
      record.emergencyName,
      record.emergencyRelationship,
      record.emergencyPhone,
      record.planLabel,
      record.amount,
      record.paymentMethod,
      record.isStudentOrSenior ? "Yes" : "No",
      record.fitnessGoal,
      record.experienceLevel,
      record.medicalNotes,
      record.startDate,
      record.expiryDate,
      record.registeredAt,
    ];

    // Append to Google Sheet
    await appendToSheet(row);

    return record;
  });

export const listMembers = createServerFn({ method: "GET" }).handler(
  async (): Promise<
    { memberId: string; name: string; plan: string; expiryDate: string }[]
  > => {
    const data = await getSheetData();
    
    if (data.length === 0) return [];

    return data
      .slice(1)
      .filter((r) => typeof r?.[0] === "string" && r[0].startsWith("GYM-"))
      .map((r) => ({
        memberId: String(r[0]),
        name: `${r[1]} ${r[2]}`,
        plan: String(r[11]),
        expiryDate: String(r[18]),
      }));
  },
);
