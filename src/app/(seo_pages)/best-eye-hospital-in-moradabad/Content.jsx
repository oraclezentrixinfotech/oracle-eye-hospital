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
// 1. FAQS CONFIGURATION (Easily editable for any keyword / procedure)
// ============================================================================
export const DEFAULT_EYE_HOSPITAL_FAQS = [
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

// ============================================================================
// 2. RELATED KEYWORD PAGES (For internal linking & SEO topical authority)
// ============================================================================
const RELATED_KEYWORD_PAGES = [
    {
        name: "LASIK Eye Surgery in Moradabad",
        href: "/services/cornea-refractive-service",
        desc: "Blade-free laser vision correction for complete freedom from glasses.",
    },
    {
        name: "Glaucoma Treatment in Moradabad",
        href: "/services/glaucoma-service",
        desc: "Early detection, pressure monitoring & laser treatment for optic nerve care.",
    },
    {
        name: "Retina Specialist & Vitreoretinal Care",
        href: "/services/vitreoretinal-service",
        desc: "Advanced management of diabetic retinopathy and retinal detachments.",
    },
    {
        name: "Pediatric Eye Care & Squint Evaluation",
        href: "/services/pediatric-eye-service",
        desc: "Specialized child-friendly eye examinations and strabismus management.",
    },
];

export default function Content({ faqs = DEFAULT_EYE_HOSPITAL_FAQS }) {
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
            const colEl = sidebarColRef.current;
            const colRect = colEl.getBoundingClientRect();
            const colStyle = window.getComputedStyle(colEl);
            const padLeft = parseFloat(colStyle.paddingLeft) || 0;
            const padRight = parseFloat(colStyle.paddingRight) || 0;
            const actualWidth = colRect.width - padLeft - padRight;
            const actualLeft = colRect.left + padLeft;

            const topOffset = 90;
            const formCard = colEl.querySelector(
                ".seo-sticky-appointment-card"
            );
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
                    left: `${padLeft}px`,
                    width: `${actualWidth}px`,
                    zIndex: 30,
                });
            } else {
                setSidebarStyle({
                    position: "fixed",
                    top: `${topOffset}px`,
                    left: `${actualLeft}px`,
                    width: `${actualWidth}px`,
                    zIndex: 90,
                    maxHeight: `calc(100vh - ${topOffset + 15}px)`,
                    overflowY: "auto",
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
                                {/* Block 1: Overview */}
                                <div className="seo-article-block" id="overview">
                                    <span className="seo-badge-pill">Clinical Overview</span>
                                    <h2 className="seo-article-h2">
                                        Best Eye Hospital in Moradabad: Advanced, Compassionate Eye Care at Oracle Eye Hospital
                                    </h2>
                                    <p className="seo-article-p">
                                        Choosing an eye hospital is one of the most important health decisions you can make for yourself or your family. Your eyes cannot be replaced, and vision lost to delay, poor diagnosis or careless treatment is often hard to recover. So when you type <strong>best eye hospital in Moradabad</strong> into a search bar, you are really asking a bigger question: Who can I trust with my sight?
                                    </p>
                                    <p className="seo-article-p">
                                        This guide helps you answer that question. We explain what makes an eye hospital truly good, which services a complete eye hospital should offer, the questions you should ask before choosing, and why patients from Moradabad and nearby towns turn to Oracle Eye Hospital for dependable eye care.
                                    </p>

                                    <div className="seo-article-callout">
                                        <h4>Why Choose Oracle Eye Hospital?</h4>
                                        <p>
                                            Oracle Eye Hospital provides comprehensive eye examinations, advanced diagnostics, medical and surgical eye care, and follow-up support for children, adults and senior citizens under one roof.
                                        </p>
                                    </div>
                                </div>

                                {/* Block 2: What Makes an Eye Hospital the Best */}
                                <div className="seo-article-block" id="what-makes-best">
                                    <h2 className="seo-article-h2">
                                        What Makes an Eye Hospital the Best?
                                    </h2>
                                    <p className="seo-article-p">
                                        The word best can be confusing. Advertising is everywhere, and every hospital claims to be the top choice. A better way to judge is to look at the substance behind the claim. A genuinely good eye hospital shows these qualities:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>
                                            <strong>Qualified and experienced eye specialists:</strong> Eye care is highly specialised. The doctors should be trained ophthalmologists, and for complex problems such as retina disease, glaucoma, squint or corneal conditions, access to the right sub-specialty expertise matters. Experience in handling a large number of cases of your particular condition is a strong sign of reliability.
                                        </li>
                                        <li>
                                            <strong>Accurate diagnosis with modern equipment:</strong> Good treatment starts with a correct diagnosis. Advanced diagnostic tools help detect problems like glaucoma, diabetic retinopathy and macular disease early, often before you notice any symptoms. A hospital that invests in proper testing equipment reduces guesswork and improves outcomes.
                                        </li>
                                        <li>
                                            <strong>A complete range of services under one roof:</strong> Eye problems rarely stay simple. A patient who comes for a routine check-up may need a retina scan, cataract surgery or glaucoma management later. A comprehensive hospital lets you continue with the same team and the same records, rather than starting over each time.
                                        </li>
                                        <li>
                                            <strong>Safe, hygienic surgical environment:</strong> Eye surgery demands a sterile operation theatre, strict infection control and well-maintained instruments. Hygiene standards directly affect safety and results.
                                        </li>
                                        <li>
                                            <strong>Honest, ethical advice:</strong> The best hospitals recommend treatment only when it is truly needed. You should feel comfortable asking about alternatives, risks, success rates and costs, and you should receive straight answers.
                                        </li>
                                        <li>
                                            <strong>Clear communication and patient education:</strong> You should leave the consultation understanding your diagnosis, your options and your next steps. Doctors who explain patiently build trust and improve how well patients follow treatment.
                                        </li>
                                        <li>
                                            <strong>Reliable follow-up and aftercare:</strong> Recovery matters as much as the procedure. Good aftercare means clear instructions, scheduled follow-ups and quick access to the team if something does not feel right.
                                        </li>
                                        <li>
                                            <strong>Patient comfort and respect:</strong> Reasonable waiting times, courteous staff, clean surroundings and respectful handling, especially of elderly patients and children, are part of quality care.
                                        </li>
                                        <li>
                                            <strong>Fair and transparent pricing:</strong> Costs should be explained clearly before treatment. There should be no confusion about what is included.
                                        </li>
                                        <li>
                                            <strong>Trust within the community:</strong> Honest patient feedback and recommendations from families in your area tell you a lot about how a hospital treats people over time.
                                        </li>
                                    </ul>
                                </div>

                                {/* Block 3: Complete Eye Care Services */}
                                <div className="seo-article-block" id="eye-care-services">
                                    <h2 className="seo-article-h2">
                                        Complete Eye Care Services Every Good Eye Hospital Should Offer
                                    </h2>
                                    <p className="seo-article-p">
                                        Here is a look at the services families in Moradabad commonly need, and what to expect from each.
                                    </p>

                                    <h3 className="seo-article-h3">Comprehensive Eye Examination</h3>
                                    <p className="seo-article-p">
                                        A full check-up covers vision, glasses power, eye pressure, the front of the eye and a dilated examination of the retina and optic nerve. It is the foundation for early detection of many hidden eye conditions.
                                    </p>

                                    <h3 className="seo-article-h3">Cataract Evaluation and Surgery</h3>
                                    <p className="seo-article-p">
                                        Cataract is a clouding of the eye&apos;s natural lens and one of the most common causes of treatable vision loss in older adults. Modern surgery replaces the cloudy lens with a clear artificial lens, usually as a short day-care procedure. A good hospital will assess your eye carefully, explain the available lens options and plan the procedure around your needs and lifestyle.
                                    </p>

                                    <h3 className="seo-article-h3">Glaucoma Care</h3>
                                    <p className="seo-article-p">
                                        Glaucoma slowly damages the optic nerve, often without pain or early symptoms. Regular pressure checks, optic nerve evaluation and visual field testing help detect it early. Treatment with drops, laser or surgery can protect remaining vision, but it cannot restore what is lost, which is why early screening is so valuable.
                                    </p>

                                    <h3 className="seo-article-h3">Retina and Diabetic Eye Services</h3>
                                    <p className="seo-article-p">
                                        The retina is the light-sensing layer at the back of the eye. Conditions such as diabetic retinopathy, retinal tears and macular problems need timely diagnosis and expert management. People with diabetes should have a retinal examination every year.
                                    </p>

                                    <h3 className="seo-article-h3">Refractive Surgery Consultation</h3>
                                    <p className="seo-article-p">
                                        Many adults want to reduce or remove their dependence on glasses and contact lenses. A responsible hospital will check whether you are a suitable candidate, measure your corneas carefully and discuss realistic expectations, rather than promising the same result for everyone.
                                    </p>

                                    <h3 className="seo-article-h3">Dry Eye Treatment</h3>
                                    <p className="seo-article-p">
                                        Dry eye is extremely common among screen users and people exposed to dust, heat and air conditioning. A proper evaluation identifies whether the cause is reduced tear production or poor-quality tears, so that treatment can be targeted.
                                    </p>

                                    <h3 className="seo-article-h3">Paediatric Eye Care</h3>
                                    <p className="seo-article-p">
                                        Children&apos;s eyes need specialised attention. Squint, lazy eye, high refractive error and school-age vision problems are best treated early, when the visual system is still developing.
                                    </p>

                                    <h3 className="seo-article-h3">Contact Lens Services</h3>
                                    <p className="seo-article-p">
                                        Correct fitting and regular review help keep lens wear safe and comfortable.
                                    </p>

                                    <h3 className="seo-article-h3">Eye Infection, Allergy and Injury Care</h3>
                                    <p className="seo-article-p">
                                        Red eyes, discharge, swelling, stye and allergic conditions require proper diagnosis. Avoid self-medication, particularly with steroid-containing drops.
                                    </p>

                                    <h3 className="seo-article-h3">Eyelid and Minor Surgical Procedures</h3>
                                    <p className="seo-article-p">
                                        These include treatment for eyelid growths, drooping lids, blocked tear ducts and similar problems.
                                    </p>

                                    <h3 className="seo-article-h3">Emergency Eye Care</h3>
                                    <p className="seo-article-p">
                                        Sudden vision loss, chemical splashes, sharp injuries and severe pain demand immediate attention at a hospital equipped for eye emergencies.
                                    </p>
                                    <p className="seo-article-p">
                                        <em>
                                            [Client to confirm and edit the exact list of services, procedures and technology available at Oracle Eye Hospital.]
                                        </em>
                                    </p>
                                </div>

                                {/* Block 4: Why Eye Care Matters */}
                                <div className="seo-article-block" id="why-eye-care-matters">
                                    <h2 className="seo-article-h2">
                                        Why Eye Care Matters More Than You Think
                                    </h2>
                                    <p className="seo-article-p">
                                        Good vision supports almost everything in daily life: learning in children, productivity at work, safe driving, independence for older people and even emotional well-being. Studies and clinical experience consistently show that untreated vision problems affect school performance, increase the risk of accidents and falls, and reduce quality of life.
                                    </p>
                                    <p className="seo-article-p">
                                        Many serious eye conditions are painless in their early stages. By the time symptoms appear, some damage may already be permanent. That is why preventive eye care and a hospital you can return to regularly are far more valuable than seeking help only during an emergency.
                                    </p>
                                </div>

                                {/* Block 5: Eye Health Challenges in Moradabad */}
                                <div className="seo-article-block" id="eye-health-challenges">
                                    <h2 className="seo-article-h2">
                                        Eye Health Challenges in Moradabad
                                    </h2>
                                    <p className="seo-article-p">
                                        Local living and working conditions shape the eye problems doctors see:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>Dust, smoke and pollution contribute to irritation, allergies and dry eye.</li>
                                        <li>Hot, dry weather increases tear evaporation and discomfort.</li>
                                        <li>Metal, polishing and workshop environments raise the risk of eye injuries, foreign bodies and chronic irritation.</li>
                                        <li>Long screen hours among students, office workers and shopkeepers lead to digital eye strain.</li>
                                        <li>Rising diabetes cases increase the need for regular retinal screening.</li>
                                        <li>Ageing population: More older adults are developing cataract and glaucoma.</li>
                                        <li>Delayed treatment: Many people rely on home remedies or local chemists before seeing a specialist, allowing treatable problems to progress.</li>
                                    </ul>
                                    <p className="seo-article-p">
                                        A hospital that understands these local patterns can give practical, relevant advice, from workplace eye protection to screen habits and seasonal care.
                                    </p>
                                </div>

                                {/* Block 6: What To Expect */}
                                <div className="seo-article-block" id="what-to-expect">
                                    <h2 className="seo-article-h2">
                                        What to Expect When You Visit Oracle Eye Hospital
                                    </h2>
                                    <p className="seo-article-p">
                                        We want your visit to feel clear and comfortable from the moment you arrive.
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>
                                            <strong>Step 1: Registration and history.</strong> Our team notes your symptoms, medical history, medicines and previous eye reports.
                                        </li>
                                        <li>
                                            <strong>Step 2: Preliminary tests.</strong> Trained staff measure your vision and carry out initial checks, including eye pressure where needed.
                                        </li>
                                        <li>
                                            <strong>Step 3: Doctor consultation.</strong> The ophthalmologist examines your eyes in detail, reviews your results and may advise additional tests.
                                        </li>
                                        <li>
                                            <strong>Step 4: Clear explanation.</strong> You hear what the problem is, what treatment options exist, and what is best for your situation, in plain language.
                                        </li>
                                        <li>
                                            <strong>Step 5: Treatment plan.</strong> Whether it is glasses, medicines, a procedure or simply regular monitoring, you receive a plan with clear next steps and timelines.
                                        </li>
                                        <li>
                                            <strong>Step 6: Follow-up.</strong> We schedule review visits and guide you on what to do if symptoms change.
                                        </li>
                                    </ul>
                                    <p className="seo-article-p">
                                        Please bring your old glasses, previous prescriptions, reports, a list of current medicines, and, if you will be dilated, someone to accompany you home.
                                    </p>
                                </div>

                                {/* Block 7: Why Patients Choose Oracle */}
                                <div className="seo-article-block" id="why-choose">
                                    <h2 className="seo-article-h2">
                                        Why Patients Choose Oracle Eye Hospital
                                    </h2>
                                    <p className="seo-article-p">
                                        People in Moradabad and nearby towns choose Oracle Eye Hospital for reasons that go beyond a single service:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>
                                            <strong>Focus on eye care alone:</strong> Our attention is on eyes, not scattered across many specialties.
                                        </li>
                                        <li>
                                            <strong>Experienced ophthalmology team:</strong> Patients are examined and treated by qualified eye specialists.
                                        </li>
                                        <li>
                                            <strong>Accurate, evidence-based diagnosis:</strong> We rely on careful examination and appropriate tests, and avoid unnecessary procedures.
                                        </li>
                                        <li>
                                            <strong>Care for every age:</strong> Children, working adults and senior citizens receive attention suited to their needs.
                                        </li>
                                        <li>
                                            <strong>Transparent approach:</strong> We discuss options, benefits, limits and costs openly, so you can decide with confidence.
                                        </li>
                                        <li>
                                            <strong>Safe surgical care:</strong> Strict sterilisation and infection-control practices guide our procedures.
                                        </li>
                                        <li>
                                            <strong>Support during recovery:</strong> Clear instructions and follow-up visits help you heal safely.
                                        </li>
                                        <li>
                                            <strong>Local accessibility:</strong> Quality eye care that is close to home saves time, travel and stress for families across the region.
                                        </li>
                                    </ul>
                                    <p className="seo-article-p">
                                        <em>
                                            [Client to add: hospital address, number of years in service, doctor names and qualifications, patient numbers or surgeries performed, equipment, awards, accreditations and patient testimonials. Specific, verifiable details strengthen both trust and rankings.]
                                        </em>
                                    </p>
                                </div>

                                {/* Block 8: Questions To Ask */}
                                <div className="seo-article-block" id="questions-to-ask">
                                    <h2 className="seo-article-h2">
                                        Questions to Ask Before Choosing Any Eye Hospital
                                    </h2>
                                    <p className="seo-article-p">
                                        Do not hesitate to ask these questions wherever you go. A good hospital will welcome them:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>What are the qualifications and experience of the doctor who will treat me?</li>
                                        <li>Which tests are needed, and why?</li>
                                        <li>What are my treatment options, including the option of waiting or monitoring?</li>
                                        <li>What are the risks, benefits and expected results?</li>
                                        <li>How long is the recovery, and what restrictions will I have?</li>
                                        <li>What does the treatment cost, and what is included?</li>
                                        <li>Who do I contact if I have a problem after the procedure?</li>
                                        <li>How will my follow-up be handled?</li>
                                    </ul>
                                    <p className="seo-article-p">
                                        Clear, patient answers are a good sign. Vague or rushed answers deserve caution.
                                    </p>
                                </div>

                                {/* Block 9: Protecting Your Eyes */}
                                <div className="seo-article-block" id="protecting-your-eyes">
                                    <h2 className="seo-article-h2">
                                        Protecting Your Eyes: Simple Advice from Our Eye Specialists
                                    </h2>
                                    <ul className="seo-article-list">
                                        <li>
                                            Get a comprehensive eye examination every one to two years, and annually if you have diabetes, glaucoma risk or are over 40.
                                        </li>
                                        <li>Take regular breaks from screens using the 20-20-20 rule.</li>
                                        <li>Wear UV-protective sunglasses outdoors.</li>
                                        <li>Use protective glasses at work when dealing with dust, sparks, metal or chemicals.</li>
                                        <li>Do not rub your eyes, and wash hands before touching them.</li>
                                        <li>
                                            Avoid using eye drops without a doctor&apos;s advice, especially steroid or redness-relief drops.
                                        </li>
                                        <li>Keep diabetes and blood pressure under control.</li>
                                        <li>Eat a balanced diet rich in green vegetables, fruit and nuts, and avoid smoking.</li>
                                        <li>Have children&apos;s eyes tested before school and whenever you suspect a problem.</li>
                                        <li>Never ignore sudden changes in vision. Seek care at once.</li>
                                    </ul>
                                </div>
                            </article>
                        </div>

                        {/* Right Column: Sticky Sidebar */}
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
                                        <span>Book an Appointment</span>
                                    </h4>
                                    <AppointmentForm
                                        initialService="Comprehensive Eye Care"
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
                                                <li>
                                                    <a href="#overview">&bull; Overview</a>
                                                </li>
                                                <li>
                                                    <a href="#what-makes-best">&bull; What Makes the Best Hospital</a>
                                                </li>
                                                <li>
                                                    <a href="#eye-care-services">&bull; Eye Care Services</a>
                                                </li>
                                                <li>
                                                    <a href="#why-eye-care-matters">&bull; Why Eye Care Matters</a>
                                                </li>
                                                <li>
                                                    <a href="#eye-health-challenges">&bull; Eye Health in Moradabad</a>
                                                </li>
                                                <li>
                                                    <a href="#what-to-expect">&bull; What To Expect</a>
                                                </li>
                                                <li>
                                                    <a href="#why-choose">&bull; Why Choose Us</a>
                                                </li>
                                                <li>
                                                    <a href="#questions-to-ask">&bull; Questions To Ask</a>
                                                </li>
                                                <li>
                                                    <a href="#protecting-your-eyes">&bull; Eye Protection Tips</a>
                                                </li>
                                                <li>
                                                    <a href="#expert-doctors">&bull; Doctors</a>
                                                </li>
                                                <li>
                                                    <a href="#faq-section">&bull; FAQs</a>
                                                </li>
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
                                Receive comprehensive and compassionate eye care from experienced ophthalmologists at Oracle Eye Hospital, Moradabad.
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
                                        Dr. Kain is an experienced ophthalmologist with expertise in comprehensive eye care, cataract surgery, corneal disorders, refractive procedures and advanced eye treatment.
                                    </p>
                                    <div className="seo-doctor-footer">
                                        <span className="text-white-50">Comprehensive Eye Care</span>
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
                                        <div
                                            className="seo-doctor-avatar"
                                            style={{ borderColor: "#137c8b" }}
                                        >
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
                                        Dr. Rachana specializes in comprehensive eye diagnostics, paediatric vision assessment, dry eye management and personalised treatment plans for patients of all age groups.
                                    </p>
                                    <div className="seo-doctor-footer">
                                        <span className="text-white-50">
                                            Eye Check-ups &amp; Family Eye Care
                                        </span>
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
                            Frequently Asked Questions About the Best Eye Hospital in Moradabad
                        </h2>
                        <p className="seo-section-desc">
                            Clear answers to help you choose the right eye hospital and understand when to seek specialist eye care.
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
                                            <span className="pe-3">
                                                {faq.question || faq.q}
                                            </span>
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
            <section
                className="seo-section"
                style={{ backgroundColor: "#ffffff" }}
            >
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