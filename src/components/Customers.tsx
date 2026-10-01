const customers = ["Customer A", "Customer B", "Customer C", "Customer D", "Customer E"];

function CustomerName({ name, hidden }: { name: string; hidden?: boolean }) {
  return (
    <span
      className="shrink-0 text-xl font-semibold tracking-tight text-caption/70"
      aria-hidden={hidden || undefined}
    >
      {name}
    </span>
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
            {customers.map((name) => (
              <CustomerName key={name} name={name} />
            ))}
            {customers.map((name) => (
              <CustomerName key={`${name}-dup`} name={name} hidden />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
