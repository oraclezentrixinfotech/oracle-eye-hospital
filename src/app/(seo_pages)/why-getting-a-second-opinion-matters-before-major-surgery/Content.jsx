"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ChevronDown,
    Calendar,
    Stethoscope,
    ArrowRight,
    ListOrdered,
} from "lucide-react";
import AppointmentForm from "@/components/AppointmentForm";
import "../_components/seo-landing.css";

// ============================================================================
// 1. FAQS CONFIGURATION
// ============================================================================
export const DEFAULT_SECOND_OPINION_FAQS = [
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
        question: "What documents should I carry for a second opinion at Oracle Eye Hospital?",
        answer:
            "Carry all blood test and pathology reports, X-rays, CT or MRI scans, ultrasound reports, discharge summaries, records of previous treatment or surgery, a list of current medicines with doses, allergy details, and the first doctor&rsquo;s written recommendation if available.",
    },
    {
        question: "Can a second opinion confirm whether eye surgery is necessary?",
        answer:
            "Yes. An eye specialist can review your diagnosis, reports, and scans to confirm whether surgery is required, whether non-surgical options are suitable, and whether the proposed procedure and timing are appropriate for your eye condition.",
    },
];

// ============================================================================
// 2. RELATED KEYWORD PAGES
// ============================================================================
const RELATED_KEYWORD_PAGES = [
    {
        name: "Cataract Surgery in Moradabad",
        href: "/services/cataract-service",
        desc: "Advanced micro-incision cataract surgery and premium IOL options.",
    },
    {
        name: "LASIK Eye Surgery in Moradabad",
        href: "/services/cornea-refractive-service",
        desc: "Blade-free laser vision correction for freedom from glasses.",
    },
    {
        name: "Retina Specialist & Vitreoretinal Care",
        href: "/services/vitreoretinal-service",
        desc: "Advanced management of diabetic retinopathy and retinal disorders.",
    },
    {
        name: "Glaucoma Treatment in Moradabad",
        href: "/services/glaucoma-service",
        desc: "Early detection, pressure monitoring and optic nerve care.",
    },
];

