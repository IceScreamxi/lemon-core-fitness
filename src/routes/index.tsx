import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  registerMember,
  listMembers,
  MEMBERSHIP_PLANS,
  type MemberInput,
  type MemberRecord,
} from "@/lib/members.functions";
import { PersonalInformationForm } from "@/components/registration/PersonalInformationForm";
import { EmergencyContactForm } from "@/components/registration/EmergencyContactForm";
import { MembershipPaymentForm } from "@/components/registration/MembershipPaymentForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lemon Core Fitness Hub — Member Registration" },
      {
        name: "description",
        content:
          "Join Lemon Core Fitness Hub in four quick steps: personal details, emergency contact, membership plan and fitness profile. Get your member ID instantly.",
      },
      { property: "og:title", content: "Lemon Core Fitness Hub — Member Registration" },
      {
        property: "og:description",
        content:
          "Register at Lemon Core Fitness Hub and receive your member ID, start date and expiry date instantly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STEPS = [
  "Personal Information",
  "Emergency Contact",
  "Membership & Payment",
] as const;

const EMPTY: MemberInput = {
  firstName: "",
  lastName: "",
  birthdate: "",
  sex: "",
  email: "",
  phone: "",
  address: "",
  emergencyName: "",
  emergencyRelationship: "",
  emergencyPhone: "",
  plan: "monthly",
  paymentMethod: "Cash",
  isStudentOrSenior: false,
  monthsDuration: 1,
};

const REQUIRED_BY_STEP: (keyof MemberInput)[][] = [
  ["firstName", "lastName", "birthdate", "sex", "email", "phone", "address"],
  ["emergencyName", "emergencyRelationship", "emergencyPhone"],
  ["plan", "isStudentOrSenior", "paymentMethod"],
];



function Index() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<MemberInput>(EMPTY);
  const [error, setError] = useState("");
  const [result, setResult] = useState<MemberRecord | null>(null);

  const register = useServerFn(registerMember);
  const load = useServerFn(listMembers);
  const queryClient = useQueryClient();

  const members = useQuery({ queryKey: ["members"], queryFn: () => load({}) });

  const mutation = useMutation({
    mutationFn: (data: MemberInput) => register({ data }),
    onSuccess: (record) => {
      setResult(record);
      setForm(EMPTY);
      setStep(0);
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: () => setError("Registration failed. Please try again."),
  });

  const set = (key: keyof MemberInput, value: string | boolean | number) =>
    setForm((f) => ({ ...f, [key]: value }) as MemberInput);

  const next = () => {
    const missing = REQUIRED_BY_STEP[step]!.filter((k) => !form[k]?.toString().trim());
    if (missing.length) {
      setError("Please fill in all fields on this step.");
      return;
    }
    setError("");
    if (step < 2) setStep(step + 1);
    else mutation.mutate(form);
  };

  return (
    <main className="page-sunset min-h-screen px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center gap-6">
          <img 
            src="/Lemon Core Fitness Hub Logo.jpg" 
            alt="Lemon Core Fitness Hub Logo" 
            className="h-40 w-auto object-contain"
          />
          <div className="flex-1 text-center sm:text-left">
            <span className="gradient-brand inline-flex items-center rounded-full px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-foreground">
              LEMON CORE FITNESS HUB
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Member Registration
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Three short steps. Your member ID and membership dates are issued instantly.
            </p>
          </div>
        </header>

        {result && (
          <section className="glass-panel mt-8 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
              Registration complete
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-ink">
              {result.memberId} — {result.firstName} {result.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              {result.planLabel} Membership · {result.isStudentOrSenior ? "Student/Senior" : "Regular"} · ₱{result.amount.toLocaleString()} ·{" "}
              {result.paymentMethod}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-8 gap-y-1 text-sm text-ink">
              <span>
                <strong>Start:</strong> {result.startDate}
              </span>
              <span>
                <strong>Expiry:</strong> {result.expiryDate}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Saved to Google Sheets
            </p>
            <button
              onClick={() => setResult(null)}
              className="mt-4 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-cream"
            >
              Register another member
            </button>
          </section>
        )}

        <section className="glass-panel mt-8 rounded-2xl p-6 shadow-sm sm:p-8">
          <ol className="mb-6 grid grid-cols-3 gap-2">
            {STEPS.map((label, i) => (
              <li key={label} className="text-center">
                <div
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    i <= step
                      ? "gradient-brand text-brand-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <p className="mt-2 hidden text-[11px] font-medium text-muted-foreground sm:block">
                  {label}
                </p>
              </li>
            ))}
          </ol>

          <h2 className="font-display text-xl font-bold text-ink">{STEPS[step]}</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {step === 0 && <PersonalInformationForm form={form} setForm={set} />}
            {step === 1 && <EmergencyContactForm form={form} setForm={set} />}
            {step === 2 && <MembershipPaymentForm form={form} setForm={set} />}
          </div>

          {error && <p className="mt-4 text-sm font-medium text-destructive">{error}</p>}

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep(Math.max(0, step - 1));
              }}
              disabled={step === 0}
              className="rounded-lg border border-field-border bg-field px-4 py-2 text-sm font-semibold text-ink disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={next}
              disabled={mutation.isPending}
              className="gradient-brand rounded-lg px-6 py-2 text-sm font-bold text-brand-foreground shadow-sm disabled:opacity-60"
            >
              {step < 2 ? "Continue" : mutation.isPending ? "Registering…" : "Register"}
            </button>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-display text-lg font-bold text-ink">Registered members</h2>
          <div className="glass-panel mt-3 overflow-x-auto rounded-2xl">
            <table className="w-full text-center text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Member ID</th>
                  <th className="px-4 py-3">Name</th>
                </tr>
              </thead>
              <tbody>
                {(members.data ?? []).map((m) => (
                  <tr key={m.memberId} className="border-t border-field-border text-ink">
                    <td className="px-4 py-3 font-mono text-xs">{m.memberId}</td>
                    <td className="px-4 py-3">{m.name}</td>
                  </tr>
                ))}
                {!members.data?.length && (
                  <tr>
                    <td className="px-4 py-6 text-muted-foreground" colSpan={2}>
                      No members yet — register the first one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
