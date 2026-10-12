// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const settingsData = [
  { key: "phone", value: "+91 8006803111" },
  { key: "whatsapp", value: "+91 8006803111" },
  { key: "email", value: "oracleeyehospital@gmail.com" },
  {
    key: "address",
    value: "491, Hi-Street, Near TDI City, Parampara, MDA, Moradabad, Uttar Pradesh 244001, India",
  },
  { key: "working_hours", value: "Mon – Sat, 10:00 AM – 8:00 PM" },
  { key: "facebook", value: "https://www.facebook.com/oracleeyehospital/" },
  { key: "instagram", value: "https://www.instagram.com/oracleeyehospital/" },
];

const videosData = [
  {
    url: "https://www.youtube.com/embed/KcCaoajtapU?si=oFKhAvDv7InXVSAj",
    title: "Oracle Eye Hospital",
    active: true,
    sortOrder: 1,
  },
  {
    url: "https://www.youtube.com/embed/tvylDHAaorQ?si=rbZFlqdPnCLTMFqR",
    title: "Inside Oracle Eye Hospital's Advanced Modular Operation Theatre | Safe & Advanced Eye Surgery",
    active: true,
    sortOrder: 2,
  },
  {
    url: "https://www.youtube.com/embed/8arwVyrtdZw?si=7cPWGXHz8Vtc7aOW",
    title: "Take a Tour of Oracle Eye Hospital | Advanced Eye Care Under One Roof",
    active: true,
    sortOrder: 3,
  },
  {
    url: "https://www.youtube.com/embed/4TOCbKpUBDU?si=HL5fJJV2V325YcGu",
    title: "ओरेकल आई हॉस्पिटल, मुरादाबाद द्वारा नि:शुल्क नेत्र शिविर | Free Eye Camp in Moradabad",
    active: true,
    sortOrder: 4,
  },
  {
    url: "https://www.youtube.com/embed/2E-B5omfJsc?si=v_heNRcuIXphhIbl",
    title: "Seeing Black Spots or Floaters? It Could Be a Retinal Warning Sign | Retina Check-Up",
    active: true,
    sortOrder: 5,
  },
  {
    url: "https://www.youtube.com/embed/H5O9c5Lg8GI?si=ka43L2cd9yrv7cDp",
    title: "Presenting Our AI Room | Advanced AI Technology at Oracle Eye Hospital",
    active: true,
    sortOrder: 6,
  },
  {
    url: "https://www.youtube.com/embed/uaUk-SU30T8?si=XzAN7Bc4lQde9WCv",
    title: "Precision at Its Finest – Redefining Eye Care with Our Fully Equipped Modular OT",
    active: true,
    sortOrder: 7,
  },
  {
    url: "https://www.youtube.com/embed/-Pl4XbKE0-w?si=HjKeK0Hunns8nSim",
    title: "नि:शुल्क नेत्र जांच शिविर में 350 से अधिक मरीजों का इलाज 74 मरीजों का होगा मुफ्त मोतियाबिंद ऑपरेशन",
    active: true,
    sortOrder: 8,
  },
  {
    url: "https://www.youtube.com/embed/KtFgHLQ2HRU?si=lUd7QTbkugGI6qLu",
    title: "मरीजों की प्रतिक्रिया: आँख के ऑपरेशन का अनुभव",
    active: true,
    sortOrder: 9,
  },
  {
    url: "https://www.youtube.com/embed/Ma6-utJi50o?si=dgfx_h5QlUY1SjZL",
    title: "Understanding Dark Circles Under the Eyes: Causes and Remedies",
    active: true,
    sortOrder: 10,
  },
  {
    url: "https://www.youtube.com/embed/jfk1W34q-Jo?si=G4S87-bUKuGNkc4F",
    title: "Benefits of getting Eye examination",
    active: true,
    sortOrder: 11,
  },
  {
    url: "https://www.youtube.com/embed/MxyRkDhuYzs?si=Mti019TIBijrSdZo",
    title: "Topical Phaco Cataract Surgery",
    active: true,
    sortOrder: 12,
  },
  {
    url: "https://www.youtube.com/embed/_KEUFO_f0g8?si=TwRWvgXPO4SJmYNW",
    title: "Does your doctor advised for retinal check up",
    active: true,
    sortOrder: 13,
  },
  {
    url: "https://www.youtube.com/embed/dWOdOA2ojks?si=DQrUdzRYV_NN_zXC",
    title: "Are you Suffering from Cataract?",
    active: true,
    sortOrder: 14,
  },
  {
    url: "https://www.youtube.com/embed/6SzQmwJNtXw?si=QBXWbHfT3Zy5rVn3",
    title: "Patient smiles light up our world! - Amritpal Singh's heartwarming review",
    active: true,
    sortOrder: 15,
  },
  {
    url: "https://www.youtube.com/embed/o7wu1-YWB9w?si=HqU_wc1-54qAMIkJ",
    title: "Exploring Glaucoma: In-depth Q&A with Dr. Girjesh Kain",
    active: true,
    sortOrder: 16,
  },
];

