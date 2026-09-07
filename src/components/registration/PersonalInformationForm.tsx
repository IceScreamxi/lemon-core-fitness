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

interface PersonalInformationFormProps {
  form: MemberInput;
  setForm: (key: keyof MemberInput, value: string) => void;
}

export function PersonalInformationForm({
  form,
  setForm,
}: PersonalInformationFormProps) {
  return (
    <>
      <Field label="First name">
        <input
          className={fieldClass}
          value={form.firstName}
          onChange={(e) => setForm("firstName", e.target.value)}
        />
      </Field>
      <Field label="Last name">
        <input
          className={fieldClass}
          value={form.lastName}
          onChange={(e) => setForm("lastName", e.target.value)}
        />
      </Field>
      <Field label="Birthdate">
        <input
          type="date"
          className={fieldClass}
          value={form.birthdate}
          onChange={(e) => setForm("birthdate", e.target.value)}
        />
      </Field>
      <Field label="Sex">
        <select
          className={fieldClass}
          value={form.sex}
          onChange={(e) => setForm("sex", e.target.value)}
        >
          <option value="">Select…</option>
          <option>Male</option>
          <option>Female</option>
          <option>Prefer not to say</option>
        </select>
      </Field>
      <Field label="Email">
        <input
          type="email"
          className={fieldClass}
          value={form.email}
          onChange={(e) => setForm("email", e.target.value)}
        />
      </Field>
      <Field label="Phone">
        <input
          className={fieldClass}
          value={form.phone}
          onChange={(e) => setForm("phone", e.target.value)}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Address">
          <input
            className={fieldClass}
            value={form.address}
            onChange={(e) => setForm("address", e.target.value)}
          />
        </Field>
      </div>
    </>
  );
}
