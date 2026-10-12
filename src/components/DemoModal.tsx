import { useEffect, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "./ui/Button";
import IconButton from "./ui/IconButton";

type DemoModalProps = {
  open: boolean;
  onClose: () => void;
};

const inputClasses =
  "w-full rounded-md border border-secondary-200 bg-white px-3.5 py-2.5 text-sm text-heading placeholder:text-caption transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30";

function Field({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-heading">
        {label}
      </span>
      <input className={inputClasses} {...props} />
    </label>
  );
}

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
  "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Chad", "Chile", "China",
  "Colombia", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Honduras", "Hong Kong", "Hungary",
  "Iceland", "India", "Indonesia", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
  "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
  "Maldives", "Mali", "Malta", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro",
  "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
  "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Rwanda",
  "Saudi Arabia", "Senegal", "Serbia", "Singapore", "Slovakia", "Slovenia", "South Africa",
  "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Taiwan", "Tajikistan", "Tanzania",
  "Thailand", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Yemen",
  "Zambia", "Zimbabwe",
];

function CountryField({ label, name, required }: { label: string; name: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-heading">
        {label}
      </span>
      <select name={name} required={required} defaultValue="" className={inputClasses}>
        <option value="" disabled>
          Select country
        </option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}

// Same countries, same order, paired with their calling code — kept as its
// own list (not derived from `countries`) since several countries share a
// code (e.g. the US and Canada both dial out on +1), so it isn't a simple
// 1:1 derivation.
const dialCodes: { country: string; code: string }[] = [
  { country: "Afghanistan", code: "+93" }, { country: "Albania", code: "+355" },
  { country: "Algeria", code: "+213" }, { country: "Andorra", code: "+376" },
  { country: "Angola", code: "+244" }, { country: "Argentina", code: "+54" },
  { country: "Armenia", code: "+374" }, { country: "Australia", code: "+61" },
  { country: "Austria", code: "+43" }, { country: "Azerbaijan", code: "+994" },
  { country: "Bahamas", code: "+1" }, { country: "Bahrain", code: "+973" },
  { country: "Bangladesh", code: "+880" }, { country: "Barbados", code: "+1" },
  { country: "Belarus", code: "+375" }, { country: "Belgium", code: "+32" },
  { country: "Belize", code: "+501" }, { country: "Benin", code: "+229" },
  { country: "Bhutan", code: "+975" }, { country: "Bolivia", code: "+591" },
  { country: "Bosnia and Herzegovina", code: "+387" }, { country: "Botswana", code: "+267" },
  { country: "Brazil", code: "+55" }, { country: "Brunei", code: "+673" },
  { country: "Bulgaria", code: "+359" }, { country: "Burkina Faso", code: "+226" },
  { country: "Burundi", code: "+257" }, { country: "Cambodia", code: "+855" },
  { country: "Cameroon", code: "+237" }, { country: "Canada", code: "+1" },
  { country: "Chad", code: "+235" }, { country: "Chile", code: "+56" },
  { country: "China", code: "+86" }, { country: "Colombia", code: "+57" },
  { country: "Costa Rica", code: "+506" }, { country: "Croatia", code: "+385" },
  { country: "Cuba", code: "+53" }, { country: "Cyprus", code: "+357" },
  { country: "Czechia", code: "+420" }, { country: "Denmark", code: "+45" },
  { country: "Dominican Republic", code: "+1" }, { country: "Ecuador", code: "+593" },
  { country: "Egypt", code: "+20" }, { country: "El Salvador", code: "+503" },
  { country: "Estonia", code: "+372" }, { country: "Eswatini", code: "+268" },
  { country: "Ethiopia", code: "+251" }, { country: "Fiji", code: "+679" },
  { country: "Finland", code: "+358" }, { country: "France", code: "+33" },
  { country: "Gabon", code: "+241" }, { country: "Georgia", code: "+995" },
  { country: "Germany", code: "+49" }, { country: "Ghana", code: "+233" },
  { country: "Greece", code: "+30" }, { country: "Guatemala", code: "+502" },
  { country: "Honduras", code: "+504" }, { country: "Hong Kong", code: "+852" },
  { country: "Hungary", code: "+36" }, { country: "Iceland", code: "+354" },
  { country: "India", code: "+91" }, { country: "Indonesia", code: "+62" },
  { country: "Iraq", code: "+964" }, { country: "Ireland", code: "+353" },
  { country: "Israel", code: "+972" }, { country: "Italy", code: "+39" },
  { country: "Ivory Coast", code: "+225" }, { country: "Jamaica", code: "+1" },
  { country: "Japan", code: "+81" }, { country: "Jordan", code: "+962" },
  { country: "Kazakhstan", code: "+7" }, { country: "Kenya", code: "+254" },
  { country: "Kuwait", code: "+965" }, { country: "Kyrgyzstan", code: "+996" },
  { country: "Laos", code: "+856" }, { country: "Latvia", code: "+371" },
  { country: "Lebanon", code: "+961" }, { country: "Liberia", code: "+231" },
  { country: "Libya", code: "+218" }, { country: "Liechtenstein", code: "+423" },
  { country: "Lithuania", code: "+370" }, { country: "Luxembourg", code: "+352" },
  { country: "Madagascar", code: "+261" }, { country: "Malawi", code: "+265" },
  { country: "Malaysia", code: "+60" }, { country: "Maldives", code: "+960" },
  { country: "Mali", code: "+223" }, { country: "Malta", code: "+356" },
  { country: "Mauritius", code: "+230" }, { country: "Mexico", code: "+52" },
  { country: "Moldova", code: "+373" }, { country: "Monaco", code: "+377" },
  { country: "Mongolia", code: "+976" }, { country: "Montenegro", code: "+382" },
  { country: "Morocco", code: "+212" }, { country: "Mozambique", code: "+258" },
  { country: "Myanmar", code: "+95" }, { country: "Namibia", code: "+264" },
  { country: "Nepal", code: "+977" }, { country: "Netherlands", code: "+31" },
  { country: "New Zealand", code: "+64" }, { country: "Nicaragua", code: "+505" },
  { country: "Niger", code: "+227" }, { country: "Nigeria", code: "+234" },
  { country: "North Macedonia", code: "+389" }, { country: "Norway", code: "+47" },
  { country: "Oman", code: "+968" }, { country: "Pakistan", code: "+92" },
  { country: "Panama", code: "+507" }, { country: "Papua New Guinea", code: "+675" },
  { country: "Paraguay", code: "+595" }, { country: "Peru", code: "+51" },
  { country: "Philippines", code: "+63" }, { country: "Poland", code: "+48" },
  { country: "Portugal", code: "+351" }, { country: "Qatar", code: "+974" },
  { country: "Romania", code: "+40" }, { country: "Rwanda", code: "+250" },
  { country: "Saudi Arabia", code: "+966" }, { country: "Senegal", code: "+221" },
  { country: "Serbia", code: "+381" }, { country: "Singapore", code: "+65" },
  { country: "Slovakia", code: "+421" }, { country: "Slovenia", code: "+386" },
  { country: "South Africa", code: "+27" }, { country: "South Korea", code: "+82" },
  { country: "Spain", code: "+34" }, { country: "Sri Lanka", code: "+94" },
  { country: "Sweden", code: "+46" }, { country: "Switzerland", code: "+41" },
  { country: "Taiwan", code: "+886" }, { country: "Tajikistan", code: "+992" },
  { country: "Tanzania", code: "+255" }, { country: "Thailand", code: "+66" },
  { country: "Tunisia", code: "+216" }, { country: "Turkey", code: "+90" },
  { country: "Turkmenistan", code: "+993" }, { country: "Uganda", code: "+256" },
  { country: "Ukraine", code: "+380" }, { country: "United Arab Emirates", code: "+971" },
  { country: "United Kingdom", code: "+44" }, { country: "United States", code: "+1" },
  { country: "Uruguay", code: "+598" }, { country: "Uzbekistan", code: "+998" },
  { country: "Venezuela", code: "+58" }, { country: "Vietnam", code: "+84" },
  { country: "Yemen", code: "+967" }, { country: "Zambia", code: "+260" },
  { country: "Zimbabwe", code: "+263" },
];

function PhoneField({ label, required }: { label: string; required?: boolean }) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-heading">
        {label}
      </span>
      <div className="flex gap-2">
        <select
          name="mobileCountryCode"
          aria-label="Country code"
          required={required}
          defaultValue="+1"
          className={`${inputClasses} !w-[6.5rem] min-w-0 shrink-0 px-2`}
        >
          {dialCodes.map(({ country, code }) => (
            <option key={country} value={code}>
              {code} {country}
            </option>
          ))}
        </select>
        <input
          name="mobile"
          type="tel"
          autoComplete="tel-national"
          placeholder="555 000 0000"
          required={required}
          className={`${inputClasses} min-w-0 flex-1`}
        />
      </div>
    </div>
  );
}

