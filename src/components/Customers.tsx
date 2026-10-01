import bluelinx from "../assets/logos/bluelinx.png";
import mindlabs from "../assets/logos/mindlabs.png";
import seshaasai from "../assets/logos/seshaasai.png";

const customers: { name: string; logo: string }[] = [
  { name: "BlueLinx", logo: bluelinx },
  { name: "mindlabs.cloud", logo: mindlabs },
  { name: "Seshaasai", logo: seshaasai },
];

function CustomerLogo({ name, logo, hidden }: { name: string; logo: string; hidden?: boolean }) {
  return (
    <img
      src={logo}
      alt={name}
      aria-hidden={hidden || undefined}
      className="h-7 w-auto shrink-0 object-contain opacity-60 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0 sm:h-8"
    />
  );
}

export default function Customers() {
  return (
    <section className="border-y border-secondary-100 bg-page py-10">
      <div className="mx-auto flex max-w-[1920px] items-center gap-x-8 px-4 sm:gap-x-10 sm:px-10 xl:px-20">
        <span className="shrink-0 border-r border-secondary-200 pr-8 text-xl font-semibold text-heading sm:pr-10 sm:text-2xl">
          Trusted by
        </span>
        <div className="customers-marquee min-w-0 flex-1">
          <div className="customers-marquee-track">
            {customers.map((c) => (
              <CustomerLogo key={c.name} name={c.name} logo={c.logo} />
            ))}
            {customers.map((c) => (
              <CustomerLogo key={`${c.name}-dup`} name={c.name} logo={c.logo} hidden />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
