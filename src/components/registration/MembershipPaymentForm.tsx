import type { MemberInput } from "@/lib/members.functions";
import { MEMBERSHIP_PLANS } from "@/lib/members.functions";

const fieldClass =
  "w-full rounded-lg border border-field-border bg-field px-3 py-2 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

interface MembershipPaymentFormProps {
  form: MemberInput;
  setForm: (key: keyof MemberInput, value: string | boolean | number) => void;
}

export function MembershipPaymentForm({
  form,
  setForm,
}: MembershipPaymentFormProps) {
  const plan = MEMBERSHIP_PLANS.find((p) => p.id === form.plan) || MEMBERSHIP_PLANS[0];
  const duration = form.plan === "monthly" && form.monthsDuration ? form.monthsDuration : plan.months;
  const basePrice = form.isStudentOrSenior ? plan.studentPrice : plan.regularPrice;
  const price = form.plan === "monthly" && form.monthsDuration && form.monthsDuration > 1 ? basePrice * form.monthsDuration : basePrice;

  return (
    <>
      <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
        {MEMBERSHIP_PLANS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setForm("plan", p.id)}
            className={`rounded-xl border p-4 text-left transition ${
              form.plan === p.id
                ? "border-brand bg-cream shadow-sm"
                : "border-field-border bg-field hover:border-brand/50"
            }`}
          >
            <p className="font-display text-base font-bold text-ink">{p.label}</p>
            <p className="text-sm text-muted-foreground">
              Student/Senior: ₱{p.studentPrice.toLocaleString()} | Regular: ₱{p.regularPrice.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {p.months > 0 ? `${p.months} month${p.months > 1 ? "s" : ""}` : "Per day"}
            </p>
          </button>
        ))}
      </div>
      <Field label="Membership type">
        <select
          className={fieldClass}
          value={form.isStudentOrSenior ? "student-senior" : "regular"}
          onChange={(e) => setForm("isStudentOrSenior", e.target.value === "student-senior")}
        >
          <option value="regular">Regular</option>
          <option value="student-senior">Student / Senior</option>
        </select>
      </Field>
      {form.plan === "monthly" && (
        <Field label="Duration">
          <select
            className={fieldClass}
            value={form.monthsDuration || 1}
            onChange={(e) => setForm("monthsDuration", parseInt(e.target.value))}
          >
            <option value={1}>1 month</option>
            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((months) => (
              <option key={months} value={months}>
                {months} months
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field label="Payment method">
        <select
          className={fieldClass}
          value={form.paymentMethod}
          onChange={(e) => setForm("paymentMethod", e.target.value)}
        >
          <option>Cash</option>
          <option>GCash</option>
          <option>Bank Transfer</option>
        </select>
      </Field>
      <div className="flex items-end">
        <p className="text-sm text-muted-foreground">
          Total due today:{" "}
          <strong className="text-ink">₱{price.toLocaleString()}</strong>
        </p>
      </div>
    </>
  );
}