const photosData = [
  {
    title: "Oracle Eye Hospital Main Facility",
    image: "/uploads/photogallery/16567d17-c657-460d-9dae-98d91660fb1a.jpg",
    status: true,
    sortOrder: 1,
  },
  {
    title: "Hospital Interior & Patient Lounge",
    image: "/uploads/photogallery/543ba95a-8e05-4a52-85bb-18a72382f33d.jpg",
    status: true,
    sortOrder: 2,
  },
  {
    title: "Modular Operation Theatre",
    image: "/uploads/photogallery/6af6a1d9-299e-42db-a62f-07b087fcaf95.jpg",
    status: true,
    sortOrder: 3,
  },
  {
    title: "Advanced Eye Diagnostics & Retina Wing",
    image: "/uploads/photogallery/72962093-fd19-48de-81c4-46b40cc10465.jpg",
    status: true,
    sortOrder: 4,
  },
  {
    title: "Consultation & OPD Suites",
    image: "/uploads/photogallery/9447c227-2ed2-4aaf-965b-f429d9b3bff3.jpg",
    status: true,
    sortOrder: 5,
  },
  {
    title: "Optical & Eyewear Center",
    image: "/uploads/photogallery/8cf74d59-9437-4cb4-8518-10fe14e60eca.jpg",
    status: true,
    sortOrder: 6,
  },
];

