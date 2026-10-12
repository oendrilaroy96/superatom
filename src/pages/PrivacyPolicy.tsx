import SectionHeading from "../components/ui/SectionHeading";

const h2 = "mt-10 scroll-mt-28 font-display text-h3 font-semibold text-heading";
const h3 = "mt-6 font-display text-h5 font-semibold text-heading";
const p = "mt-4 text-sm leading-relaxed text-body";
const ul = "mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-body";
const link =
  "font-medium text-primary-500 underline underline-offset-2 hover:text-primary-600";

const tableOfContents = [
  { id: "what-we-collect", label: "What information do we collect?" },
  { id: "how-we-process", label: "How do we process your information?" },
  { id: "legal-bases", label: "What legal bases do we rely on to process your personal information?" },
  { id: "sharing", label: "When and with whom do we share your personal information?" },
  { id: "cookies", label: "Do we use cookies and other tracking technologies?" },
  { id: "social-logins", label: "How do we handle your social logins?" },
  { id: "retention", label: "How long do we keep your information?" },
  { id: "safety", label: "How do we keep your information safe?" },
  { id: "minors", label: "Do we collect information from minors?" },
  { id: "rights", label: "What are your privacy rights?" },
  { id: "dnt", label: "Controls for Do-Not-Track features" },
  { id: "us-residents", label: "United States residents – specific privacy rights" },
  { id: "updates", label: "Do we make updates to this notice?" },
  { id: "contact", label: "How can you contact us about this notice?" },
  { id: "review-data", label: "How can you review, update, or delete the data we collect from you?" },
];

