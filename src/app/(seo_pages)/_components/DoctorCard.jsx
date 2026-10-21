import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DoctorCard({
  name,
  role,
  qualification,
  image,
  bio,
  badgeText = "25,000+ Surgeries",
  profileHref,
  accentColor = "#E8A33D",
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2"
          style={{ borderColor: accentColor }}
        >
          <Image src={image} alt={`${name} - Eye Specialist at Oracle Eye Hospital`} fill className="object-cover" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{name}</h3>
          <p className="text-xs font-semibold" style={{ color: accentColor }}>
            {role}
          </p>
          <p className="text-xs text-white/70">{qualification}</p>
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-white/80 sm:text-sm">{bio}</p>
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
        <span className="text-[#CFE7EA]">{badgeText}</span>
        {profileHref && (
          <Link href={profileHref} className="hover:underline flex items-center gap-1 text-[#E8A33D]">
            View Profile <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