const newsPostsData = [
  {
    type: "NEWS",
    slug: "dr-girjesh-and-his-team-successfully-perform-cataract-surgery-on-six-year-old-sandhya",
    title: "Dr. Girjesh and His Team Successfully Perform Cataract Surgery on Six-Year-Old Sandhya",
    excerpt: "Dr. Girjesh and his surgical team at Oracle Eye Hospital successfully performed a delicate pediatric cataract surgery on six-year-old Sandhya.",
    body: "Dr. Girjesh Kain and his dedicated ophthalmology surgical team at Oracle Eye Hospital successfully performed a rare and complex pediatric cataract surgery on six-year-old Sandhya.\n\nPediatric cataracts require immense precision and state-of-the-art modular OT equipment. The surgery went smoothly, and following a complete recovery, young Sandhya has regained clear vision.\n\nOur team is committed to providing cutting-edge eye care solutions to patients across all age groups in Moradabad and Western Uttar Pradesh.",
    image: "/uploads/news/8a60664c-4646-40bf-bea1-0bdce3d72e86.jpeg",
    published: true,
  },
  {
    type: "NEWS",
    slug: "oracle-eye-care-cataract-surgery-new-era-2022",
    title: "ओरेक्ल आई केयर अस्पताल ने मोतियाबिंद सर्जरी के क्षेत्र में एक नए युग की शुरुआत की (30-07-2022)",
    excerpt: "ओरेकल आई केयर अस्पताल मुरादाबाद ने उन्नत फेको तकनीक और मॉड्यूलर ओटी के साथ मोतियाबिंद सर्जरी में नई उपलब्धि हासिल की।",
    body: "ओरेकल आई केयर अस्पताल मुरादाबाद ने उन्नत फेको तकनीक और विश्वस्तरीय मॉड्यूलर ऑपरेशन थिएटर के साथ मोतियाबिंद सर्जरी के क्षेत्र में एक नए युग की शुरुआत की है।\n\nडॉ. गिरजेश कैन ने बताया कि आधुनिक फेको सर्जरी में बिना टांके और बिना पट्टी के ऑपरेशन किया जाता है जिससे मरीज को बहुत कम समय में सामान्य जीवन में लौटने का मौका मिलता है।\n\nअस्पताल की यह पहल मुरादाबाद और आस-पास के क्षेत्रों के मरीजों को उच्चतम गुणवत्ता वाली नेत्र चिकित्सा उपलब्ध कराने के प्रति समर्पित है।",
    image: "/uploads/news/9830a485-88e3-4478-bdef-877c03c8d67a.jpeg",
    published: true,
  },
  {
    type: "NEWS",
    slug: "first-monofocal-lens-implantation-moradabad-dr-girjesh",
    title: "जनपद में पहली बार नेत्र सर्जन डॉ. गिरजेश कैन ने किया मोनोफोकल लेंस का सफल प्रत्यारोपण",
    excerpt: "वरिष्ठ नेत्र सर्जन डॉ. गिरजेश कैन ने मुरादाबाद जनपद में आधुनिक मोनोफोकल लेंस का सफल प्रत्यारोपण कर नई मिसाल कायम की।",
    body: "वरिष्ठ नेत्र सर्जन डॉ. गिरजेश कैन ने मुरादाबाद जनपद में पहली बार आधुनिक मोनोफोकल लेंस का सफल प्रत्यारोपण कर नेत्र चिकित्सा के क्षेत्र में एक ऐतिहासिक उपलब्धि हासिल की।\n\nमरीज मोतियाबिंद से गंभीर रूप से पीड़ित था। सफल सर्जरी के बाद मरीज की दृष्टि पूरी तरह सामान्य हो गई।\n\nडॉ. गिरजेश ने कहा कि अत्याधुनिक तकनीक से लैस ओरेकल आई हॉस्पिटल क्षेत्र के लोगों को महानगरों जैसी सुविधाएं प्रदान कर रहा है।",
    image: "/uploads/news/4c1beca8-53d4-4787-ba66-000042fea3bb.jpeg",
    published: true,
  },
  {
    type: "NEWS",
    slug: "rotary-international-supports-covid-19-response",
    title: "Rotary International Supports COVID-19 Response with PPE Kits, Sanitizers and Masks",
    excerpt: "Rotary International partnered with Oracle Eye Hospital to distribute healthcare kits, masks, and sanitizers during the COVID-19 emergency.",
    body: "Rotary International collaborated closely with Oracle Eye Hospital to support healthcare workers and the community with vital medical supplies, including PPE kits, sanitizers, and masks.\n\nDr. Girjesh Kain commended the collective efforts of the Rotary volunteers and hospital staff in ensuring safety and maintaining critical eye care emergencies throughout the challenging times.",
    image: "/uploads/news/e21eda36-2bd8-4961-bbf1-59613bc68c85.jpeg",
    published: true,
  },
  {
    type: "NEWS",
    slug: "eye-health-awareness-impact-of-online-classes-on-childrens-vision",
    title: "Eye Health Awareness: Experts Highlight the Impact of Online Classes on Children’s Vision",
    excerpt: "Ophthalmology experts at Oracle Eye Hospital share guidelines to prevent digital eye strain in school children.",
    body: "With increasing digital screen exposure and online classes, ophthalmologists at Oracle Eye Hospital highlighted the rising prevalence of digital eye strain and dry eyes among children.\n\nParents are advised to enforce the 20-20-20 rule, maintain proper screen distance, encourage outdoor activities, and schedule periodic pediatric eye examinations.",
    image: "/uploads/news/de360a9c-5195-467d-9e40-bdf67b234c89.jpeg",
    published: true,
  },
  {
    type: "NEWS",
    slug: "oracle-eye-care-organizes-eye-wellness-camp-at-ptc",
    title: "Oracle Eye Care Organizes Eye Wellness Awareness Camp at PTC",
    excerpt: "A comprehensive free eye screening and wellness camp was organized for police personnel and trainees at PTC Moradabad.",
    body: "Oracle Eye Care organized a specialized Eye Wellness Awareness Camp at PTC Moradabad. Over 300 police personnel and trainees underwent visual acuity tests, intraocular pressure checks, and refraction tests.\n\nFree consultations and medicines were provided under the supervision of Dr. Girjesh Kain and the clinical optometrist team.",
    image: "/uploads/news/34869b18-5e84-4fe2-be98-d8e958a36d2b.jpeg",
    published: true,
  },
  {
    type: "NEWS",
    slug: "dr-girjesh-kain-creates-history-with-advanced-edof-lens-implantation",
    title: "Dr. Girjesh Ken Creates History with Advanced EDOF Lens Implantation",
    excerpt: "Moradabad's first Extended Depth of Focus (EDOF) intraocular lens was successfully implanted at Oracle Eye Hospital.",
    body: "In a landmark achievement for Western UP, Dr. Girjesh Kain performed an Extended Depth of Focus (EDOF) lens implantation during cataract surgery.\n\nEDOF lenses provide seamless intermediate and distant vision without the glare or halo issues frequently associated with earlier multi-focal designs, giving patients spectacle freedom.",
    image: "/uploads/news/17aecb9e-f4e9-4a58-9cfe-d9583f3563c9.jpeg",
    published: true,
  },
  {
    type: "NEWS",
    slug: "advanced-eye-care-successful-edof-intraocular-lens-moradabad",
    title: "Advanced Eye Care: Successful Implantation of EDOF Intraocular Lens in Moradabad",
    excerpt: "Oracle Eye Hospital continues to pioneer premium IOL surgeries with excellent visual outcomes.",
    body: "The advanced cataract surgical unit at Oracle Eye Hospital performed another successful EDOF IOL implantation. Patients can now experience clear continuous vision across all daily tasks.\n\nOracle Eye Hospital continues to bring the latest global ophthalmology technologies to Moradabad.",
    image: "/uploads/news/88ee614d-9b81-47ed-ac83-c450486d2955.jpeg",
    published: true,
  },
  {
    type: "NEWS",
    slug: "free-eye-screening-camp-conducted-for-400-patients-moradabad",
    title: "Free Eye Screening Camp Conducted for 400+ Patients in Moradabad (2018)",
    excerpt: "Over 400 underprivileged patients received complimentary eye examinations and subsidized surgeries.",
    body: "As part of our charitable outreach initiatives, Oracle Eye Hospital organized a massive free eye screening camp. Over 400 patients were examined, 74 were identified for free cataract surgery, and free spectacles were distributed to needy individuals.",
    image: "/uploads/news/76fd57b8-a207-4d6c-b552-aee0caa8bc7a.jpeg",
    published: true,
  },
  {
    type: "NEWS",
    slug: "ben-franklin-eyewear-now-available-at-oracle-hospital",
    title: "Ben Franklin Eyewear Now Available at Oracle Hospital",
    excerpt: "Leading optical brand Ben Franklin launches an exclusive outlet inside Oracle Eye Hospital.",
    body: "Oracle Eye Hospital has partnered with premium optical retail chain Ben Franklin to bring branded frames, sunglasses, and precision ophthalmic lenses under one roof for patient convenience.",
    image: "/uploads/news/3f91fc81-65ae-46a4-8a06-7ad9923d54a2.png",
    published: true,
  },
  {
    type: "NEWS",
    slug: "inauguration-at-oracle-eye-hospital",
    title: "Inauguration at Oracle Eye Hospital",
    excerpt: "Oracle Eye Hospital inaugurated its expanded modular OT complex and retina diagnostics wing.",
    body: "With dignitaries and eminent doctors in attendance, Oracle Eye Hospital inaugurated its newly expanded facility featuring modular OTs, HEPA filter air purification, and cutting-edge vitreoretinal surgical suites.",
    image: "/uploads/news/5ed99aaf-b1ca-4658-9914-9ad193970ce8.png",
    published: true,
  },
];

