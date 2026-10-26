import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding doctors...");
  
  // Clean existing or insert doctors
  const doctorsData = [
    {
      name: "Dr. Girjesh Kain",
      role: "Founder & Managing Director",
      qualification: "MS (Ophthalmology), FICO",
      image: "/Assets/img/team/3.png",
      bio: "Dr. Kain is an internationally trained cataract and refractive surgeon with fellowship honors. He has spearheaded modern micro-incision surgery techniques in Moradabad for more than 15 years.",
      badgeText: "25,000+ Surgeries Done",
      profileHref: "/girjesh-kain",
      sortOrder: 1,
      active: true,
    },
    {
      name: "Dr. Rachana",
      role: "Senior Ophthalmologist",
      qualification: "MBBS, MS (Ophthalmology)",
      image: "/Assets/img/team/8.png",
      bio: "Dr. Rachana specializes in comprehensive eye diagnostics, complex cataract procedures, and customized intraocular lens selections to achieve optimal postoperative visual sharpness.",
      badgeText: "Cataract & Comprehensive Care",
      profileHref: "/doctor-team",
      sortOrder: 2,
      active: true,
    },
    {
      name: "Dr. Ramesh Kumar Shukla",
      role: "Senior Glaucoma Specialist",
      qualification: "MBBS, MS (Ophthalmology)",
      image: "/Assets/img/team/4.png",
      bio: "Specialist in early glaucoma detection, medical management, laser trabeculoplasty, and advanced filtration microsurgeries.",
      badgeText: "Glaucoma Specialist",
      profileHref: "/doctor-team",
      sortOrder: 3,
      active: true,
    },
    {
      name: "Dr. Sujata Tomar",
      role: "Consultant Ophthalmologist",
      qualification: "MBBS, MS (Ophthalmology)",
      image: "/Assets/img/team/5.png",
      bio: "Focuses on pediatric ophthalmology, strabismus evaluation, anterior segment conditions, and comprehensive family eye health.",
      badgeText: "Pediatric & General Eye Care",
      profileHref: "/doctor-team",
      sortOrder: 4,
      active: true,
    },
  ];

  const doctors = [];
  for (const doc of doctorsData) {
    const existing = await prisma.doctor.findFirst({ where: { name: doc.name } });
    if (existing) {
      doctors.push(existing);
    } else {
      const created = await prisma.doctor.create({ data: doc });
      doctors.push(created);
    }
  }
  console.log("Doctors seeded! Count:", doctors.length);

  const docIds = doctors.slice(0, 2).map((d) => d.id);

  console.log("Seeding sample SEO Page (cataract-surgery-in-moradabad)...");

  const samplePage = {
    slug: "cataract-surgery-in-moradabad",
    status: "published",
    metaTitle: "Cataract Surgery in Moradabad | Oracle Eye Hospital",
    metaDescription: "Looking for advanced cataract surgery in Moradabad? Oracle Eye Hospital offers stitchless phacoemulsification, robotic precision & premium IOLs. Book today!",
    keywords: "cataract surgery in moradabad, best cataract surgeon in moradabad, phaco surgery moradabad, eye hospital moradabad, motiyabind operation moradabad",
    canonicalUrl: "https://www.oracleeyehospital.com/services/cataract-surgery-in-moradabad",
    ogImage: "/Assets/img/services/cataract.jpg",
    heroBadge: "NABH-Accredited Eye Hospital in Moradabad",
    h1Title: "Advanced Cataract Surgery in Moradabad",
    heroSubtitle: "Restore crystal-clear vision with 10-minute micro-incision phacoemulsification surgery. 100% stitchless, painless, injection-free with premium US-FDA approved foldable IOLs.",
    heroImage: "/Assets/img/services/cataract.jpg",
    heroChips: [
      { label: "Recovery Time", value: "24–48 Hours" },
      { label: "Procedure Time", value: "10–15 Minutes" },
      { label: "Success Rate", value: "99.8% Clinical Safety" }
    ],
    ctaPrimaryText: "Book Consultation",
    ctaPhone: "+919458422606",
    sections: [
      {
        id: "overview",
        heading: "Overview of Cataract Care at Oracle Eye Hospital",
        type: "highlight",
        content: "Under the clinical leadership of Dr. Girjesh Kain (MS, FICO) and our team of senior ophthalmic surgeons, Oracle Eye Hospital has successfully performed over 25,000 eye surgeries in Western UP. We combine NABH-aligned clinical hygiene with world-class Alcon Centurion® phaco technology, ensuring every patient benefits from precision microsurgery with zero stitches, zero injections, and virtually zero downtime.",
        items: [
          "NABH-Accredited super-specialty eye care center in Moradabad",
          "25,000+ cataract surgeries successfully performed with high satisfaction",
          "Cashless insurance & TPA desk with 40+ empanelled healthcare partners",
          "Same-day day-care discharge within 2 hours of surgery"
        ]
      },
      {
        id: "understanding-cataract",
        heading: "What is a Cataract (Safed Motia) and Why Does It Occur?",
        type: "text",
        content: "Inside every human eye is a natural crystalline lens that focuses light rays directly onto the retina, producing sharp, vibrant images. Over time, natural proteins within this lens begin to denature and clump together, causing the lens to turn cloudy, opaque, and rigid. This progressive clouding is medically classified as a cataract, widely known in Hindi as Safed Motia.\n\nAs the cataract advances, incoming light is blocked or scattered, making everyday scenes appear as though you are looking through a frosted bathroom window or a smoggy haze. Eye drops, ayurvedic remedies, or updated spectacles cannot dissolve or reverse this protein opacity. Safe surgical removal of the clouded lens and replacement with a permanent artificial Intraocular Lens (IOL) is the only proven, permanent treatment.",
        items: []
      },
      {
        id: "warning-symptoms",
        heading: "Common Warning Symptoms of Cataract",
        type: "checklist",
        content: "Recognizing cataract symptoms early helps prevent visual strain and accidental injuries. Consult an eye specialist if you experience:",
        items: [
          "Cloudy, misty, or blurred vision that does not clear even after blinking",
          "Extreme sensitivity to bright glare and halo rings around automobile headlights during night driving",
          "Colors appearing washed out, faded, or tinted with a brownish-yellow hue",
          "Frequent, unexplained changes in your eyeglass or reading lens power",
          "Double vision (diplopia) or overlapping shadowy images in a single eye",
          "Difficulty performing fine tasks like reading small newsprint, threading a needle, or working on smartphones"
        ]
      },
      {
        id: "causes-risk-factors",
        heading: "Primary Causes and Risk Factors",
        type: "checklist",
        content: "While biological aging is the predominant cause of cataract development after age 45 to 50, several health and environmental factors can accelerate lens opacification:",
        items: [
          "Diabetes Mellitus: Fluctuating high blood glucose accelerates protein glycation inside the lens.",
          "Ultraviolet (UV) Exposure: Long-term direct exposure to sunlight without UV-blocking eyewear.",
          "Physical Trauma or Injury: Past eye impact, blunt trauma, or previous ocular inflammation.",
          "Corticosteroid Medications: Prolonged usage of oral, inhaled, or topical steroid medicines.",
          "Lifestyle & Diet: Excessive smoking, nutritional deficiencies, and chronic dehydration."
        ]
      },
      {
        id: "surgical-procedure",
        heading: "Advanced Phacoemulsification Surgical Technique",
        type: "numbered",
        content: "At Oracle Eye Hospital, our micro-incision cataract surgery (MICS) follows a standardized 5-step precision pathway designed for maximum patient comfort:",
        items: [
          "Topical Numbing: Anesthetic eye drops are administered — no painful injections around the eyeball.",
          "Microscopic Incision: A 1.8mm to 2.2mm self-sealing tunnel is sculpted with diamond precision.",
          "Ultrasonic Emulsification: The Alcon Centurion phaco handpiece gently liquefies the cloudy lens nucleus.",
          "Premium IOL Implantation: A flexible, foldable intraocular lens is injected into the natural capsular bag.",
          "Rapid Recovery: The microscopic valve seals naturally with fluid pressure — no sutures or dark patches needed."
        ]
      },
      {
        id: "lens-selection",
        heading: "Selecting the Right Intraocular Lens (IOL) for Your Lifestyle",
        type: "checklist",
        content: "During your pre-operative evaluation, optical biometry (IOL Master) accurately calculates the required lens power. We help you choose from US-FDA approved premium lenses:",
        items: [
          "Monofocal IOLs: Crystal clear distance vision. Reading glasses are required for close-up and phone use.",
          "Toric IOLs: Engineered specifically for patients with pre-existing corneal astigmatism alongside cataracts.",
          "Multifocal & Trifocal IOLs: Provide spectacle independence for distance, intermediate computer distance, and near reading.",
          "EDOF (Extended Depth of Focus) IOLs: Smooth continuous range of vision from intermediate to far without glare halos."
        ]
      },
      {
        id: "recovery-guidelines",
        heading: "Post-Operative Recovery & Care Guidelines",
        type: "text",
        content: "Visual recovery after micro-incision cataract surgery is remarkably rapid. Most patients return to their routine sedentary activities within 24 to 48 hours.\n\nKey care tips during the first 2 weeks include: Instilling prescribed antibiotic eye drops on schedule, wearing protective eyewear outdoors, avoiding splashing unboiled tap water into the operated eye, and avoiding lifting heavy weights or rubbing the eye.",
        items: []
      },
      {
        id: "cost-insurance",
        heading: "Affordable Cataract Surgery Cost & Cashless Insurance",
        type: "highlight",
        content: "Oracle Eye Hospital is committed to transparent, ethical, and affordable healthcare in Moradabad. We offer transparent package pricing with no hidden charges. Our dedicated insurance helpdesk provides 100% cashless treatment across Ayushman Bharat, all major private insurers (Star Health, Care, HDFC ERGO, ICICI Lombard), and corporate TPAs.",
        items: [
          "Cashless hospitalization support with instant pre-authorization",
          "0% EMI payment options available for premium multifocal and toric lens packages",
          "Transparent package cost covering pre-op testing, surgery, lens, and initial follow-up visits"
        ]
      }
    ],
    doctorIds: docIds,
    faqs: [
      {
        question: "What is the recovery time after cataract surgery in Moradabad?",
        answer: "Most patients notice improved vision within 24 to 48 hours following micro-incision phacoemulsification surgery. You can resume basic indoor activities, walking, and reading the very next day. Complete corneal stabilization and final lens settling generally take 2 to 4 weeks."
      },
      {
        question: "Is cataract surgery painful or does it require injections?",
        answer: "No. At Oracle Eye Hospital in Moradabad, modern cataract surgery is performed using topical anesthesia (numbing eye drops). It is completely stitchless, blade-free, and injection-free for the vast majority of cases. Patients feel virtually no pain during the 10 to 15 minute procedure."
      },
      {
        question: "What types of intraocular lenses (IOLs) are available?",
        answer: "We provide a comprehensive range of US-FDA approved foldable intraocular lenses, including Monofocal IOLs, Toric IOLs, Multifocal & Trifocal IOLs, and Extended Depth of Focus (EDOF) lenses."
      },
      {
        question: "Is cataract surgery covered by health insurance and cashless TPA in Moradabad?",
        answer: "Yes. Oracle Eye Hospital is empaneled with major health insurance companies, TPAs (Third Party Administrators), and corporate healthcare panels. Our dedicated cashless insurance helpdesk assists you with instant eligibility verification, pre-authorization, and paperless claims."
      },
      {
        question: "How do I know if I need cataract surgery?",
        answer: "If you experience blurred or foggy vision, sensitivity to glare from headlights during night driving, fading colors, double vision in one eye, or rapid changes in spectacle power, you should undergo a comprehensive slit-lamp evaluation. Surgery is recommended when the cataract begins interfering with your daily lifestyle."
      },
      {
        question: "Why is phacoemulsification better than traditional cataract surgery?",
        answer: "Phacoemulsification uses gentle ultrasonic energy through a microscopic 1.8 mm to 2.2 mm incision to emulsify and remove the clouded lens. Because the opening is self-sealing, no stitches are required, induced astigmatism is minimized, infection risks are extremely low, and visual recovery is significantly faster."
      },
      {
        question: "Can both eyes be operated on the same day?",
        answer: "For patient safety and optimal post-operative tracking, international ophthalmology guidelines recommend operating on one eye at a time. Typically, the second eye is scheduled within 3 to 7 days once the first eye shows healthy healing and stable vision."
      }
    ],
    relatedIds: []
  };

  const existingSeoPage = await prisma.seoPage.findUnique({ where: { slug: samplePage.slug } });
  if (existingSeoPage) {
    await prisma.seoPage.update({
      where: { slug: samplePage.slug },
      data: samplePage
    });
    console.log("Updated existing sample SEO page!");
  } else {
    await prisma.seoPage.create({
      data: samplePage
    });
    console.log("Created sample SEO page!");
  }
}

seed().catch(console.error).finally(() => prisma.$disconnect());
