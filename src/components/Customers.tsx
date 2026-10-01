const customers = ["Customer A", "Customer B", "Customer C", "Customer D", "Customer E"];

export default function Customers() {
  return (
    <section className="border-y border-secondary-100 bg-page py-10">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-10 xl:px-20">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-6 sm:gap-x-10">
          <span className="shrink-0 border-r border-secondary-200 pr-8 text-base font-medium text-heading sm:pr-10">
            Trusted by
          </span>
          {customers.map((name) => (
            <span
              key={name}
              className="text-xl font-semibold tracking-tight text-caption/70"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