const blogPostsData = [
  {
    type: "BLOG",
    slug: "understanding-cataract-symptoms-phaco-surgery",
    title: "Understanding Cataract: Causes, Symptoms, and Modern Phaco Surgery",
    excerpt: "Learn how cataracts develop and why modern micro-incision phacoemulsification offers quick, stitchless vision recovery.",
    body: "A cataract is a cloudy area in the lens of your eye that leads to a decrease in vision.\n\nCommon symptoms include blurred vision, difficulty seeing in dim light, sensitivity to bright lights, and colors appearing faded.\n\nModern cataract surgery at Oracle Eye Hospital uses ultrasonic phacoemulsification technology to remove the cloudy lens through a micro-incision and replace it with a premium intraocular lens (IOL). Recovery is fast, painless, and does not require bandages.",
    image: "/uploads/news/8a60664c-4646-40bf-bea1-0bdce3d72e86.jpeg",
    published: true,
  },
  {
    type: "BLOG",
    slug: "20-20-20-rule-for-screen-time",
    title: "The 20-20-20 rule for tired eyes",
    excerpt: "A simple habit that eases eye strain from phones and computers.",
    body: "Long hours on screens make us blink less, which dries and tires the eyes.\n\nEvery 20 minutes, look at something about 20 feet (6 metres) away for at least 20 seconds. Blink fully and often. Keep the screen slightly below eye level and avoid glare.\n\nIf strain, headaches or blurred vision continue, get your eyes checked. You may need glasses or treatment for dry eye.",
    image: "/uploads/news/de360a9c-5195-467d-9e40-bdf67b234c89.jpeg",
    published: true,
  },
  {
    type: "BLOG",
    slug: "why-diabetics-need-yearly-retina-check",
    title: "Why people with diabetes need a yearly retina check",
    excerpt: "Diabetic eye disease often has no early symptoms, so screening matters.",
    body: "High blood sugar can slowly damage the tiny blood vessels in the retina. In the early stages you may notice nothing at all.\n\nA dilated retina examination once a year can find changes early, when treatment works best. Keeping blood sugar, blood pressure and cholesterol under control also protects your eyes.",
    image: "/uploads/news/17aecb9e-f4e9-4a58-9cfe-d9583f3563c9.jpeg",
    published: true,
  },
];