export default function PrivacyPolicy() {
  return (
    <section className="py-[120px]">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            align="left"
            theme="light"
            eyebrow="Legal"
            eyebrowColor="primary"
            heading="Privacy Policy"
            description="Last updated: August 12, 2025"
          />

          <div className="mt-10">
            <p className="text-sm leading-relaxed text-body">
              This privacy notice for Superatom AI Private Limited
              (incorporated in India) and Superatom AI LLC (incorporated in
              the United States) — collectively referred to as
              &ldquo;Superatom&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
              &ldquo;our&rdquo; — describes how and why we might collect,
              store, use, and/or share (&ldquo;process&rdquo;) your
              information when you use our services (&ldquo;Services&rdquo;),
              such as when you:
            </p>
            <ul className={ul}>
              <li>
                Visit our website at{" "}
                <a href="https://superatom.ai" className={link}>
                  https://superatom.ai
                </a>{" "}
                or any website of ours that links to this privacy notice
              </li>
              <li>
                Use our GenUI / Data-to-Insights platform or related
                AI-powered application-building tools
              </li>
              <li>
                Engage with us in other related ways, including any sales,
                marketing, or events
              </li>
            </ul>
            <p className={p}>
              Questions or concerns? Reading this privacy notice will help
              you understand your privacy rights and choices. If you do not
              agree with our policies and practices, please do not use our
              Services. For further queries, contact us at{" "}
              <a href="mailto:privacy@superatom.ai" className={link}>
                privacy@superatom.ai
              </a>
              .
            </p>

            <h2 className={h2}>Summary of key points</h2>
            <ul className={ul}>
              <li>
                <strong className="text-heading">
                  What personal information do we process?
                </strong>{" "}
                When you visit, use, or navigate our Services, we may process
                personal information depending on how you interact with us,
                the choices you make, and the products and features you use.
              </li>
              <li>
                <strong className="text-heading">
                  Do we process sensitive personal information?
                </strong>{" "}
                We do not process sensitive personal information.
              </li>
              <li>
                <strong className="text-heading">
                  Do we receive any information from third parties?
                </strong>{" "}
                We do not receive any information from third parties.
              </li>
              <li>
                <strong className="text-heading">
                  How do we process your information?
                </strong>{" "}
                We process your information to provide, improve, and
                administer our Services, communicate with you, for security
                and fraud prevention, and to comply with law. We process
                your information only when we have a valid legal reason to
                do so.
              </li>
              <li>
                <strong className="text-heading">
                  When and with whom do we share personal information?
                </strong>{" "}
                We may share information in specific situations and with
                specific third parties (see Section 4).
              </li>
              <li>
                <strong className="text-heading">
                  How do we keep your information safe?
                </strong>{" "}
                We use organisational and technical processes to protect
                your personal information, but no method is 100% secure.
              </li>
              <li>
                <strong className="text-heading">
                  What are your rights?
                </strong>{" "}
                Depending on where you are located, privacy laws may give
                you certain rights regarding your personal information.
              </li>
              <li>
                <strong className="text-heading">
                  How do you exercise your rights?
                </strong>{" "}
                Contact us at{" "}
                <a href="mailto:privacy@superatom.ai" className={link}>
                  privacy@superatom.ai
                </a>
                .
              </li>
            </ul>

            <h2 className={h2}>Table of contents</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-body">
              {tableOfContents.map((item, i) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className={link}>
                    {i + 1}. {item.label}
                  </a>
                </li>
              ))}
            </ol>

            <h2 id="what-we-collect" className={h2}>
              1. What information do we collect?
            </h2>
            <h3 className={h3}>Personal information you disclose to us</h3>
            <p className={p}>
              We collect personal information that you voluntarily provide
              to us when you register for our platform, request product
              information, participate in demos, interact with our AI
              tools, or contact us for support.
            </p>
            <p className={p}>Examples include:</p>
            <ul className={ul}>
              <li>Name</li>
              <li>Email address</li>
              <li>Company name and job title / designation</li>
              <li>Communication preferences</li>
              <li>Resume or CV (when applying for a position)</li>
            </ul>
            <p className={p}>
              All personal information that you provide to us must be true,
              complete, and accurate. You must notify us of any changes to
              such personal information.
            </p>
            <h3 className={h3}>Information automatically collected</h3>
            <p className={p}>
              When you interact with our Services, certain information is
              collected automatically. This information does not reveal
              your specific identity but may include:
            </p>
            <ul className={ul}>
              <li>
                <strong className="text-heading">Usage Data:</strong>{" "}
                Features used, queries entered, session duration, and
                interaction patterns within the platform
              </li>
              <li>
                <strong className="text-heading">
                  Cookie &amp; Tracking Data:
                </strong>{" "}
                See Section 5 for details
              </li>
            </ul>

            <h2 id="how-we-process" className={h2}>
              2. How do we process your information?
            </h2>
            <p className={p}>
              We process your personal information for a variety of
              reasons, depending on how you interact with our Services,
              including:
            </p>
            <ul className={ul}>
              <li>
                <strong className="text-heading">
                  To deliver and maintain our Services
                </strong>{" "}
                — to create and manage your account, authenticate users, and
                ensure the platform functions correctly.
              </li>
              <li>
                <strong className="text-heading">
                  To respond to your inquiries and requests
                </strong>{" "}
                — to schedule demos, answer support tickets, and communicate
                with you about your account.
              </li>
              <li>
                <strong className="text-heading">
                  To send administrative information
                </strong>{" "}
                — to notify you of changes to our terms, conditions, and
                policies.
              </li>
              <li>
                <strong className="text-heading">
                  To improve our Services
                </strong>{" "}
                — to analyse usage patterns, diagnose technical issues, and
                develop new features.
              </li>
              <li>
                <strong className="text-heading">
                  To protect our Services
                </strong>{" "}
                — to monitor for fraud, abuse, and security threats, and to
                enforce our terms of service.
              </li>
              <li>
                <strong className="text-heading">
                  To comply with legal obligations
                </strong>{" "}
                — to respond to lawful requests from regulatory authorities
                and fulfil statutory requirements.
              </li>
              <li>
                <strong className="text-heading">
                  To process employment applications
                </strong>{" "}
                — to evaluate candidates who submit their information via
                our &ldquo;Work With Us&rdquo; form.
              </li>
            </ul>

            <h2 id="legal-bases" className={h2}>
              3. What legal bases do we rely on to process your personal
              information?
            </h2>
            <p className={p}>
              We only process your personal information when we have a
              valid legal basis to do so. Our legal bases vary depending on
              your location:
            </p>
            <h3 className={h3}>If you are in the EU / UK (GDPR / UK GDPR):</h3>
            <ul className={ul}>
              <li>
                <strong className="text-heading">Consent</strong> — where
                you have given us specific permission to process your data
                for a defined purpose (e.g., marketing emails). You may
                withdraw consent at any time.
              </li>
              <li>
                <strong className="text-heading">
                  Contract performance
                </strong>{" "}
                — where processing is necessary to fulfil a contract with
                you or to take pre-contractual steps at your request.
              </li>
              <li>
                <strong className="text-heading">Legal obligation</strong> —
                where we are required to process your data to comply with
                applicable law.
              </li>
              <li>
                <strong className="text-heading">
                  Legitimate interests
                </strong>{" "}
                — where processing is in our legitimate business interests
                (e.g., fraud prevention, platform security) and does not
                override your rights.
              </li>
            </ul>
            <h3 className={h3}>If you are in India (DPDP Act 2023):</h3>
            <ul className={ul}>
              <li>
                <strong className="text-heading">Consent</strong> — we
                obtain your free, specific, informed, and unambiguous
                consent before processing your personal data.
              </li>
              <li>
                <strong className="text-heading">Legitimate uses</strong> —
                as permitted under the Digital Personal Data Protection Act,
                2023, including compliance with legal obligations and
                performance of contracts.
              </li>
            </ul>
            <h3 className={h3}>If you are in the United States:</h3>
            <p className={p}>
              See Section 12 for state-specific privacy rights (California,
              Virginia, Colorado, and other applicable states).
            </p>

            <h2 id="sharing" className={h2}>
              4. When and with whom do we share your personal information?
            </h2>
            <p className={p}>
              We do not sell, trade, rent, or otherwise share your personal
              information with any third parties. Your data is used solely
              to provide and improve our Services and to communicate with
              you directly. We never disclose personal information to
              external organisations, advertisers, or data brokers.
            </p>

            <h2 id="cookies" className={h2}>
              5. Do we use cookies and other tracking technologies?
            </h2>
            <p className={p}>
              Yes. We use cookies and similar tracking technologies (web
              beacons, pixels) to collect and store certain information
              about how you interact with our Services.
            </p>
            <h3 className={h3}>Types of cookies we use:</h3>
            <ul className={ul}>
              <li>
                <strong className="text-heading">
                  Strictly necessary cookies
                </strong>{" "}
                — required for the platform to function (e.g.,
                authentication tokens, session management). These cannot be
                disabled.
              </li>
              <li>
                <strong className="text-heading">
                  Performance / analytics cookies
                </strong>{" "}
                — help us understand how visitors use our website (e.g.,
                page views, traffic sources). Data is aggregated and
                anonymous.
              </li>
              <li>
                <strong className="text-heading">Functional cookies</strong>{" "}
                — remember your preferences (e.g., language, region) to
                provide a personalised experience.
              </li>
              <li>
                <strong className="text-heading">
                  Targeting / marketing cookies
                </strong>{" "}
                — used only with your consent to deliver relevant
                advertising and measure campaign effectiveness.
              </li>
            </ul>
            <p className={p}>
              You can control cookies through your browser settings or via
              our cookie consent banner. Disabling certain cookies may
              affect the functionality of our Services. For more
              information, see our Cookie Policy or contact{" "}
              <a href="mailto:privacy@superatom.ai" className={link}>
                privacy@superatom.ai
              </a>
              .
            </p>

            <h2 id="social-logins" className={h2}>
              6. How do we handle your social logins?
            </h2>
            <p className={p}>
              Our Services offer the option to log in using your Microsoft
              Outlook account. If you choose to do so, we will receive
              certain profile information from Microsoft, which may include
              your name and email address.
            </p>
            <p className={p}>
              We use this information only to authenticate you and provide
              access to our Services. We do not control, and are not
              responsible for, how Microsoft collects or uses your personal
              information. We recommend you review{" "}
              <a
                href="https://privacy.microsoft.com/en-us/privacystatement"
                className={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Microsoft&apos;s Privacy Statement
              </a>{" "}
              to understand their practices.
            </p>

            <h2 id="retention" className={h2}>
              7. How long do we keep your information?
            </h2>
            <p className={p}>
              We retain your personal information only for as long as your
              account is active. When you delete your account, all
              associated personal information is permanently deleted from
              our systems immediately. We do not retain or store your data
              after account deletion for any purpose.
            </p>
            <ul className={ul}>
              <li>
                <strong className="text-heading">Account data</strong> —
                deleted immediately upon account closure.
              </li>
              <li>
                <strong className="text-heading">
                  Employment application data
                </strong>{" "}
                — retained for 6 months after the recruitment process
                concludes, or longer if required by law.
              </li>
            </ul>

            <h2 id="safety" className={h2}>
              8. How do we keep your information safe?
            </h2>
            <p className={p}>
              We implement appropriate and reasonable technical and
              organisational security measures designed to protect your
              personal information from unauthorised access, alteration,
              disclosure, or destruction. These measures include:
            </p>
            <ul className={ul}>
              <li>Encryption of data in transit (TLS/HTTPS) and at rest (AES-256)</li>
              <li>Role-based access controls and least-privilege principles</li>
              <li>Multi-factor authentication for platform access</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>SOC 2 compliance programme (currently in progress)</li>
              <li>Employee training on data privacy and security best practices</li>
            </ul>
            <p className={p}>
              However, no electronic transmission over the internet or
              information storage technology can be guaranteed to be 100%
              secure. While we strive to protect your personal information,
              we cannot guarantee that unauthorised third parties will never
              be able to defeat our security measures. You use our Services
              at your own risk. Please notify us immediately at{" "}
              <a href="mailto:security@superatom.ai" className={link}>
                security@superatom.ai
              </a>{" "}
              if you believe your interaction with us is no longer secure.
            </p>

            <h2 id="minors" className={h2}>
              9. Do we collect information from minors?
            </h2>
            <p className={p}>
              We do not knowingly collect data from or market to children
              under 18 years of age. Our Services are directed at business
              professionals and enterprises. If you become aware that a
              child has provided us with personal information without
              parental consent, please contact us at{" "}
              <a href="mailto:privacy@superatom.ai" className={link}>
                privacy@superatom.ai
              </a>
              . We will take steps to delete such information from our
              records.
            </p>

            <h2 id="rights" className={h2}>
              10. What are your privacy rights?
            </h2>
            <p className={p}>
              Depending on your location, you may have the following rights
              with respect to your personal information:
            </p>
            <ul className={ul}>
              <li>
                <strong className="text-heading">Right of access</strong> —
                request a copy of the personal data we hold about you.
              </li>
              <li>
                <strong className="text-heading">
                  Right to rectification
                </strong>{" "}
                — request correction of inaccurate or incomplete data.
              </li>
              <li>
                <strong className="text-heading">
                  Right to erasure (&ldquo;right to be forgotten&rdquo;)
                </strong>{" "}
                — request deletion of your personal data where there is no
                compelling reason to continue processing.
              </li>
              <li>
                <strong className="text-heading">
                  Right to restrict processing
                </strong>{" "}
                — request that we limit how we use your data while a
                dispute is resolved.
              </li>
              <li>
                <strong className="text-heading">
                  Right to data portability
                </strong>{" "}
                — receive your personal data in a structured, commonly
                used, machine-readable format.
              </li>
              <li>
                <strong className="text-heading">Right to object</strong> —
                object to processing based on legitimate interests or for
                direct marketing purposes.
              </li>
              <li>
                <strong className="text-heading">
                  Right to withdraw consent
                </strong>{" "}
                — where we rely on consent as a legal basis, you may
                withdraw it at any time without affecting the lawfulness of
                prior processing.
              </li>
            </ul>
            <p className={p}>
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:privacy@superatom.ai" className={link}>
                privacy@superatom.ai
              </a>
              . We will respond within 30 days (or as required by
              applicable law). We may need to verify your identity before
              processing your request.
            </p>
            <p className={p}>
              If you are not satisfied with our response, you have the
              right to lodge a complaint with your local data protection
              authority. In India, you may approach the Data Protection
              Board of India. In the EU/UK, you may contact your relevant
              supervisory authority.
            </p>

            <h2 id="dnt" className={h2}>
              11. Controls for Do-Not-Track features
            </h2>
            <p className={p}>
              Most web browsers and some mobile operating systems include a
              Do-Not-Track (&ldquo;DNT&rdquo;) feature that you can activate
              to signal your preference not to be tracked across websites.
              At this time, no uniform technology standard for recognising
              and implementing DNT signals has been finalised. Accordingly,
              we do not currently respond to browser DNT signals or any
              other mechanism that automatically communicates your choice
              not to be tracked online.
            </p>
            <p className={p}>
              If a standard for online tracking is adopted that we must
              follow in the future, we will update this notice accordingly.
              In the meantime, you can manage your cookie preferences
              directly through our cookie consent banner or your browser
              settings.
            </p>

            <h2 id="us-residents" className={h2}>
              12. United States residents – specific privacy rights
            </h2>
            <p className={p}>
              If you are a resident of California, Virginia, Colorado,
              Connecticut, Utah, or another US state with applicable
              privacy legislation, you may have additional rights beyond
              those described in Section 10.
            </p>
            <h3 className={h3}>California (CCPA / CPRA)</h3>
            <ul className={ul}>
              <li>
                Right to know what personal information we collect, use,
                disclose, and sell
              </li>
              <li>
                Right to delete personal information we hold about you
                (with certain exceptions)
              </li>
              <li>
                Right to opt out of the sale or sharing of personal
                information — we do not sell or share personal information
              </li>
              <li>
                Right to non-discrimination for exercising your privacy
                rights
              </li>
              <li>Right to correct inaccurate personal information</li>
              <li>
                Right to limit use of sensitive personal information — we
                do not process sensitive PI
              </li>
            </ul>
            <h3 className={h3}>
              Virginia (VCDPA), Colorado (CPA), Connecticut (CTDPA), Utah
              (UCPA)
            </h3>
            <ul className={ul}>
              <li>Right to access, correct, and delete personal data</li>
              <li>Right to data portability</li>
              <li>
                Right to opt out of targeted advertising and profiling
              </li>
            </ul>
            <p className={p}>
              To submit a request or designate an authorised agent, contact
              us at{" "}
              <a href="mailto:privacy@superatom.ai" className={link}>
                privacy@superatom.ai
              </a>{" "}
              with the subject line &ldquo;US Privacy Rights Request.&rdquo;
              We will verify your identity and respond within the timeframe
              required by applicable law.
            </p>

            <h2 id="updates" className={h2}>
              13. Do we make updates to this notice?
            </h2>
            <p className={p}>
              Yes, we may update this privacy notice from time to time to
              reflect changes in our practices, technology, legal
              requirements, or other factors. The updated version will be
              indicated by a revised &ldquo;Last updated&rdquo; date at the
              top of this page. If we make material changes, we will notify
              you either by prominently posting a notice of such changes or
              by directly sending you a notification.
            </p>
            <p className={p}>
              We encourage you to review this privacy notice periodically
              to stay informed about how we protect your information. Your
              continued use of our Services after the effective date of any
              changes constitutes your acceptance of the updated notice.
            </p>

            <h2 id="contact" className={h2}>
              14. How can you contact us about this notice?
            </h2>
            <p className={p}>
              If you have questions or comments about this notice, you may
              contact our Data Privacy Officer by email or post:
            </p>
            <p className={`${p} not-italic`}>
              Superatom AI Private Limited (India) &amp; Superatom AI LLC
              (United States)
              <br />
              Attn: Data Privacy Officer
              <br />
              Hyderabad, Telangana, India
              <br />
              Email:{" "}
              <a href="mailto:privacy@superatom.ai" className={link}>
                privacy@superatom.ai
              </a>
            </p>
            <p className={p}>
              We will acknowledge your request within 5 business days and
              aim to resolve all privacy-related inquiries within 30 days.
            </p>

            <h2 id="review-data" className={h2}>
              15. How can you review, update, or delete the data we collect
              from you?
            </h2>
            <p className={p}>
              Based on the applicable laws of your country, you may have
              the right to request access to the personal information we
              collect from you, change that information, or delete it. To
              request to review, update, or delete your personal
              information, please:
            </p>
            <ul className={ul}>
              <li>
                Email us at{" "}
                <a href="mailto:privacy@superatom.ai" className={link}>
                  privacy@superatom.ai
                </a>{" "}
                with the subject line &ldquo;Data Request – [Your
                Name]&rdquo;
              </li>
              <li>
                Specify whether you are requesting access, correction, or
                deletion
              </li>
              <li>Include sufficient information to verify your identity</li>
            </ul>
            <p className={p}>
              We will process your request in accordance with applicable
              data protection laws. Please note that certain data may be
              retained for legal, security, or legitimate business purposes
              even after a deletion request.
            </p>

            <p className="mt-10 text-sm text-caption">
              © 2026 Superatom AI Private Limited &amp; Superatom AI LLC.
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
