import Banner from "./Banner";
import Content from "./Content";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/siteUrl";

const PAGE_SLUG = "best-eye-hospital-in-moradabad";
const PAGE_URL = `${SITE_URL}/${PAGE_SLUG}`;

// SEO Meta Title
const PAGE_TITLE =
    "Best Eye Hospital in Moradabad | Advanced Eye Care at Oracle Eye Hospital";

// SEO Meta Description
const PAGE_DESCRIPTION =
    "Searching for the best eye hospital in Moradabad? Oracle Eye Hospital offers cataract, glaucoma, retina, LASIK, dry eye and children&apos;s eye care with expert doctors and modern technology. Book your visit today.";

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
                url: `${SITE_URL}/Assets/img/services/Best-Eye-Hospital-Moradabad.png`,
                width: 1200,
                height: 630,
                alt: "Best Eye Hospital in Moradabad - Oracle Eye Hospital",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        images: [`${SITE_URL}/Assets/img/services/Best-Eye-Hospital-Moradabad.png`],
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
        question: "Which is the best eye hospital in Moradabad?",
        answer:
            "The best hospital for you is one with qualified ophthalmologists, accurate diagnostic facilities, a full range of eye services, hygienic surgical standards, honest advice and reliable follow-up. We invite you to visit Oracle Eye Hospital, meet our team and judge the care for yourself.",
    },
    {
        question: "How do I know if I need to visit an eye hospital instead of an eye clinic?",
        answer:
            "A hospital is the better choice if you may need advanced tests, a surgical procedure, treatment for conditions such as glaucoma or retinal disease, or emergency care. A hospital offers these services together.",
    },
    {
        question: "Is cataract surgery safe and painful?",
        answer:
            "Cataract surgery is a routine, widely performed procedure with high success rates. It is usually done with numbing anaesthesia, so patients do not feel pain during the procedure. Your doctor will explain the details, risks and recovery for your case.",
    },
    {
        question: "How often should adults get an eye examination?",
        answer:
            "Every one to two years is advisable for most adults, and yearly for people over 40, those with diabetes or a family history of eye disease, or those with any ongoing eye problem.",
    },
    {
        question: "Can eye problems be detected without symptoms?",
        answer:
            "Yes. Glaucoma, diabetic retinopathy and early macular conditions can develop without noticeable symptoms. Only a proper eye examination can detect them.",
    },
    {
        question: "What should I do in an eye emergency?",
        answer:
            "Do not rub the eye or apply home remedies. For a chemical splash, rinse the eye continuously with clean water and go to an eye hospital immediately. For injury, sudden vision loss or severe pain, seek emergency eye care right away.",
    },
    {
        question: "Do you treat children?",
        answer:
            "Yes. Children need regular screening, and conditions such as squint and lazy eye respond best to early treatment.",
    },
];

export default async function BestEyeHospitalMoradabadPage() {
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
        console.error(
            "Best eye hospital page schema fetch error:",
            err?.message || err
        );
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