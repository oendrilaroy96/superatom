import LegalPageLayout, { LegalSection } from "../components/LegalPageLayout";

const h2 = "font-display text-h3 font-semibold text-heading";
const p = "mt-4 text-sm leading-relaxed text-body";
const ul = "mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-body";
const link =
  "font-medium text-primary-500 underline underline-offset-2 hover:text-primary-600";

const sections = [
  { id: "accounts", label: "1. Accounts & Registration" },
  { id: "use-of-services", label: "2. Use of Services" },
  { id: "ip", label: "3. Intellectual Property" },
  { id: "data-privacy", label: "4. Data & Privacy" },
  { id: "subscriptions", label: "5. Subscription & Payments" },
  { id: "liability", label: "6. Limitation of Liability" },
  { id: "governing-law", label: "7. Governing Law" },
  { id: "changes", label: "8. Changes to These Terms" },
];

const intro = (
  <p className="text-sm leading-relaxed text-body">
    By accessing or using any product or service offered by Superatom AI
    Private Limited (incorporated in India) and Superatom AI LLC
    (incorporated in the United States) — collectively referred to as
    &ldquo;Superatom&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
    &ldquo;our&rdquo; — you agree to be bound by these Terms &amp;
    Conditions. If you do not agree, please do not use our Services.
  </p>
);

const footer = (
  <div className="mt-10 border-t border-secondary-100 pt-6">
    <p className={`${p} mt-0`}>
      <strong className="text-heading">Questions about these Terms?</strong>
      <br />
      Email:{" "}
      <a href="mailto:support@superatom.ai" className={link}>
        support@superatom.ai
      </a>
    </p>
    <div className="mt-6 grid gap-6 sm:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.5px] text-caption">
          India
        </p>
        <p className="mt-1 text-sm leading-relaxed text-body">
          Superatom AI Private Limited
          <br />
          Hyderabad, Telangana, India
        </p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.5px] text-caption">
          United States
        </p>
        <p className="mt-1 text-sm leading-relaxed text-body">
          Superatom AI LLC
          <br />
          United States
        </p>
      </div>
    </div>
    <p className="mt-8 text-sm text-caption">
      © 2026 Superatom AI Private Limited &amp; Superatom AI LLC. All rights
      reserved.
    </p>
  </div>
);

export default function TermsOfService() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      heading="Terms & Conditions"
      intro={intro}
      sections={sections}
      footer={footer}
    >
      <LegalSection id="accounts">
        <h2 className={h2}>1. Accounts & Registration</h2>
        <ul className={ul}>
          <li>
            You must provide accurate, complete, and current information
            when creating an account and keep it up to date.
          </li>
          <li>
            You are responsible for maintaining the confidentiality of your
            login credentials and for all activity that occurs under your
            account.
          </li>
          <li>
            You must notify us immediately at{" "}
            <a href="mailto:support@superatom.ai" className={link}>
              support@superatom.ai
            </a>{" "}
            if you suspect any unauthorised access to your account.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="use-of-services">
        <h2 className={h2}>2. Use of Services</h2>
        <p className={p}>You agree not to:</p>
        <ul className={ul}>
          <li>
            Reverse-engineer, decompile, or attempt to extract the source
            code of any part of our platform.
          </li>
          <li>
            Transmit malware, viruses, or any other malicious or harmful
            code through our Services.
          </li>
          <li>
            Disrupt or interfere with the integrity, performance, or
            security of the Services or related systems.
          </li>
          <li>
            Attempt to gain unauthorised access to any account, system, or
            network connected to our Services.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="ip">
        <h2 className={h2}>3. Intellectual Property</h2>
        <p className={p}>
          All content, software, algorithms, trademarks, logos, and user
          interfaces that form part of the Services are the exclusive
          property of Superatom and its licensors. Nothing in these Terms
          transfers any intellectual property rights to you. You may not
          reproduce, modify, distribute, or create derivative works without
          our prior written consent.
        </p>
      </LegalSection>

      <LegalSection id="data-privacy">
        <h2 className={h2}>4. Data & Privacy</h2>
        <p className={p}>
          You retain ownership of all data you upload or connect to the
          platform (&ldquo;Customer Data&rdquo;). By using our Services,
          you grant Superatom a limited licence to process Customer Data
          solely to deliver the Services.
        </p>
        <p className={p}>
          We do not sell, trade, or share your data with third parties. Our
          full data practices are described in our{" "}
          <a href="/privacy-policy" className={link}>
            Privacy Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="subscriptions">
        <h2 className={h2}>5. Subscription & Payments</h2>
        <ul className={ul}>
          <li>
            Paid plans are billed on a recurring basis (monthly or annually)
            and renew automatically unless cancelled before the renewal
            date.
          </li>
          <li>
            All fees are non-refundable except as required by applicable
            law or as expressly stated in a separate agreement.
          </li>
          <li>
            We reserve the right to suspend access if payment is overdue by
            more than 15 days after written notice.
          </li>
          <li>
            For billing enquiries, contact{" "}
            <a href="mailto:support@superatom.ai" className={link}>
              support@superatom.ai
            </a>
            .
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="liability">
        <h2 className={h2}>6. Limitation of Liability</h2>
        <div className="mt-4 rounded-xl border border-accent-200 bg-accent-100/60 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.5px] text-accent-600">
            Read this carefully
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-heading">
            This section limits Superatom&apos;s legal liability to you. By
            using our Services you acknowledge and accept these
            limitations.
          </p>
        </div>
        <p className={p}>
          To the maximum extent permitted by applicable law, Superatom and
          its officers, directors, employees, and licensors shall not be
          liable for any indirect, incidental, special, consequential, or
          punitive damages — including loss of profits, data, goodwill, or
          business opportunities — arising out of or in connection with
          your use of the Services, even if we have been advised of the
          possibility of such damages. Our total aggregate liability shall
          not exceed the greater of (a) the fees you paid us in the twelve
          months preceding the claim or (b) USD $100. AI-generated insights
          are for informational purposes only; you are solely responsible
          for decisions made based on them.
        </p>
      </LegalSection>

      <LegalSection id="governing-law">
        <h2 className={h2}>7. Governing Law</h2>
        <p className={p}>
          The governing law depends on where you are located and which
          entity you are contracting with:
        </p>
        <ul className={ul}>
          <li>
            <strong className="text-heading">
              India and all other regions:
            </strong>{" "}
            These Terms are governed by the laws of India. Disputes shall
            be resolved through binding arbitration under the Arbitration
            and Conciliation Act, 1996, conducted in Hyderabad, Telangana,
            India.
          </li>
          <li>
            <strong className="text-heading">United States:</strong> For
            US-based customers, these Terms are governed by the laws of the
            State of Delaware, without regard to conflict of law
            principles. Disputes shall be resolved through binding
            arbitration under the rules of the American Arbitration
            Association (AAA).
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="changes">
        <h2 className={h2}>8. Changes to These Terms</h2>
        <p className={p}>
          We may update these Terms from time to time. Where changes are
          material, we will provide at least 30 days&apos; notice via
          email or a prominent notice on our website. Your continued use
          of the Services after the effective date of any update
          constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
