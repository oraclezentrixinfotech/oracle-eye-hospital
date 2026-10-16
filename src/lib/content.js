// All static website content lives here. Edit this file to change text, doctors, services, nav.
// DB-driven parts: appointments, contact messages, blogs, news (see prisma/schema.prisma).

export const SITE = {
  name: "Oracle Eye Hospital",
  tagline: "We preserve, enhance and protect your vision",
  address: "491, Hi-Street, Near TDI City, Parampara, MDA, Moradabad, Uttar Pradesh 244001, India",
  phones: ["+91 8006803111", "+91 7500503111"],
  helpline: "+91 8006803111",
  email: "oracleeyehospital@gmail.com",
  hours: "Mon – Sat, 10:00 AM – 8:00 PM",
  whatsapp: "918006803111",
  instagram: "https://www.instagram.com/oracleeyehospital/",
  facebook: "https://www.facebook.com/oracleeyehospital/",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Oracle+Eye+Hospital+491+Hi+Street+Near+TDI+City+Parampara+MDA+Moradabad+Uttar+Pradesh+244001",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export const STATS = [
  { value: "25,000+", label: "Surgeries done" },
  { value: "50,000+", label: "Patients treated" },
  { value: "15+", label: "Years of eye care" },
];

export const NAV = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    children: [
      { label: "Overview", href: "/overview" },
      { label: "Chairman's Message", href: "/chairman-message" },
      { label: "Board of Directors", href: "/board-of-directors" },
      { label: "Testimonials & Stories", href: "/testimonials" },
    ],
  },
  {
    label: "Clinic Team",
    children: [
      { label: "Doctors", href: "/doctor-team" },
      { label: "Optometrists", href: "/optometrist-team" },
    ],
  },
  { label: "Services", href: "/services", childrenFrom: "services" },
  {
    label: "Latest Updates",
    children: [
      { label: "Photo Gallery", href: "/photo-gallery" },
      { label: "Video Gallery", href: "/video-gallery" },
      { label: "Blogs", href: "/blog" },
      { label: "News & Events", href: "/news" },
    ],
  },
  {
    label: "Academic",
    children: [
      { label: "Optometry Internship", href: "/comprehensive-internship-in-optometry" },
      { label: "Awards", href: "/awards" },
      { label: "Publications", href: "/publications" },
    ],
  },
  { label: "Cashless", href: "/cashless-facility" },
  { label: "Charitable Wings", href: "/charitable-wings" },
  { label: "Contact Us", href: "/contact-us" },
];

export const DOCTORS = [
  {
    slug: "girjesh-kain",
    name: "Dr Girjesh Kain",
    title: "Founder & Managing Director",
    quals: "MS (Ophthalmology), FICO",
    photo: null, // e.g. "/images/doctors/girjesh-kain.jpg" (put file in /public/images/doctors)
    bio: "Dr Girjesh Kain is the founder and managing director of Oracle Eye Hospital. He is an ophthalmologist with an MS in Ophthalmology and a Fellowship of the International Council of Ophthalmology (FICO).",
  },
  {
    slug: "rachana",
    name: "Dr Rachana",
    title: "Ophthalmologist",
    quals: "MBBS, MS",
    photo: null,
    bio: "Dr Rachana is an ophthalmologist at Oracle Eye Hospital (MBBS, MS). Full profile will be updated here.",
  },
  {
    slug: "ramesh-kumar",
    name: "Dr Ramesh Kumar Shukla",
    title: "Glaucoma Surgeon",
    quals: "Glaucoma Surgeon",
    photo: null,
    bio: "Dr Ramesh Kumar Shukla is a glaucoma surgeon at Oracle Eye Hospital. Full profile will be updated here.",
  },
  {
    slug: "sujata-tomar",
    name: "Dr Sujata Tomar",
    title: "Ophthalmologist",
    quals: "Ophthalmologist",
    photo: null,
    bio: "Dr Sujata Tomar is an ophthalmologist at Oracle Eye Hospital. Full profile will be updated here.",
  },
];