export default function DemoModal({ open, onClose }: DemoModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setAgreed(false);
    }
  }, [open]);

  if (!open) return null;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-secondary-900/50 px-4 py-8 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-modal-title"
        className="relative w-full max-w-lg rounded-2xl border border-secondary-100 bg-white p-6 shadow-2xl shadow-secondary-900/20 sm:p-8"
      >
        <IconButton
          icon={CloseIcon}
          aria-label="Close"
          variant="subtle"
          size="sm"
          onClick={onClose}
          className="absolute right-4 top-4"
        />

        {submitted ? (
          <div className="flex flex-col items-center py-8 text-center">
            <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary-100 text-primary-500">
              <CheckCircleIcon style={{ fontSize: 30 }} />
            </span>
            <h2 className="font-display text-h3 font-semibold text-heading">
              Thanks — we&apos;ll be in touch
            </h2>
            <p className="mt-2 max-w-xs text-sm text-body">
              A member of our team will reach out shortly to schedule your
              demo.
            </p>
            <Button variant="secondary" className="mt-6" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <h2
              id="demo-modal-title"
              className="font-display text-h3 font-semibold text-heading sm:text-h2"
            >
              Book a demo
            </h2>
            <p className="mt-1.5 text-sm text-body">
              Tell us a bit about your team and we&apos;ll set up time to show
              you Superatom AI.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" name="name" type="text" autoComplete="name" placeholder="Jane Doe" required />
                <Field label="Email" name="email" type="email" autoComplete="email" placeholder="jane@company.com" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <PhoneField label="Mobile number" required />
                <Field label="Company" name="company" type="text" autoComplete="organization" placeholder="Acme Inc." required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Designation" name="designation" type="text" placeholder="VP, Supply Chain" required />
                <CountryField label="Country" name="country" required />
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-heading">
                  Message
                </span>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="What would you like to see in the demo?"
                  required
                  className={`${inputClasses} resize-none`}
                />
              </label>

              <label className="flex items-start gap-2.5 text-sm text-body">
                <input
                  type="checkbox"
                  name="agree"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-secondary-300 accent-primary-500"
                />
                <span>
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-medium text-primary-500 underline underline-offset-2 hover:text-primary-600"
                  >
                    Terms and Conditions
                  </a>
                  .
                </span>
              </label>

              <Button type="submit" variant="primary" className="w-full justify-center">
                Submit
              </Button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
