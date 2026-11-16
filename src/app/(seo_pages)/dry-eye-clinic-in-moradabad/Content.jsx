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
export const DEFAULT_DRY_EYE_FAQS = [
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

export default function Content({ faqs = DEFAULT_DRY_EYE_FAQS }) {
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
                                        Dry Eye Clinic in Moradabad: Complete Care for Dry, Burning and Tired Eyes at Oracle Eye Hospital
                                    </h2>
                                    <p className="seo-article-p">
                                        Do your eyes burn by evening? Do they feel gritty, heavy or strangely watery after a few hours on your phone or laptop? Many people in Moradabad live with these symptoms for months or even years. They assume it is just tiredness, dust or age. In reality, these are classic signs of <strong>dry eye disease</strong>, a common but often untreated condition that can affect your comfort, your work and your vision.
                                    </p>
                                    <p className="seo-article-p">
                                        If you are searching for a <strong>dry eye clinic in Moradabad</strong>, Oracle Eye Hospital offers a structured, evidence-based approach. We do not just hand you a bottle of eye drops and send you home. We find out why your eyes are dry and build a treatment plan around the cause.
                                    </p>
                                    <p className="seo-article-p">
                                        This guide explains what dry eye is, why it is so common in Moradabad, how a dry eye clinic diagnoses and treats it, and when you should see a specialist.
                                    </p>

                                    <div className="seo-article-callout">
                                        <h4>Why Choose Oracle Eye Hospital for Dry Eye Care?</h4>
                                        <p>
                                            Our dry eye clinic focuses on identifying the root cause of your symptoms through detailed tear film, eyelid, corneal and meibomian gland evaluation. Treatment is personalised according to your lifestyle, occupation, severity and underlying eye condition.
                                        </p>
                                    </div>
                                </div>

                                {/* Block 2: What Is Dry Eye Disease */}
                                <div className="seo-article-block" id="understanding-dry-eye">
                                    <h2 className="seo-article-h2">
                                        What Is Dry Eye Disease?
                                    </h2>
                                    <p className="seo-article-p">
                                        Your eyes need a healthy layer of tears to stay comfortable and see clearly. This tear film is not just water. It has three layers:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>
                                            <strong>An oily outer layer</strong>, made by the meibomian glands in your eyelids, which stops tears from evaporating too fast.
                                        </li>
                                        <li>
                                            <strong>A watery middle layer</strong>, made by the lacrimal glands, which cleans and nourishes the eye surface.
                                        </li>
                                        <li>
                                            <strong>A mucus inner layer</strong>, which helps tears spread evenly over the eye.
                                        </li>
                                    </ul>
                                    <p className="seo-article-p">
                                        Dry eye disease develops when your eyes do not make enough tears, or when the tears you make are poor in quality and evaporate too quickly. The surface of the eye becomes inflamed and irritated. Without treatment, the problem can keep getting worse.
                                    </p>
                                    <p className="seo-article-p">
                                        Dry eye is not a minor inconvenience. Left unmanaged, it can cause blurred vision, damage to the corneal surface, frequent infections and difficulty wearing contact lenses. It can also reduce the success of cataract and refractive surgery if it is not treated beforehand.
                                    </p>

                                    <h3 className="seo-article-h3">Common Symptoms of Dry Eye</h3>
                                    <p className="seo-article-p">
                                        Dry eye does not always feel dry. In fact, one of the most confusing symptoms is excessive watering. Here are the signs to watch for:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>Burning, stinging or itching in the eyes.</li>
                                        <li>A gritty feeling, as if sand or dust is stuck in your eye.</li>
                                        <li>Redness, especially towards the end of the day.</li>
                                        <li>Watery eyes, as the eye floods itself in response to irritation.</li>
                                        <li>Blurred or fluctuating vision that improves after blinking.</li>
                                        <li>Eye fatigue while reading, driving or using screens.</li>
                                        <li>Sensitivity to light.</li>
                                        <li>Stringy mucus around the eyes.</li>
                                        <li>Difficulty wearing contact lenses.</li>
                                        <li>A heavy feeling in the eyelids, or eyes that feel tired on waking.</li>
                                    </ul>
                                    <p className="seo-article-p">
                                        If you notice two or more of these symptoms regularly, a dry eye evaluation is worth your time.
                                    </p>

                                    <h3 className="seo-article-h3">Why Dry Eye Is So Common in Moradabad</h3>
                                    <p className="seo-article-p">
                                        Dry eye is a global problem, but several local factors make it especially relevant for people living in and around Moradabad:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>
                                            <strong>Dust and air pollution:</strong> Dust, smoke and fine particles in the air irritate the eye surface and disturb the tear film. Dry and windy months make this worse.
                                        </li>
                                        <li>
                                            <strong>Heat and dry weather:</strong> Long, hot summers and low humidity speed up tear evaporation. Winters bring dry air and, indoors, heaters that dry the eyes further.
                                        </li>
                                        <li>
                                            <strong>Industrial and workshop environments:</strong> Moradabad is known for its metal and handicraft industry. People working near furnaces, polishing units, fumes and fine metal dust are exposed to irritants that can inflame the eyes and eyelid glands.
                                        </li>
                                        <li>
                                            <strong>Long screen hours:</strong> Office workers, students, shopkeepers and anyone who spends hours on a mobile phone blink far less than normal. Less blinking means less tear spreading and more evaporation. This is often called digital eye strain and is closely linked with dry eye.
                                        </li>
                                        <li>
                                            <strong>Air conditioners and coolers:</strong> Constant air blowing across the face dries the eye surface, whether in an office, a car or at home.
                                        </li>
                                        <li>
                                            <strong>Two-wheeler travel:</strong> Riding without eye protection exposes the eyes to wind, dust and sunlight, which can aggravate dryness.
                                        </li>
                                        <li>
                                            <strong>Smoking and passive smoke:</strong> Tobacco smoke is a well-known irritant for the tear film.
                                        </li>
                                    </ul>
                                    <p className="seo-article-p">
                                        Understanding your own risk factors is the first step to controlling dry eye. This is why a proper clinical assessment matters more than simply buying over-the-counter drops.
                                    </p>

                                    <h3 className="seo-article-h3">Other Causes and Risk Factors</h3>
                                    <p className="seo-article-p">
                                        Beyond environment, dry eye can be linked to:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>
                                            <strong>Age:</strong> Tear production naturally decreases after 40, and the condition is more common in women, particularly around and after menopause because of hormonal changes.
                                        </li>
                                        <li>
                                            <strong>Meibomian gland dysfunction (MGD):</strong> Blocked or inflamed oil glands in the eyelids are the most common cause of evaporative dry eye.
                                        </li>
                                        <li>
                                            <strong>Blepharitis:</strong> Chronic eyelid inflammation, often with flaky or crusted lashes.
                                        </li>
                                        <li>
                                            <strong>Contact lens wear:</strong> Particularly extended wear or poor lens hygiene.
                                        </li>
                                        <li>
                                            <strong>Medical conditions:</strong> Diabetes, thyroid disorders, rheumatoid arthritis, Sjogren&apos;s syndrome and other autoimmune conditions.
                                        </li>
                                        <li>
                                            <strong>Medications:</strong> Some antihistamines, antidepressants, blood pressure medicines and hormonal drugs can reduce tear production.
                                        </li>
                                        <li>
                                            <strong>Eye surgery:</strong> LASIK, cataract surgery and other procedures can temporarily affect tear production.
                                        </li>
                                        <li>
                                            <strong>Eyelid problems:</strong> Incomplete blinking or eyelids that do not close fully, especially during sleep.
                                        </li>
                                        <li>
                                            <strong>Eye drop overuse:</strong> Frequent use of drops containing preservatives, or whitening drops, can actually worsen the surface problem.
                                        </li>
                                    </ul>

                                    <h3 className="seo-article-h3">Two Main Types of Dry Eye</h3>
                                    <p className="seo-article-p">
                                        A good dry eye clinic identifies which type you have, because treatment differs.
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>
                                            <strong>Evaporative dry eye:</strong> This is the most common type. The eye makes enough watery tears, but they evaporate too quickly because the oily layer is poor, usually due to meibomian gland dysfunction.
                                        </li>
                                        <li>
                                            <strong>Aqueous-deficient dry eye:</strong> This means the lacrimal glands do not produce enough watery tears. It is often seen with ageing, autoimmune disease or certain medications.
                                        </li>
                                    </ul>
                                    <p className="seo-article-p">
                                        Many patients have a mix of both types. Treating only one side leaves the problem half-solved.
                                    </p>
                                </div>

                                {/* Block 3: Diagnosis */}
                                <div className="seo-article-block" id="diagnosis">
                                    <h2 className="seo-article-h2">
                                        How Dry Eye Is Diagnosed at Oracle Eye Hospital
                                    </h2>
                                    <p className="seo-article-p">
                                        Accurate diagnosis is the foundation of effective dry eye treatment. A thorough evaluation at our clinic typically includes:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>
                                            <strong>Detailed history:</strong> We ask about your symptoms, screen time, work environment, contact lens use, medications, previous surgeries and general health.
                                        </li>
                                        <li>
                                            <strong>Slit-lamp examination:</strong> A special microscope allows the doctor to closely inspect your eyelids, lashes, tear film, conjunctiva and cornea.
                                        </li>
                                        <li>
                                            <strong>Tear film break-up time (TBUT):</strong> This measures how quickly your tear film breaks apart between blinks. A fast break-up points to an unstable tear film.
                                        </li>
                                        <li>
                                            <strong>Tear volume assessment:</strong> Tests such as the Schirmer test measure how many tears your eyes produce.
                                        </li>
                                        <li>
                                            <strong>Corneal staining:</strong> Harmless dyes highlight dry or damaged areas on the eye surface.
                                        </li>
                                        <li>
                                            <strong>Meibomian gland evaluation:</strong> The doctor checks the eyelid glands for blockage, thickened secretions and gland drop-out, which indicates the type and severity of evaporative dry eye.
                                        </li>
                                        <li>
                                            <strong>Blink and eyelid assessment:</strong> Incomplete blinking and eyelid position problems are checked, since they are often overlooked.
                                        </li>
                                    </ul>
                                    <p className="seo-article-p">
                                        Using these findings, the doctor grades your dry eye as mild, moderate or severe and explains it in plain language, so you understand exactly what is happening.
                                    </p>
                                </div>

                                {/* Block 4: Treatment */}
                                <div className="seo-article-block" id="treatment-options">
                                    <h2 className="seo-article-h2">
                                        Dry Eye Treatment Options in Moradabad
                                    </h2>
                                    <p className="seo-article-p">
                                        There is no single one-size-fits-all cure. Treatment is stepwise, starting with simple measures and moving to advanced options where needed. Depending on your diagnosis, your plan may include:
                                    </p>

                                    <h3 className="seo-article-h3">1. Lifestyle and Environmental Changes</h3>
                                    <p className="seo-article-p">
                                        Small habit changes often make a big difference. We guide you on screen breaks, blinking exercises, workplace setup, hydration, protective eyewear and managing exposure to dust, smoke and air-conditioning.
                                    </p>

                                    <h3 className="seo-article-h3">2. Lubricating Eye Drops and Gels</h3>
                                    <p className="seo-article-p">
                                        Preservative-free artificial tears are usually recommended for frequent use. Your doctor will advise which type suits you: drops for daytime, gels or ointments for night, or specific formulations for evaporative dry eye.
                                    </p>

                                    <h3 className="seo-article-h3">3. Anti-Inflammatory Medication</h3>
                                    <p className="seo-article-p">
                                        Because dry eye involves inflammation, prescription drops may be used for a defined period to calm the eye surface and help it heal. These should always be taken under medical supervision.
                                    </p>

                                    <h3 className="seo-article-h3">4. Warm Compress and Eyelid Hygiene Therapy</h3>
                                    <p className="seo-article-p">
                                        For meibomian gland dysfunction, regular warm compresses and gentle eyelid cleaning loosen blocked oils and restore healthy gland function. Your doctor will teach you the right technique, since doing it incorrectly gives little benefit.
                                    </p>

                                    <h3 className="seo-article-h3">5. In-Clinic Procedures for Gland Dysfunction</h3>
                                    <p className="seo-article-p">
                                        Where home care is not enough, in-clinic treatments can help unblock the eyelid glands and improve the quality of your tear film. Ask our team which options are suitable for your case.
                                    </p>

                                    <h3 className="seo-article-h3">6. Punctal Plugs</h3>
                                    <p className="seo-article-p">
                                        Tiny plugs placed in the tear drainage openings keep your natural tears on the eye surface longer. This is a quick, minimally invasive procedure for suitable patients.
                                    </p>

                                    <h3 className="seo-article-h3">7. Treating Underlying Conditions</h3>
                                    <p className="seo-article-p">
                                        If your dry eye is linked to blepharitis, allergies, thyroid disease, diabetes or medication side effects, we work on those causes and coordinate with your physician where needed.
                                    </p>

                                    <h3 className="seo-article-h3">8. Nutritional Support</h3>
                                    <p className="seo-article-p">
                                        Doctors sometimes recommend dietary changes, such as foods rich in omega-3 fatty acids, along with adequate water intake, as supportive care.
                                    </p>

                                    <h3 className="seo-article-h3">9. Advanced Care for Severe Dry Eye</h3>
                                    <p className="seo-article-p">
                                        Severe cases may need specialised treatments such as autologous serum drops or other advanced options, depending on the doctor&apos;s judgment.
                                    </p>
                                    <p className="seo-article-p">
                                        Your treatment plan is reviewed during follow-up visits and adjusted based on your response. Dry eye is usually a chronic condition that is managed rather than cured overnight, and consistent follow-up is what gives lasting results.
                                    </p>
                                </div>

                                {/* Block 5: Home Care */}
                                <div className="seo-article-block" id="home-care">
                                    <h2 className="seo-article-h2">
                                        Simple Home Care Tips to Reduce Dry Eye
                                    </h2>
                                    <p className="seo-article-p">
                                        These habits support your treatment and can help prevent symptoms from returning:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>
                                            <strong>Follow the 20-20-20 rule:</strong> Every 20 minutes, look at something 20 feet away for at least 20 seconds.
                                        </li>
                                        <li>Blink fully and often, especially while using a phone or computer.</li>
                                        <li>Place screens slightly below eye level so your eyes are less widely open.</li>
                                        <li>Avoid direct airflow from fans, coolers, AC vents or car heaters.</li>
                                        <li>Wear wraparound sunglasses or protective glasses outdoors, and a helmet visor or glasses on a two-wheeler.</li>
                                        <li>Stay hydrated throughout the day.</li>
                                        <li>Do not rub your eyes, as this can worsen inflammation and injure the surface.</li>
                                        <li>Keep your eyelids clean, especially if you have flaky lashes.</li>
                                        <li>Use only the drops your doctor recommends and avoid redness-relief drops.</li>
                                        <li>Take care with contact lenses, follow wearing schedules and consider breaks if you have discomfort.</li>
                                        <li>Get enough sleep, since poor sleep can worsen eye surface problems.</li>
                                    </ul>
                                </div>

                                {/* Block 6: When To See Specialist */}
                                <div className="seo-article-block" id="when-to-see-specialist">
                                    <h2 className="seo-article-h2">
                                        When Should You See a Dry Eye Specialist?
                                    </h2>
                                    <p className="seo-article-p">
                                        Book an appointment if:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>Your symptoms last more than a couple of weeks.</li>
                                        <li>Drops from the pharmacy give only short relief.</li>
                                        <li>Your vision blurs or fluctuates.</li>
                                        <li>You are a contact lens wearer who cannot tolerate lenses anymore.</li>
                                        <li>You are planning cataract or LASIK surgery and have dry eye symptoms.</li>
                                        <li>You have diabetes, thyroid disease or an autoimmune condition.</li>
                                        <li>You work long hours on screens or in dusty, hot or smoky conditions.</li>
                                    </ul>
                                    <p className="seo-article-p">
                                        Seek urgent eye care if you experience severe pain, sudden loss of vision, marked redness with light sensitivity, or discharge with swelling. These may be signs of something more serious than dry eye.
                                    </p>
                                </div>

                                {/* Block 7: Why Choose */}
                                <div className="seo-article-block" id="why-choose">
                                    <h2 className="seo-article-h2">
                                        Why Choose Oracle Eye Hospital as Your Dry Eye Clinic in Moradabad?
                                    </h2>
                                    <p className="seo-article-p">
                                        Choosing the right eye care provider affects how quickly you feel better. Here is what patients can expect from Oracle Eye Hospital:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>
                                            <strong>Cause-focused approach:</strong> We look for the reason behind your symptoms instead of only masking them.
                                        </li>
                                        <li>
                                            <strong>Thorough eye examination:</strong> Tear film, eyelid and corneal assessment form part of your evaluation.
                                        </li>
                                        <li>
                                            <strong>Personalised treatment plans:</strong> Your profession, lifestyle, age and severity all shape your plan.
                                        </li>
                                        <li>
                                            <strong>Clear explanation:</strong> You will understand your diagnosis, your medicines and how to use them correctly.
                                        </li>
                                        <li>
                                            <strong>Follow-up care:</strong> Dry eye needs monitoring, and we track your progress and adjust treatment.
                                        </li>
                                        <li>
                                            <strong>Comprehensive eye care under one roof:</strong> From routine check-ups to surgical care, you do not need to travel far for related eye problems.
                                        </li>
                                        <li>
                                            <strong>Convenient for Moradabad and nearby towns:</strong> Patients from surrounding areas can access specialist dry eye care without travelling to bigger cities.
                                        </li>
                                    </ul>
                                    <p className="seo-article-p">
                                        <em>
                                            [Client to add: hospital address, doctor names and qualifications, equipment available, and patient testimonials to strengthen trust and local relevance.]
                                        </em>
                                    </p>
                                </div>

                                {/* Block 8: Who Can Benefit */}
                                <div className="seo-article-block" id="who-can-benefit">
                                    <h2 className="seo-article-h2">
                                        Who Can Benefit from Our Dry Eye Clinic?
                                    </h2>
                                    <p className="seo-article-p">
                                        Our dry eye services are designed for:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>Office workers and students with heavy screen use.</li>
                                        <li>People in industrial, workshop or outdoor jobs.</li>
                                        <li>Contact lens users.</li>
                                        <li>Senior citizens with age-related dryness.</li>
                                        <li>Patients with diabetes or autoimmune conditions.</li>
                                        <li>Patients before or after cataract or refractive surgery.</li>
                                        <li>Anyone with persistent burning, redness or irritation.</li>
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
                                        initialService="Dry Eye Clinic"
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
                                                    <a href="#understanding-dry-eye">&bull; What Is Dry Eye</a>
                                                </li>
                                                <li>
                                                    <a href="#diagnosis">&bull; Diagnosis</a>
                                                </li>
                                                <li>
                                                    <a href="#treatment-options">&bull; Treatment</a>
                                                </li>
                                                <li>
                                                    <a href="#home-care">&bull; Home Care</a>
                                                </li>
                                                <li>
                                                    <a href="#when-to-see-specialist">&bull; When To See a Specialist</a>
                                                </li>
                                                <li>
                                                    <a href="#why-choose">&bull; Why Choose Us</a>
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
                                Meet Our Dry Eye Specialists
                            </h2>
                            <p className="seo-section-desc text-white-50">
                                Get personalised dry eye evaluation and treatment from experienced ophthalmologists at Oracle Eye Hospital, Moradabad.
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
                                        Dr. Kain is an experienced ophthalmologist with expertise in comprehensive eye care, corneal surface disorders, dry eye management and advanced eye surgery.
                                    </p>
                                    <div className="seo-doctor-footer">
                                        <span className="text-white-50">Dry Eye &amp; Cornea Care</span>
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
                                        Dr. Rachana specializes in comprehensive eye diagnostics, eyelid and tear film assessment, and personalised treatment plans for patients with dry eye and ocular surface discomfort.
                                    </p>
                                    <div className="seo-doctor-footer">
                                        <span className="text-white-50">
                                            Dry Eye &amp; Comprehensive Care
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
                            Frequently Asked Questions About Dry Eye Treatment in Moradabad
                        </h2>
                        <p className="seo-section-desc">
                            Clear answers to help you understand dry eye symptoms, causes and treatment options.
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