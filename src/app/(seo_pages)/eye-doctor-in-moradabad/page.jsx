import Banner from "./Banner";
import Content from "./Content";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/siteUrl";

const PAGE_SLUG = "eye-doctor-moradabad";
const PAGE_URL = `${SITE_URL}/${PAGE_SLUG}`;

// SEO Meta Title
const PAGE_TITLE =
    "Eye Doctor in Moradabad | Trusted Eye Specialist & Eye Hospital – Oracle Eye Hospital";

// SEO Meta Description
const PAGE_DESCRIPTION =
    "Looking for the best eye doctor in Moradabad? Oracle Eye Hospital offers complete eye check-ups, cataract, glaucoma, retina, LASIK, dry eye and children&apos;s eye care. Book your appointment today.";

export const metadata = {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    alternates: {
        canonical: PAGE_URL,
    },
    openGraph: {
        title: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        url: PAGE_URL,
        siteName: "Oracle Eye Hospital",
        locale: "en_IN",
        type: "website",
        images: [
            {
                url: `${SITE_URL}/Assets/img/services/Eye-Doctor-Moradabad.png`,
                width: 1200,
                height: 630,
                alt: "Eye Doctor in Moradabad - Oracle Eye Hospital",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        images: [`${SITE_URL}/Assets/img/services/Eye-Doctor-Moradabad.png`],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

// FAQ Array shared with Content component
export const FAQS = [
    {
        question: "Who is the best eye doctor in Moradabad?",
        answer:
            "The best eye doctor is one who is properly qualified, has experience with your specific condition, uses reliable diagnostic tools and communicates honestly. Visit a hospital with a full eye care team, ask questions and choose the doctor you trust.",
    },
    {
        question: "How often should I get my eyes checked?",
        answer:
            "Adults with no problems should get a check-up every one to two years. People over 40, those with diabetes or a family history of eye disease, and anyone with symptoms should be examined more often, as their doctor advises.",
    },
    {
        question: "Is an eye check-up painful?",
        answer:
            "No. The tests are quick and comfortable. Dilating drops may sting briefly and cause temporary blurring and light sensitivity.",
    },
    {
        question: "At what age should a child&apos;s eyes be checked?",
        answer:
            "Children should have an early eye examination, preferably before starting school, and sooner if you notice squinting, watering, head tilting or poor visual response.",
    },
    {
        question: "Can I see an eye doctor if I only need glasses?",
        answer:
            "Yes. An eye doctor can check your vision and also look at the health of your eye. Sometimes a change in glasses power is the first clue to another condition, such as diabetes or cataract.",
    },

    {
        question: "Can glaucoma be cured?",
        answer:
            "Damage caused by glaucoma cannot be reversed, but with early detection and regular treatment, further vision loss can usually be slowed or stopped. That is why screening is so important.",
    },
    {
        question: "Do I need a check-up if I have diabetes?",
        answer:
            "Yes. Everyone with diabetes should have a dilated retinal examination at least once a year, even if their vision seems fine.",
    },
];

export default async function EyeDoctorMoradabadPage() {
    let schemaList = [];
    try {
        const seoPage = await prisma.seoPage.findFirst({
            where: { slug: PAGE_SLUG, status: "published" },
            select: { schemaJson: true, customSchema: true },
        });
        if (seoPage) {
            if (seoPage.schemaJson) {
                schemaList = Array.isArray(seoPage.schemaJson)
                    ? seoPage.schemaJson
                    : [seoPage.schemaJson];
            } else if (seoPage.customSchema && seoPage.customSchema.trim()) {
                try {
                    let raw = seoPage.customSchema.trim();
                    if (raw.startsWith("<script") && raw.endsWith("</script>")) {
                        raw = raw
                            .replace(/<script[^>]*>/i, "")
                            .replace(/<\/script>$/i, "")
                            .trim();
                    }
                    const parsed = JSON.parse(raw);
                    schemaList = Array.isArray(parsed) ? parsed : [parsed];
                } catch { }
            }
        }
    } catch (err) {
        console.error("Eye doctor page schema fetch error:", err?.message || err);
    }

    return (
        <>
            {/* Schema.org Structured Data: strictly from database written via Admin Panel */}
            {schemaList.length > 0 &&
                schemaList.map((item, index) => {
                    const jsonText = JSON.stringify(item).replace(/</g, "\\u003c");
                    return (
                        <script
                            key={index}
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{ __html: jsonText }}
                        />
                    );
                })}

            {/* Main Visual Components */}
            <Banner />
            <Content faqs={FAQS} />
        </>
    );
}