// NOTE: Medical copy below is general patient information. Have your doctors review it before going live.
export const SERVICES = [
  {
    slug: "cataract",
    title: "Cataract Service",
    short: "Cataract is the clouding of the natural crystalline lens.",
    intro:
      "A cataract is a clouding of the eye's natural lens. It develops slowly, usually with age, and makes vision blurry, dull or glary. Surgery is the only way to remove a cataract, and modern microincision techniques make recovery quick for most patients.",
    signs: [
      "Cloudy, blurred or misty vision",
      "Glare or halos around lights, especially at night",
      "Colours looking faded or yellowish",
      "Frequent changes in glasses power",
      "Double vision in one eye",
    ],
    care: [
      "Detailed eye examination and measurements before surgery",
      "Microincision cataract surgery with a foldable lens implant",
      "Lens options discussed according to your lifestyle and needs",
      "Clear after-surgery instructions and follow-up visits",
    ],
  },
  {
    slug: "cornea-refractive",
    title: "Cornea and Refractive Services",
    short: "The cornea plays a crucial role in focusing light and maintaining clear vision.",
    intro:
      "The cornea is the clear front window of the eye and does most of its focusing. Corneal disease, infection or injury can reduce vision, while refractive errors (short sight, long sight, astigmatism) can often be corrected with glasses, lenses or laser.",
    signs: [
      "Red, painful or watery eye with light sensitivity",
      "Blurred vision that does not improve with glasses",
      "Wanting freedom from glasses or contact lenses",
      "Eye injury or something stuck in the eye",
    ],
    care: [
      "Corneal examination and mapping",
      "Treatment of corneal infections and injuries",
      "LASER eye correction for suitable candidates",
      "Honest advice on whether laser vision correction is right for you",
    ],
  },
  {
    slug: "computer-vision-syndrome",
    title: "Computer Vision Syndrome",
    short: "Computer vision syndrome (CVS) is a temporary eye vision problem resulting from screen use.",
    intro:
      "Long hours on computers, phones and tablets can strain the eyes. Computer vision syndrome is the group of symptoms that follow, and it is very common among students and office workers.",
    signs: [
      "Tired, burning or dry eyes at the end of the day",
      "Headache around the eyes or forehead",
      "Blurred vision after screen work",
      "Neck and shoulder pain",
    ],
    care: [
      "Complete eye check-up to find hidden power or focusing problems",
      "Correct glasses for screen distance when needed",
      "Simple habits: the 20-20-20 rule, blinking, screen height and lighting",
      "Lubricating drops only when your doctor advises them",
    ],
  },
  {
    slug: "dry-eyes",
    title: "Dry Eyes Clinic",
    short: "A dedicated clinic that goes beyond temporary fixes for dry eye.",
    intro:
      "Dry eye happens when tears are too few or evaporate too fast. It can cause burning, grittiness and even watering. Our Dry Eyes Clinic looks for the cause instead of only giving drops.",
    signs: [
      "Burning, stinging or gritty feeling",
      "Redness and heavy eyelids",
      "Watering, especially in wind or air-conditioning",
      "Blurring that clears after blinking",
    ],
    care: [
      "Tear film and eyelid gland assessment",
      "Treatment plan matched to the cause",
      "Eyelid hygiene and lifestyle guidance",
      "Regular follow-up to check progress",
    ],
  },
  {
    slug: "contact-lens",
    title: "Contact Lens Service",
    short: "Premium contact lenses fitted by experts for your daily comfort.",
    intro:
      "A good contact lens is one that is fitted to your eye, not just to your prescription. We help you choose, try and learn to care for lenses safely.",
    signs: [
      "You want an alternative to glasses",
      "Irregular cornea or high power where glasses are not enough",
      "Sports or work where glasses are inconvenient",
    ],
    care: [
      "Eye assessment and lens fitting",
      "Trial lenses before you commit",
      "Training on insertion, removal and hygiene",
      "Regular check-ups to keep your eyes healthy",
    ],
  },
  {
    slug: "myopia",
    title: "Myopia Clinic",
    short: "Myopia (nearsightedness) is becoming increasingly common among children worldwide.",
    intro:
      "Myopia usually starts in school-age children and tends to increase until the late teens. Higher myopia raises the risk of eye problems later in life, so slowing it down matters.",
    signs: [
      "Child squints or sits close to the board or TV",
      "Frequent headaches or eye rubbing",
      "Power increasing every year",
    ],
    care: [
      "Accurate measurement of power and eye length where needed",
      "Myopia-control options such as special lenses or drops, when suitable",
      "Advice on outdoor time and screen habits",
      "Regular reviews to track progress",
    ],
  },
  {
    slug: "pediatric-eye",
    title: "Pediatric Eye Service",
    short: "A squint (strabismus) develops when the eye muscles do not work in a balanced way.",
    intro:
      "Children's eyes are still developing, so early detection matters. We look after squint, lazy eye, children's glasses and other eye conditions in a friendly, child-comfortable way.",
    signs: [
      "One eye turning in, out, up or down",
      "Tilting the head to see",
      "Poor vision in one eye (lazy eye)",
      "Delayed reading or poor school performance",
    ],
    care: [
      "Child-friendly vision testing",
      "Glasses, patching or other therapy for lazy eye",
      "Squint evaluation and surgery when required",
      "Parent guidance at every step",
    ],
  },
  {
    slug: "orthoptics",
    title: "Orthoptics Service",
    short: "Specialized binocular vision care for better alignment and focus.",
    intro:
      "Orthoptics deals with how the two eyes work together. It helps with eye alignment, double vision and eye-muscle problems, often through guided exercises.",
    signs: [
      "Double vision",
      "Eye strain when reading",
      "Difficulty keeping the eyes together up close",
    ],
    care: [
      "Binocular vision and eye-movement assessment",
      "Eye exercise programs under supervision",
      "Prism glasses where suitable",
      "Support before and after squint surgery",
    ],
  },
  {
    slug: "vitreoretinal",
    title: "Vitreoretinal Service",
    short: "Diabetes is a leading cause of blindness in the world.",
    intro:
      "The retina is the light-sensing layer at the back of the eye. Diabetes, retinal tears or detachment and macular problems can threaten sight, often without pain. Early detection is the best protection.",
    signs: [
      "Sudden floaters or flashes of light",
      "A curtain or shadow over part of your vision",
      "Distorted or blurred central vision",
      "Diabetes or high blood pressure with no recent retina check",
    ],
    care: [
      "Dilated retina examination and imaging",
      "Retinal laser when indicated",
      "Retinal surgery services",
      "Diabetic eye screening and long-term follow-up",
    ],
  },
  {
    slug: "glaucoma",
    title: "Glaucoma Service",
    short: "Glaucoma results from damage to the optic nerve.",
    intro:
      "Glaucoma slowly damages the optic nerve, often with high eye pressure, and usually gives no early warning. Vision lost to glaucoma cannot be recovered, so regular testing is important, especially if it runs in your family.",
    signs: [
      "Usually none in the early stages",
      "Gradual loss of side vision",
      "Family history of glaucoma, age above 40, or diabetes",
    ],
    care: [
      "Eye pressure, optic nerve and visual field tests",
      "Eye drops, laser or surgery depending on the type",
      "Lifelong monitoring to protect remaining vision",
    ],
  },
];

