import Banner from "./Banner";
import Content from "./Content";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/siteUrl";

const PAGE_SLUG = "dry-eye-clinic-moradabad";
const PAGE_URL = `${SITE_URL}/${PAGE_SLUG}`;

// SEO Meta Title
const PAGE_TITLE =
    "Dry Eye Clinic in Moradabad | Advanced Dry Eye Treatment at Oracle Eye Hospital";

// SEO Meta Description
const PAGE_DESCRIPTION =
    "Looking for a dry eye clinic in Moradabad? Oracle Eye Hospital offers complete dry eye evaluation, advanced treatment and long-term relief for burning, itchy and tired eyes. Book your visit today.";

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
                url: `${SITE_URL}/Assets/img/services/Dry-Eye-Clinic.png`,
                width: 1200,
                height: 630,
                alt: "Dry Eye Clinic in Moradabad - Oracle Eye Hospital",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        images: [`${SITE_URL}/Assets/img/services/Dry-Eye-Clinic.png`],
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
        question: "Is dry eye a serious condition?",
        answer:
            "Mild dry eye is uncomfortable but manageable. If left untreated, it can cause inflammation, corneal surface damage, blurred vision, recurrent infections and difficulty wearing contact lenses. Early evaluation and treatment help prevent complications.",
    },
    {
        question: "Can dry eye be cured permanently?",
        answer:
            "Dry eye is often a long-term condition, but with the right treatment plan, eyelid care and lifestyle changes, most patients achieve excellent symptom control and comfortable vision. The goal is long-term management rather than a one-time cure.",
    },
    {
        question: "Why do my eyes water if they are dry?",
        answer:
            "When the eye surface becomes irritated, the eye may produce a sudden flood of reflex tears. These tears are mostly watery and lack the oily and mucus layers needed to remain stable on the eye surface, so dryness and irritation can continue.",
    },
    {
        question: "Does screen use cause dry eye?",
        answer:
            "Screens do not directly damage the eyes, but people blink much less while concentrating on phones, computers and televisions. Reduced blinking leads to poor tear spreading and faster tear evaporation, which can trigger or worsen dry eye symptoms.",
    },
    {
        question: "Are artificial tears enough for dry eye?",
        answer:
            "Artificial tears can provide relief for mild dryness, but frequent use or recurring symptoms may indicate an underlying problem such as meibomian gland dysfunction, blepharitis, allergy or eyelid disease. A proper examination helps identify the actual cause.",
    },
    {
        question: "Can children get dry eye?",
        answer:
            "Yes. Children can develop dry eye symptoms due to excessive screen use, allergies, eyelid problems or incomplete blinking. If a child frequently rubs the eyes, complains of burning or has redness, a paediatric eye examination is advisable.",
    },
    {
        question: "Is dry eye treatment painful?",
        answer:
            "Most dry eye treatments, including lubricating drops, eyelid hygiene, warm compresses and punctal plugs, cause little or no discomfort. Your doctor will explain each treatment and what to expect before starting it.",
    },
];

export default async function DryEyeClinicPage() {
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
        console.error("Dry eye clinic page schema fetch error:", err?.message || err);
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