export default function Content({ faqs = DEFAULT_SECOND_OPINION_FAQS }) {
    const [openFaq, setOpenFaq] = useState(0);
    const [tocOpen, setTocOpen] = useState(true);
    const rowRef = useRef(null);
    const sidebarColRef = useRef(null);
    const [sidebarStyle, setSidebarStyle] = useState({});

    useEffect(() => {
        let ticking = false;

        const updateSidebarPosition = () => {
            if (typeof window === "undefined") return;

            if (window.innerWidth < 992) {
                setSidebarStyle({});
                return;
            }

            if (!rowRef.current || !sidebarColRef.current) return;

            const rowRect = rowRef.current.getBoundingClientRect();
            const colRect = sidebarColRef.current.getBoundingClientRect();
            const topOffset = 90;
            const formCard = sidebarColRef.current.querySelector(".seo-sticky-appointment-card");
            const cardHeight = formCard ? formCard.offsetHeight : 380;

            if (rowRect.top > topOffset) {
                setSidebarStyle({
                    position: "relative",
                    top: 0,
                    left: "auto",
                    width: "100%",
                    zIndex: 30,
                });
            } else if (rowRect.bottom <= topOffset + cardHeight) {
                setSidebarStyle({
                    position: "absolute",
                    bottom: 0,
                    top: "auto",
                    left: 0,
                    width: "100%",
                    zIndex: 30,
                });
            } else {
                setSidebarStyle({
                    position: "fixed",
                    top: `${topOffset}px`,
                    left: `${colRect.left}px`,
                    width: `${colRect.width}px`,
                    zIndex: 90,
                });
            }
        };

        const handleScrollOrResize = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateSidebarPosition();
                    ticking = false;
                });
                ticking = true;
            }
        };

        updateSidebarPosition();

        window.addEventListener("scroll", handleScrollOrResize, { passive: true });
        window.addEventListener("resize", handleScrollOrResize);

        return () => {
            window.removeEventListener("scroll", handleScrollOrResize);
            window.removeEventListener("resize", handleScrollOrResize);
        };
    }, []);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? -1 : index);
    };

    return (
        <div className="seo-content-wrapper" style={{ backgroundColor: "#f8fafc" }}>
            {/* Main Reading Section */}
            <section className="seo-section py-5">
                <div className="container">
                    <div className="row g-4 g-lg-5 seo-content-row" ref={rowRef}>
                        {/* Left Column */}
                        <div className="col-lg-8">
                            <article className="seo-article-container">
                                {/* Block 1 */}
                                <div className="seo-article-block" id="overview">
                                    <span className="seo-badge-pill">Patient Guidance</span>
                                    <h2 className="seo-article-h2">
                                        Why Getting a Second Opinion Matters Before Major Eye Surgery
                                    </h2>
                                    <p className="seo-article-p">
                                        &ldquo;The doctor says I need an operation.&rdquo; Few sentences cause as much worry in a family. Surgery brings fear, cost, time away from work, and real risk, and the decision often has to be made quickly. In that moment, many people feel that asking for another doctor&rsquo;s view would be rude or would delay treatment.
                                    </p>
                                    <p className="seo-article-p">
                                        In reality, seeking a <strong>second opinion before major, planned eye surgery</strong> is a normal and sensible part of good medical care. Most doctors welcome it. At <strong>Oracle Eye Hospital, Moradabad</strong>, we believe an informed patient makes better decisions, and a second opinion is one of the simplest ways to become informed.
                                    </p>

                                    <div className="seo-article-callout">
                                        <h4>Second Opinion at Oracle Eye Hospital</h4>
                                        <p>
                                            Patients are welcome to bring their eye reports, scans, and earlier recommendations for an independent review. Our specialists explain the findings in simple language and discuss all suitable options so that patients and families can decide with confidence.
                                        </p>
                                    </div>
                                </div>

                                {/* Block 2 */}
                                <div className="seo-article-block" id="what-is-second-opinion">
                                    <h2 className="seo-article-h2">What Is a Second Opinion?</h2>
                                    <p className="seo-article-p">
                                        A second opinion means consulting another qualified eye specialist to review your diagnosis and the treatment recommended. The specialist examines your reports, scans, and medical history, may examine your eyes, and explains whether they agree with the diagnosis and proposed treatment.
                                    </p>
                                    <p className="seo-article-p">
                                        A second opinion is not a rejection of your first doctor. It is an additional check, much like reviewing an important document carefully before signing it. It helps you confirm the diagnosis, understand alternatives, and make a decision with greater clarity.
                                    </p>
                                </div>

                                {/* Block 3 */}
                                <div className="seo-article-block" id="why-it-matters">
                                    <h2 className="seo-article-h2">Why It Matters Before Major Eye Surgery</h2>
                                    <p className="seo-article-p">
                                        Eye surgery can affect your vision, daily independence, work, and quality of life. A second opinion gives you the opportunity to verify the recommendation and understand the complete picture before proceeding.
                                    </p>

                                    <h3 className="seo-article-h3" id="confirm-diagnosis">
                                        1. To Confirm the Diagnosis
                                    </h3>
                                    <p className="seo-article-p">
                                        Surgery rests on an accurate diagnosis. Eye scans and test reports can sometimes be interpreted differently, and some eye conditions can look similar. Confirming that the diagnosis is correct is the most important safeguard before a major procedure.
                                    </p>

                                    <h3 className="seo-article-h3" id="treatment-options">
                                        2. To Find Out Whether Surgery Is Truly Needed
                                    </h3>
                                    <p className="seo-article-p">
                                        Many eye conditions can be managed in more than one way. Some problems advised for surgery can be treated with medicines, eye drops, laser treatment, lifestyle changes, or careful monitoring. Others genuinely require timely surgery to protect or restore vision.
                                    </p>

                                    <h3 className="seo-article-h3">3. To Understand All Your Options</h3>
                                    <p className="seo-article-p">
                                        Eye surgery can be performed in different ways, such as traditional versus micro-incision techniques, laser-assisted methods, or different types of intraocular lenses. Another specialist may explain the available options, risks, and recovery expectations differently.
                                    </p>

                                    <h3 className="seo-article-h3" id="risks-timing">
                                        4. To Understand the Risks and Timing
                                    </h3>
                                    <p className="seo-article-p">
                                        A second opinion helps you understand how urgent the condition is, what may happen if surgery is delayed, and what may happen if it is performed. Knowing whether you have days, weeks, or months to decide helps you plan properly.
                                    </p>

                                    <h3 className="seo-article-h3">5. To Feel Confident and Reduce Regret</h3>
                                    <p className="seo-article-p">
                                        Whether the second specialist agrees with the first recommendation or suggests an alternative, you can move ahead knowing that you explored the question carefully. Confidence in the decision often helps patients cope better with treatment and recovery.
                                    </p>

                                    <h3 className="seo-article-h3">6. To Plan Finances and Logistics Better</h3>
                                    <p className="seo-article-p">
                                        Major eye surgery involves cost, travel, and time away from work or family responsibilities. A second view on the procedure, expected hospital stay, and recovery period can help families plan realistically.
                                    </p>
                                </div>

                                {/* Block 4 */}
                                <div className="seo-article-block" id="when-to-get-second-opinion">
                                    <h2 className="seo-article-h2">
                                        When a Second Opinion Is Especially Worth Getting
                                    </h2>
                                    <p className="seo-article-p">
                                        Consider seeking a second opinion in the following situations:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>Major, planned, non-emergency eye surgery such as cataract surgery, retinal surgery, glaucoma surgery, or corneal procedures.</li>
                                        <li>A rare, complex, or unclear eye diagnosis.</li>
                                        <li>Surgery with significant risks or a long recovery period.</li>
                                        <li>Retinal conditions, suspected tumours, or complex vitreoretinal problems where treatment planning is detailed.</li>
                                        <li>When you feel unsure, uncomfortable, or feel that the explanation has not been sufficient.</li>
                                        <li>When two reports or eye specialists appear to disagree.</li>
                                        <li>When the proposed treatment seems more extensive than the problem described.</li>
                                        <li>When eye surgery has already failed once, or vision problems have returned after an operation.</li>
                                        <li>When you have other health conditions, such as diabetes, hypertension, or kidney disease, that may affect surgical planning.</li>
                                    </ul>
                                </div>

                                {/* Block 5 */}
                                <div className="seo-article-block" id="when-not-to-delay">
                                    <h2 className="seo-article-h2">When Not to Delay Treatment</h2>
                                    <p className="seo-article-p">
                                        A second opinion is intended for planned medical decisions. <strong>In a true emergency, do not delay treatment to seek another opinion.</strong>
                                    </p>
                                    <p className="seo-article-p">
                                        Sudden vision loss, sudden flashes with a shower of floaters, a curtain-like shadow in vision, severe eye injury, chemical exposure to the eye, sudden severe eye pain, or symptoms of stroke require immediate medical attention.
                                    </p>

                                    <div className="seo-article-callout">
                                        <h4>Emergency Eye Care Reminder</h4>
                                        <p>
                                            If you experience sudden vision loss, retinal detachment symptoms, major eye trauma, or a chemical injury, seek emergency eye care immediately rather than waiting for a routine second opinion.
                                        </p>
                                    </div>
                                </div>

                                {/* Block 6 */}
                                <div className="seo-article-block" id="how-to-ask">
                                    <h2 className="seo-article-h2">
                                        How to Ask for a Second Opinion Without Awkwardness
                                    </h2>
                                    <p className="seo-article-p">
                                        Many patients worry about offending their doctor. A few simple approaches can make the conversation easier:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>Say it plainly and politely: &ldquo;This is an important decision for our family, and I would like to take another eye specialist&rsquo;s view before we proceed.&rdquo;</li>
                                        <li>Ask your doctor to share your reports, scans, and a summary of the recommendation.</li>
                                        <li>Reassure your doctor that you intend to return to discuss the final decision.</li>
                                    </ul>
                                    <p className="seo-article-p">
                                        Good doctors understand and support this process because their goal is also your well-being and a well-informed treatment decision.
                                    </p>
                                </div>

                                {/* Block 7 */}
                                <div className="seo-article-block" id="prepare-consultation">
                                    <h2 className="seo-article-h2">What to Take to a Second Opinion</h2>
                                    <p className="seo-article-p">
                                        Bring everything that helps the eye specialist understand your complete medical history:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>All eye reports, including visual acuity records, intraocular pressure readings, and pathology reports.</li>
                                        <li>Imaging such as OCT scans, fundus photographs, B-scan ultrasound, visual field reports, and corneal topography.</li>
                                        <li>Discharge summaries and records of previous eye treatment or surgery.</li>
                                        <li>A list of current medicines, eye drops, and their doses.</li>
                                        <li>Details of allergies and other medical conditions such as diabetes or hypertension.</li>
                                        <li>The first doctor&rsquo;s written recommendation, if available.</li>
                                        <li>A short list of your questions.</li>
                                        <li>A family member who can listen carefully and help remember the discussion.</li>
                                    </ul>
                                </div>

                                {/* Block 8 */}
                                <div className="seo-article-block" id="questions-to-ask">
                                    <h2 className="seo-article-h2">Questions Worth Asking</h2>
                                    <p className="seo-article-p">
                                        Prepare a few clear questions before your consultation. Useful questions include:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>Do you agree with my eye diagnosis?</li>
                                        <li>Is surgery necessary, or are there non-surgical options?</li>
                                        <li>What happens if we wait, and for how long is waiting safe?</li>
                                        <li>What are the different surgical approaches, and which do you recommend and why?</li>
                                        <li>What are the risks and possible complications for someone like me?</li>
                                        <li>What will recovery look like, and when can I return to normal activities?</li>
                                        <li>What are the realistic benefits, and how likely is vision improvement?</li>
                                        <li>What will it cost, and how long will the hospital stay be?</li>
                                        <li>Is there anything that should be done before surgery to lower the risk?</li>
                                    </ul>
                                </div>

                                {/* Block 9 */}
                                <div className="seo-article-block" id="if-opinions-differ">
                                    <h2 className="seo-article-h2">If the Two Opinions Differ</h2>
                                    <p className="seo-article-p">
                                        Disagreement is not unusual, and it does not automatically mean one doctor is wrong. Eye specialists may weigh risks and benefits differently or have different experience with particular procedures.
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>Ask each doctor to explain their reasoning in detail.</li>
                                        <li>Look for areas where both doctors agree, which is often more than where they differ.</li>
                                        <li>Consider each doctor&rsquo;s experience with your specific eye condition and procedure.</li>
                                        <li>Discuss the differences with your primary eye doctor.</li>
                                        <li>If you are still unsure, consider a third opinion.</li>
                                        <li>Remember that the final decision is yours, made with a doctor you trust.</li>
                                    </ul>
                                </div>

                                {/* Block 10 */}
                                <div className="seo-article-block" id="not-doctor-shopping">
                                    <h2 className="seo-article-h2">A Second Opinion Is Not Doctor-Shopping</h2>
                                    <p className="seo-article-p">
                                        Seeking a thoughtful second or third opinion for a major decision is different from going from doctor to doctor until someone says what you want to hear, or avoiding necessary treatment because of fear.
                                    </p>
                                    <p className="seo-article-p">
                                        If multiple specialists agree that surgery is needed, further delay may harm your vision. The purpose of a second opinion is clarity, not postponement.
                                    </p>
                                </div>

                                {/* Block 11 */}
                                <div className="seo-article-block" id="practical-considerations">
                                    <h2 className="seo-article-h2">Practical Considerations</h2>
                                    <ul className="seo-article-list">
                                        <li>Check whether your health insurance or corporate panel covers second-opinion consultations and what documents are required.</li>
                                        <li>Keep copies of all your records and request them in advance, as hospitals may need time to prepare them.</li>
                                        <li>Plan the timing so the second opinion does not unnecessarily delay treatment for a condition that is progressing.</li>
                                        <li>Choose an ophthalmologist in the relevant specialty who has experience with your specific eye condition.</li>
                                    </ul>
                                </div>

                                {/* Block 12 */}
                                <div className="seo-article-block" id="second-opinion-oracle">
                                    <h2 className="seo-article-h2">
                                        Second Opinions at Oracle Eye Hospital, Moradabad
                                    </h2>
                                    <p className="seo-article-p">
                                        Patients are welcome to bring their reports, scans, and prior recommendations to <strong>Oracle Eye Hospital, Moradabad</strong> for a second opinion. Our team reviews the records, examines the patient where needed, explains the findings in plain language, and discusses the available options.
                                    </p>
                                    <p className="seo-article-p">
                                        We encourage patients to take whatever time is safely possible to make an informed choice. We are equally comfortable if you decide to proceed with your original doctor. For urgent eye problems, our emergency eye care support remains available.
                                    </p>
                                    <p className="seo-article-p">
                                        For the most useful consultation, please carry all your medical documents and a written list of your questions.
                                    </p>
                                </div>
                            </article>
                        </div>

                        {/* Right Column */}
                        <div className="col-lg-4 seo-sidebar-col" ref={sidebarColRef}>
                            <aside
                                className="seo-sticky-appointment-card"
                                id="sidebar-appointment"
                                style={sidebarStyle}
                            >
                                <div
                                    className="seo-sidebar-box seo-sidebar-form-box"
                                    style={{ marginBottom: "14px" }}
                                >
                                    <h4>
                                        <Calendar size={18} color="#e8a33d" />
                                        <span>Book a Second Opinion</span>
                                    </h4>
                                    <AppointmentForm
                                        initialService="Second Opinion Consultation"
                                        initialDoctor="Dr Girjesh Kain"
                                    />
                                </div>

                                <div className="seo-sidebar-box seo-sidebar-toc-box">
                                    <div
                                        className="seo-sidebar-toc-header"
                                        onClick={() => setTocOpen(!tocOpen)}
                                        role="button"
                                        tabIndex={0}
                                        aria-expanded={tocOpen}
                                    >
                                        <h4>
                                            <ListOrdered size={16} color="#137c8b" />
                                            <span>Table of Contents</span>
                                        </h4>
                                        <span className="seo-sidebar-toc-toggle">
                                            {tocOpen ? "Hide" : "Show"}
                                            <ChevronDown
                                                size={13}
                                                style={{
                                                    transform: tocOpen ? "rotate(180deg)" : "rotate(0deg)",
                                                    transition: "transform 0.2s ease",
                                                }}
                                            />
                                        </span>
                                    </div>

                                    {tocOpen && (
                                        <div className="seo-sidebar-toc-content">
                                            <ul className="seo-sidebar-toc-list">
                                                <li><a href="#overview">&bull; Overview</a></li>
                                                <li><a href="#what-is-second-opinion">&bull; What Is It?</a></li>
                                                <li><a href="#why-it-matters">&bull; Why It Matters</a></li>
                                                <li><a href="#when-to-get-second-opinion">&bull; When to Get One</a></li>
                                                <li><a href="#when-not-to-delay">&bull; When Not to Delay</a></li>
                                                <li><a href="#prepare-consultation">&bull; What to Carry</a></li>
                                                <li><a href="#questions-to-ask">&bull; Questions to Ask</a></li>
                                                <li><a href="#second-opinion-oracle">&bull; At Oracle Eye Hospital</a></li>
                                                <li><a href="#faq-section">&bull; FAQs</a></li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </section>

            {/* Doctor Section */}
            <section
                className="seo-section"
                style={{ backgroundColor: "#ffffff" }}
                id="expert-doctors"
            >
                <div className="container">
                    <div className="seo-doctors-section">
                        <div className="seo-section-title-wrap mb-4">
                            <span
                                className="seo-badge-pill"
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    color: "#cfe7ea",
                                }}
                            >
                                Expert Eye Care Team
                            </span>
                            <h2 className="seo-section-h2 text-white">
                                Meet Our Senior Eye Specialists
                            </h2>
                            <p className="seo-section-desc text-white-50">
                                Get a clear, independent review of your eye diagnosis and treatment plan from experienced ophthalmic specialists.
                            </p>
                        </div>

                        <div className="row g-4 justify-content-center">
                            {/* Dr. Girjesh Kain */}
                            <div className="col-md-6 col-lg-5">
                                <div className="seo-doctor-card">
                                    <div className="seo-doctor-header">
                                        <div className="seo-doctor-avatar">
                                            <Image
                                                src="/Assets/img/team/3.png"
                                                alt="Dr. Girjesh Kain"
                                                width={76}
                                                height={76}
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>
                                        <div className="seo-doctor-info">
                                            <h4>Dr. Girjesh Kain</h4>
                                            <div className="role">Founder &amp; Managing Director</div>
                                            <div className="qual">MS (Ophthalmology), FICO</div>
                                        </div>
                                    </div>
                                    <p className="seo-doctor-bio">
                                        Dr. Kain is an experienced cataract and refractive surgeon who reviews complex eye conditions, prior reports, and surgical recommendations to help patients make informed treatment decisions.
                                    </p>
                                    <div className="seo-doctor-footer">
                                        <span className="text-white-50">Cataract &amp; Refractive Care</span>
                                        <Link href="/girjesh-kain">
                                            <span>View Profile</span>
                                            <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Dr. Rachana */}
                            <div className="col-md-6 col-lg-5">
                                <div className="seo-doctor-card">
                                    <div className="seo-doctor-header">
                                        <div className="seo-doctor-avatar" style={{ borderColor: "#137c8b" }}>
                                            <Image
                                                src="/Assets/img/team/8.png"
                                                alt="Dr. Rachana"
                                                width={76}
                                                height={76}
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>
                                        <div className="seo-doctor-info">
                                            <h4>Dr. Rachana</h4>
                                            <div className="role" style={{ color: "#cfe7ea" }}>
                                                Senior Ophthalmologist
                                            </div>
                                            <div className="qual">MBBS, MS (Ophthalmology)</div>
                                        </div>
                                    </div>
                                    <p className="seo-doctor-bio">
                                        Dr. Rachana provides comprehensive eye evaluations and second-opinion guidance for cataract, general eye disorders, and treatment planning.
                                    </p>
                                    <div className="seo-doctor-footer">
                                        <span className="text-white-50">Comprehensive Eye Care</span>
                                        <Link href="/rachana">
                                            <span>View Profile</span>
                                            <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section
                className="seo-section"
                style={{ backgroundColor: "#f8fafc" }}
                id="faq-section"
            >
                <div className="container">
                    <div className="seo-section-title-wrap">
                        <span className="seo-badge-pill">Patient Questions</span>
                        <h2 className="seo-section-h2">
                            Frequently Asked Questions About Second Opinions
                        </h2>
                        <p className="seo-section-desc">
                            Clear answers to help you make an informed decision before major eye surgery.
                        </p>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-9">
                            {faqs.map((faq, index) => {
                                const isOpen = openFaq === index;
                                return (
                                    <div key={index} className="seo-faq-item">
                                        <button
                                            type="button"
                                            onClick={() => toggleFaq(index)}
                                            className="seo-faq-btn"
                                            aria-expanded={isOpen}
                                        >
                                            <span className="pe-3">{faq.question || faq.q}</span>
                                            <ChevronDown
                                                size={18}
                                                style={{
                                                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                                    transition: "transform 0.2s ease",
                                                    color: "#137c8b",
                                                    minWidth: "18px",
                                                }}
                                            />
                                        </button>
                                        {isOpen && (
                                            <div
                                                className="seo-faq-body"
                                                dangerouslySetInnerHTML={{
                                                    __html: faq.answer || faq.a || "",
                                                }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Internal Links */}
            <section className="seo-section" style={{ backgroundColor: "#ffffff" }}>
                <div className="container">
                    <div className="seo-section-title-wrap">
                        <span className="seo-badge-pill">Super-Specialty Care</span>
                        <h2 className="seo-section-h2">
                            Explore Related Eye Care Services in Moradabad
                        </h2>
                        <p className="seo-section-desc">
                            Discover advanced super-specialty eye treatments available at Oracle Eye Hospital:
                        </p>
                    </div>

                    <div className="row g-4">
                        {RELATED_KEYWORD_PAGES.map((item, index) => (
                            <div key={index} className="col-md-6 col-lg-3">
                                <Link href={item.href} className="seo-related-card">
                                    <div className="d-flex justify-content-between align-items-center text-primary">
                                        <Stethoscope size={22} color="#137c8b" />
                                        <ArrowRight size={16} color="#137c8b" />
                                    </div>
                                    <h4>{item.name}</h4>
                                    <p>{item.desc}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}