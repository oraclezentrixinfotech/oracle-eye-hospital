import HomeClient from "./HomeClient";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Oracle Eye Hospital - Best Eye Hospital in Moradabad | Cataract, LASIK & Retina Care",
  description:
    "Oracle Eye Hospital in Moradabad offers advanced cataract surgery, LASIK laser vision correction, retinal surgery, pediatric eye care, and glaucoma treatment. Book your appointment today.",
  keywords: [
    "eye hospital in Moradabad",
    "cataract surgery Moradabad",
    "LASIK Moradabad",
    "retina surgery",
    "glaucoma treatment",
    "pediatric eye care",
    "Oracle Eye Hospital",
  ],
  alternates: {
    canonical: "/",
  },
 
  icons: {
    icon: "/uploads/logos/c4550579-1574-4a3b-8255-8c0bd6c690ee.png",
  },
  openGraph: {
    title: "Oracle Eye Hospital - Best Eye Hospital in Moradabad",
    description: "Clear vision awaits at Oracle Eye Hospital. Advanced technology & compassionate eye care.",
    url: SITE_URL,
    siteName: "Oracle Eye Hospital",
    images: [{ url: "/uploads/logos/232296ca-9c85-445b-b965-033a97fe7008.png" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oracle Eye Hospital - Best Eye Hospital in Moradabad",
    description: "Clear vision awaits at Oracle Eye Hospital. Advanced technology & compassionate eye care.",
    images: ["/uploads/logos/232296ca-9c85-445b-b965-033a97fe7008.png"],
  },
};

export default function Page() {
  return <HomeClient />;
}