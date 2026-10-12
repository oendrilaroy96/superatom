import SectionHeading from "../components/ui/SectionHeading";

/**
 * Placeholder shell: the real text (matching https://superatom.ai/termsofservice
 * verbatim) hasn't been supplied yet. Once it is, replace the content block
 * below — reuse its heading/paragraph/list classes so the page's typography
 * stays consistent.
 */
export default function TermsOfService() {
  return (
    <section className="py-[120px]">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            align="left"
            theme="light"
            eyebrow="Legal"
            eyebrowColor="primary"
            heading="Terms of Service"
          />

          <div className="mt-10 space-y-4 text-sm leading-relaxed text-body">
            <p>
              Our Terms of Service content is being finalized here. In the meantime, reach out to{" "}
              <a
                href="mailto:contact@superatom.ai"
                className="font-medium text-primary-500 underline underline-offset-2 hover:text-primary-600"
              >
                contact@superatom.ai
              </a>{" "}
              with any questions.
            </p>
          </div>

          {/* Reference typography for the real terms text, once it's in:
              <h2 className="mt-10 font-display text-h3 font-semibold text-heading">Section heading</h2>
              <h3 className="mt-6 font-display text-h5 font-semibold text-heading">Sub-heading</h3>
              <p className="mt-4 text-sm leading-relaxed text-body">Paragraph text.</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-body"><li>List item.</li></ul>
          */}
        </div>
      </div>
    </section>
  );
}
