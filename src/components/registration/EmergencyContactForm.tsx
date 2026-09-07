import type { MemberInput } from "@/lib/members.functions";

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

interface EmergencyContactFormProps {
  form: MemberInput;
  setForm: (key: keyof MemberInput, value: string) => void;
}

export function EmergencyContactForm({
  form,
  setForm,
}: EmergencyContactFormProps) {
  return (
    <>
      <Field label="Contact name">
        <input
          className={fieldClass}
          value={form.emergencyName}
          onChange={(e) => setForm("emergencyName", e.target.value)}
        />
      </Field>
      <Field label="Relationship">
        <input
          className={fieldClass}
          value={form.emergencyRelationship}
          onChange={(e) => setForm("emergencyRelationship", e.target.value)}
        />
      </Field>
      <Field label="Contact phone">
        <input
          className={fieldClass}
          value={form.emergencyPhone}
          onChange={(e) => setForm("emergencyPhone", e.target.value)}
        />
      </Field>
    </>
  );
}
