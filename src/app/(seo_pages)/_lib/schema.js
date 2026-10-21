/**
 * Reusable JSON-LD Schema generators for Oracle Eye Hospital landing pages
 * Schema types supported: Hospital / MedicalClinic, Physician, FAQPage, BreadcrumbList, MedicalProcedure
 */

export const HOSPITAL_INFO = {
  name: "Oracle Eye Hospital",
  legalName: "Oracle Eye Hospital Moradabad",
  url: "https://www.oracleeyehospital.com",
  logo: "https://www.oracleeyehospital.com/uploads/logos/232296ca-9c85-445b-b965-033a97fe7008.png",
  image: "https://www.oracleeyehospital.com/uploads/logos/232296ca-9c85-445b-b965-033a97fe7008.png",
  telephone: "+91 8006803111",
  alternatePhone: "+91 7500503111",
  email: "oracleeyehospital@gmail.com",
  priceRange: "$$",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, Credit Card, Debit Card, UPI, Net Banking, Cashless Insurance",
  address: {
    "@type": "PostalAddress",
    streetAddress: "491, Hi-Street, Near TDI City, Parampara, MDA",
    addressLocality: "Moradabad",
    addressRegion: "Uttar Pradesh",
    postalCode: "244001",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.8386,
    longitude: 78.7733,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "20:00",
    },
  ],
  sameAs: [
    "https://www.facebook.com/oracleeyehospital/",
    "https://www.instagram.com/oracleeyehospital/",
  ],
};

export const PRIMARY_DOCTORS = [
  {
    name: "Dr. Girjesh Kain",
    qualification: "MS (Ophthalmology), FICO",
    specialty: "Ophthalmologist & Cataract Surgeon",
    jobTitle: "Founder & Managing Director",
    url: "https://www.oracleeyehospital.com/girjesh-kain",
    image: "https://www.oracleeyehospital.com/Assets/img/team/3.png",
  },
  {
    name: "Dr. Rachana",
    qualification: "MBBS, MS (Ophthalmology)",
    specialty: "Ophthalmologist & Cataract Surgeon",
    jobTitle: "Senior Ophthalmologist",
    url: "https://www.oracleeyehospital.com/rachana",
    image: "https://www.oracleeyehospital.com/Assets/img/team/8.png",
  },
];

/**
 * Hospital / MedicalClinic Schema
 */
export function generateHospitalSchema(customDetails = {}) {
  return {
    "@context": "https://schema.org",
    "@type": ["Hospital", "MedicalClinic"],
    "@id": `${HOSPITAL_INFO.url}/#hospital`,
    name: HOSPITAL_INFO.name,
    legalName: HOSPITAL_INFO.legalName,
    url: HOSPITAL_INFO.url,
    logo: HOSPITAL_INFO.logo,
    image: HOSPITAL_INFO.image,
    telephone: HOSPITAL_INFO.telephone,
    email: HOSPITAL_INFO.email,
    priceRange: HOSPITAL_INFO.priceRange,
    currenciesAccepted: HOSPITAL_INFO.currenciesAccepted,
    paymentAccepted: HOSPITAL_INFO.paymentAccepted,
    address: HOSPITAL_INFO.address,
    geo: HOSPITAL_INFO.geo,
    openingHoursSpecification: HOSPITAL_INFO.openingHoursSpecification,
    sameAs: HOSPITAL_INFO.sameAs,
    medicalSpecialty: "Ophthalmology",
    ...customDetails,
  };
}

/**
 * Physician Schema
 */
export function generatePhysicianSchema(doctor = PRIMARY_DOCTORS[0]) {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": `${doctor.url || HOSPITAL_INFO.url}/#physician`,
    name: doctor.name,
    jobTitle: doctor.jobTitle || doctor.specialty,
    medicalSpecialty: doctor.specialty || "Ophthalmologist",
    description: `${doctor.name} is a specialist in ${doctor.specialty} with qualifications ${doctor.qualification} at ${HOSPITAL_INFO.name}.`,
    worksFor: {
      "@type": "Hospital",
      name: HOSPITAL_INFO.name,
      url: HOSPITAL_INFO.url,
    },
    telephone: HOSPITAL_INFO.telephone,
    address: HOSPITAL_INFO.address,
    ...(doctor.image ? { image: doctor.image } : {}),
    ...(doctor.url ? { url: doctor.url } : {}),
  };
}

/**
 * FAQPage Schema
 * Built dynamically from the same FAQ array used in Content.jsx to ensure 100% consistency
 */
export function generateFAQSchema(faqs = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question || faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer || faq.a,
      },
    })),
  };
}

/**
 * BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(breadcrumbs = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith("http") ? crumb.url : `${HOSPITAL_INFO.url}${crumb.url}`,
    })),
  };
}

/**
 * MedicalProcedure / WebPage Schema (procedure-specific enhancement)
 */
export function generateProcedureSchema({
  name,
  description,
  procedureType = "SurgicalProcedure",
  bodyLocation = "Eye",
  url,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name,
    description,
    procedureType,
    bodyLocation,
    url: url.startsWith("http") ? url : `${HOSPITAL_INFO.url}${url}`,
    howPerformed: "Outpatient micro-incision surgery with premium intraocular lens implantation under local anesthesia.",
    provider: {
      "@type": "Hospital",
      name: HOSPITAL_INFO.name,
      url: HOSPITAL_INFO.url,
      telephone: HOSPITAL_INFO.telephone,
    },
  };
}
