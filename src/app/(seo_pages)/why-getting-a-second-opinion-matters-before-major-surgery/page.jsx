import Banner from "./Banner";
import Content from "./Content";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/siteUrl";

const PAGE_SLUG = "second-opinion-before-surgery";
const PAGE_URL = `${SITE_URL}/${PAGE_SLUG}`;

// 56 characters (50–60 chars, keyword first, ends with "| Oracle Eye Hospital")
const PAGE_TITLE =
    "Second Opinion Before Surgery: Why It Matters | Oracle Eye Hospital";

// 158 characters (140–160 chars, keyword + CTA)
const PAGE_DESCRIPTION =
    "Advised to have major surgery? Learn when a second medical opinion helps, how to ask for one, and what to bring, from Oracle Eye Hospital, Moradabad.";

const PAGE_KEYWORDS = [
    "second opinion before surgery",
    "second opinion Moradabad",
    "surgery advice second doctor",
    "Oracle Eye Hospital Moradabad",
    "operation se pehle dusri raay",
    "is surgery necessary",
    "medical second opinion India",
    "how to get second opinion",
    "surgery decision guide",
    "Ayushman Bharat second opinion",
];

export const metadata = {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    keywords: PAGE_KEYWORDS,
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
                url: `${SITE_URL}/Assets/img/services/Second-Opinion-Service.png`,
                width: 1200,
                height: 630,
                alt: "Second Opinion Before Eye Surgery - Oracle Eye Hospital Moradabad",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        images: [`${SITE_URL}/Assets/img/services/Second-Opinion-Service.png`],
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
        question: "Will my first doctor be upset if I get a second opinion?",
        answer:
            "Most doctors understand and support a second opinion, especially before a major surgery or when the diagnosis is complex. A good doctor wants you to feel confident and fully informed about your treatment decision.",
    },
    {
        question: "Will getting a second opinion delay my treatment?",
        answer:
            "Usually, a second opinion adds only a few days. If your condition is urgent, ask your doctor how long it is safe to wait. In a true emergency, such as a heart attack, stroke, severe trauma, or serious internal bleeding, do not delay treatment to seek another opinion.",
    },
    {
        question: "Should the second opinion be from the same hospital?",
        answer:
            "It can be from any qualified specialist or hospital. Many patients choose a different hospital or specialist for a fresh perspective, and that is entirely reasonable.",
    },
    {
        question: "What if the second doctor recommends something different?",
        answer:
            "Ask both doctors to explain their reasoning in detail. Compare the risks, benefits, urgency, recovery period, and available alternatives. If you are still unsure, a third opinion can help you make a clearer decision.",
    },
    {
        question: "Is a second opinion needed for every surgery?",
        answer:
            "No. It is not necessary for every minor or clearly urgent procedure. It is most valuable for major planned surgery, high-risk operations, unclear or complex diagnoses, cancer-related treatment planning, and whenever you feel uncertain about the recommendation.",
    },
    {
        question:
            "What documents should I carry for a second opinion at Oracle Eye Hospital?",
        answer:
            "Carry all blood test and pathology reports, X-rays, CT or MRI scans, ultrasound reports, discharge summaries, records of previous treatment or surgery, a list of current medicines with doses, allergy details, and the first doctor&rsquo;s written recommendation if available.",
    },
    {
        question:
            "Can a second opinion confirm whether eye surgery is necessary?",
        answer:
            "Yes. An eye specialist can review your diagnosis, reports, and scans to confirm whether surgery is required, whether non-surgical options are suitable, and whether the proposed procedure and timing are appropriate for your eye condition.",
    },
];

export default async function SecondOpinionBeforeSurgeryPage() {
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
        console.error("Second opinion page schema fetch error:", err?.message || err);
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