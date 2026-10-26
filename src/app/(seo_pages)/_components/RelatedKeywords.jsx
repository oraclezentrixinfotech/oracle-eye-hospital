import Link from "next/link";
import { Stethoscope, ArrowRight } from "lucide-react";

export default function RelatedKeywords({
  title = "Explore Related Eye Care Services in Moradabad",
  subtitle = "Discover advanced super-specialty eye treatments available at Oracle Eye Hospital:",
  links = [],
}) {
  return (
    <section className="mt-16 border-t border-gray-200 pt-12">
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-[#137C8B]">
          Comprehensive Specialty Care
        </span>
        <h2 className="mt-2 text-2xl font-bold text-[#0A2A33] sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm text-[#0A2A33]/70">{subtitle}</p>
        )}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#137C8B] hover:shadow-md"
          >
            <div className="flex items-center justify-between text-[#137C8B]">
              <Stethoscope className="h-5 w-5" />
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
            <h3 className="mt-3 text-base font-bold text-[#0A2A33] group-hover:text-[#137C8B]">
              {item.name}
            </h3>
            {item.desc && (
              <p className="mt-1 text-xs text-[#0A2A33]/70">{item.desc}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
