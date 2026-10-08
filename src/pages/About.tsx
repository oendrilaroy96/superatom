import PersonIcon from "@mui/icons-material/Person";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import SectionHeading from "../components/ui/SectionHeading";

const teamMembers = [
  {
    name: "Prashanth Dharawath",
    role: "Co-Founder & CEO",
    linkedin: "https://www.linkedin.com/in/prashanth-dharawath-a15833369/",
  },
  {
    name: "Ashish Tandi",
    role: "Co-Founder & CTO",
    linkedin: "https://www.linkedin.com/in/ashishblessing/",
  },
  {
    name: "Sharath Bhat",
    role: "Co-Founder, GTM & Strategy",
    linkedin: "https://www.linkedin.com/in/sharathramakrishnabhat/",
  },
  {
    name: "Chetan Sai",
    role: "Co-Founder & Technical Delivery Lead",
    linkedin: "https://www.linkedin.com/in/chetan-sai-1720a8174/",
  },
  {
    name: "Gopinadh Boppudi",
    role: "Senior Software Engineer",
    linkedin: "https://www.linkedin.com/in/gopinadh-boppudi-8730751b0/",
  },
];

export default function About() {
  return (
    <section className="py-[120px]">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="max-w-2xl">
          <SectionHeading
            align="left"
            theme="light"
            eyebrow="About Superatom AI"
            eyebrowColor="accent"
            heading={
              <>
                Every great outcome starts with{" "}
                <span className="text-primary-500">an informed decision.</span>
              </>
            }
          />

          <div className="mt-6 space-y-4 text-p text-body">
            <p>
              Just as atoms combine to build everything we see,
              enterprises are built from thousands of decisions —
              what to buy, where to ship, who to trust.
            </p>
            <p className="font-semibold text-heading">
              Superatom AI is built to make those decisions smarter.
            </p>
            <p>
              We bring together the data, context, intelligence and
              actions needed to make each decision better, and connect
              thousands of those decisions into a smarter, more
              responsive enterprise.
            </p>
          </div>

          <p className="mt-6 font-display text-h3 font-semibold text-primary-500">
            Decide Fast. Decide Right. Every Time.
          </p>
          <p className="mt-2 text-h5 font-semibold uppercase tracking-[0.5px] text-caption">
            That&rsquo;s the idea behind Superatom.
          </p>
        </div>

        <div className="mt-24 sm:mt-32">
          {/* Matches the hero's 2-column split above (same width, same
              gap) instead of a separately centered, narrower container —
              keeps this section flush with the page's own padding. */}
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <SectionHeading
              align="left"
              theme="light"
              eyebrow="Our Team"
              eyebrowColor="primary"
              heading={
                <>
                  Experience that understands{" "}
                  <span className="text-primary-500">enterprise.</span>
                </>
              }
            />

            <div>
              <p className="text-p font-semibold text-heading">
                We bring years of enterprise systems building expertise
                to you through Superatom AI.
              </p>

              <div className="mt-4 space-y-4 text-p text-body">
                <p>
                  Superatom AI is built by people from successful, large
                  scale enterprises such as Blue Yonder, Pine Labs and
                  DHL. Together, we bring serial entrepreneurs, product
                  innovators, industry experts and proven operators
                  under one roof.
                </p>
                <p>
                  Our advisory board adds further depth through
                  experienced CIOs, CTOs, entrepreneurs and industry
                  leaders.
                </p>
              </div>

              <div className="mt-6 h-0.5 w-24 bg-primary-500" />

              <p className="mt-6 font-display text-h3 font-semibold text-heading">
                Deep experience. Diverse perspectives.
              </p>
              <p className="font-display text-h3 font-semibold text-primary-500">
                One mission: faster decisions at scale.
              </p>
            </div>
          </div>

          {/* Team directory: full-bleed photo placeholder up top, like
              real headshot cards, instead of a small avatar floating in
              a mostly-empty card. Each card links out to that person's
              LinkedIn profile. */}
          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {teamMembers.map((member) => (
              <a
                key={member.name}
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-2xl border border-secondary-100 bg-white transition-colors hover:border-primary-300"
              >
                <div className="relative flex aspect-square w-full items-center justify-center border-b border-dashed border-secondary-200 bg-page text-caption">
                  <PersonIcon style={{ fontSize: 40 }} />
                  <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-md transition-transform duration-200 group-hover:scale-110">
                    <LinkedInIcon style={{ fontSize: 18 }} />
                  </span>
                </div>
                <div className="p-5">
                  <p className="font-display text-h4 font-semibold text-heading">
                    {member.name}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-caption">
                    {member.role}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