export const FAQS = [
  {
    q: "What services does Oracle Eye Hospital provide?",
    a: "Comprehensive eye care: general check-ups, cataract surgery, LASIK and refractive procedures, glaucoma management, corneal treatment, pediatric ophthalmology, retina care and advanced diagnostic testing.",
  },
  {
    q: "Do I need an appointment before visiting?",
    a: "Walk-ins are welcome. We recommend booking an appointment so you wait less and see the specialist you need.",
  },
  {
    q: "How do I book an appointment?",
    a: "Use the booking form on this website, call our helpline, or visit the reception desk.",
  },
  {
    q: "What should I bring for my first consultation?",
    a: "A valid ID, any previous eye or medical reports, your current glasses or contact lenses, and a list of medicines you take.",
  },
];

// Sample testimonials - replace with real patient feedback (with permission).
export const TESTIMONIALS = [
  { name: "Rohit S.", city: "Moradabad", text: "My cataract surgery went smoothly. The doctors explained each step and the staff supported us throughout." },
  { name: "Neha V.", city: "Moradabad", text: "The consultation was well organised and unhurried. I understood my options before my laser procedure." },
  { name: "Amit G.", city: "Rampur", text: "Modern facilities and an experienced team. My vision has improved a lot after treatment." },
];

// Photo gallery: set `src` to a file in /public/images/gallery, e.g. "/images/gallery/1.jpg"
export const GALLERY = [
  { title: "Reception", src: null },
  { title: "Consultation room", src: null },
  { title: "Operation theatre", src: null },
  { title: "Diagnostics", src: null },
  { title: "Optical", src: null },
  { title: "Eye camp", src: null },
];

// Video gallery: add YouTube video IDs, e.g. { title: "Cataract surgery explained", id: "dQw4w9WgXcQ" }
export const VIDEOS = [];

export const TPA_LIST = [
  "Add your cashless / TPA / insurance partner names here (edit src/lib/content.js).",
];