async function main() {
  console.log("Starting database seeding...");

  // 1. Settings
  for (const s of settingsData) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`✓ Seeded ${settingsData.length} settings`);

  // 2. Videos (check by URL so no duplicate)
  let videoCount = 0;
  for (const v of videosData) {
    const existing = await prisma.video.findFirst({ where: { url: v.url } });
    if (!existing) {
      await prisma.video.create({ data: v });
      videoCount++;
    } else {
      await prisma.video.update({
        where: { id: existing.id },
        data: { title: v.title, sortOrder: v.sortOrder, active: v.active },
      });
      videoCount++;
    }
  }
  console.log(`✓ Seeded/updated ${videoCount} videos`);

  // 3. Photos (check by image so no duplicate)
  let photoCount = 0;
  for (const p of photosData) {
    const existing = await prisma.photo.findFirst({ where: { image: p.image } });
    if (!existing) {
      await prisma.photo.create({ data: p });
      photoCount++;
    } else {
      await prisma.photo.update({
        where: { id: existing.id },
        data: { title: p.title, sortOrder: p.sortOrder, status: p.status },
      });
      photoCount++;
    }
  }
  console.log(`✓ Seeded/updated ${photoCount} photos`);

  // 4. News & Blog Posts (upsert by slug)
  const allPosts = [...newsPostsData, ...blogPostsData];
  for (const post of allPosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        body: post.body,
        image: post.image,
        type: post.type,
        published: post.published,
      },
      create: post,
    });
  }
  console.log(`✓ Seeded/updated ${allPosts.length} posts (${newsPostsData.length} news, ${blogPostsData.length} blogs)`);

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
