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
export const DEFAULT_EYE_DOCTOR_FAQS = [
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

export default function Content({ faqs = DEFAULT_EYE_DOCTOR_FAQS }) {
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
                                        Eye Doctor in Moradabad: Expert Eye Care for Every Age at Oracle Eye Hospital
                                    </h2>
                                    <p className="seo-article-p">
                                        Your eyes work from the moment you wake up until you fall asleep. They help you read, work, drive, study, cook and recognise the people you love. Yet most of us pay attention to them only when something goes wrong: blurry vision, redness, pain, or a sudden spot in our sight.
                                    </p>
                                    <p className="seo-article-p">
                                        If you are searching for a trusted <strong>eye doctor in Moradabad</strong>, you want more than a quick check and a prescription. You want a doctor who listens, explains clearly, uses reliable diagnostic methods and gives you treatment that fits your life. That is the standard we aim for at Oracle Eye Hospital.
                                    </p>
                                    <p className="seo-article-p">
                                        This guide explains what an eye doctor does, the difference between an optometrist and an ophthalmologist, when you should book a visit, what eye problems are most common in Moradabad, and how to choose the right eye specialist for you and your family.
                                    </p>

                                    <div className="seo-article-callout">
                                        <h4>Why Choose Oracle Eye Hospital for Eye Care?</h4>
                                        <p>
                                            Our hospital provides comprehensive eye examinations, advanced diagnostics, treatment for common and complex eye conditions, and surgical care under one roof for children, adults and senior citizens.
                                        </p>
                                    </div>
                                </div>

                                {/* Block 2: What Does an Eye Doctor Do */}
                                <div className="seo-article-block" id="what-eye-doctor-does">
                                    <h2 className="seo-article-h2">
                                        What Does an Eye Doctor Do?
                                    </h2>
                                    <p className="seo-article-p">
                                        An eye doctor is a medical professional trained to examine, diagnose and treat conditions of the eyes and the visual system. Depending on the problem, an eye doctor may:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>Test your vision and prescribe glasses or contact lenses.</li>
                                        <li>Check the health of the retina, optic nerve, lens and cornea.</li>
                                        <li>Detect silent diseases such as glaucoma and diabetic retinopathy.</li>
                                        <li>Treat infections, allergies, injuries and inflammation.</li>
                                        <li>Manage chronic conditions such as dry eye.</li>
                                        <li>Perform surgery for cataract, squint, eyelid problems and other conditions.</li>
                                        <li>Guide you on protecting your eyes at work, at school and at home.</li>
                                    </ul>
                                    <p className="seo-article-p">
                                        Many serious eye diseases give no early warning. You can feel perfectly fine and still have a problem developing inside the eye. A regular examination by a qualified eye doctor is the only reliable way to catch these problems early.
                                    </p>

                                    <h3 className="seo-article-h3">
                                        Ophthalmologist, Optometrist and Optician: What Is the Difference?
                                    </h3>
                                    <p className="seo-article-p">
                                        People often use these terms interchangeably, but they mean different things:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>
                                            <strong>Ophthalmologist:</strong> A medical doctor who has completed medical school followed by specialised training in eye diseases and surgery. An ophthalmologist can diagnose and treat all eye conditions, prescribe medicines and perform surgery. When people search for an eye specialist in Moradabad or eye surgeon, this is usually who they need.
                                        </li>
                                        <li>
                                            <strong>Optometrist:</strong> A professional trained in measuring vision, detecting refractive errors and prescribing glasses or contact lenses. Optometrists work alongside ophthalmologists in many hospitals.
                                        </li>
                                        <li>
                                            <strong>Optician:</strong> A professional who prepares and fits spectacles and lenses based on a prescription.
                                        </li>
                                    </ul>
                                    <p className="seo-article-p">
                                        For any eye symptom beyond simple glasses, such as pain, redness, discharge, floaters, sudden vision changes or a family history of eye disease, you should see an ophthalmologist. A hospital with the full team under one roof makes the process smooth and saves you from visiting several places.
                                    </p>
                                </div>

                                {/* Block 3: When To See an Eye Doctor */}
                                <div className="seo-article-block" id="when-to-see-eye-doctor">
                                    <h2 className="seo-article-h2">
                                        When Should You See an Eye Doctor?
                                    </h2>
                                    <p className="seo-article-p">
                                        Many people wait too long. Here are the situations where you should book an appointment.
                                    </p>

                                    <h3 className="seo-article-h3">Book a Routine Visit If:</h3>
                                    <ul className="seo-article-list">
                                        <li>You have not had an eye examination in the last one to two years.</li>
                                        <li>You are over 40, as age-related changes begin around this time.</li>
                                        <li>You have difficulty reading small print or need to hold things at arm&apos;s length.</li>
                                        <li>You have frequent headaches after reading or screen use.</li>
                                        <li>You squint to see distant objects.</li>
                                        <li>You have diabetes, high blood pressure or thyroid disease.</li>
                                        <li>Someone in your family has glaucoma, retinal problems or early cataract.</li>
                                        <li>Your child struggles at school, sits too close to the board or rubs their eyes often.</li>
                                    </ul>

                                    <h3 className="seo-article-h3">Seek Prompt Care If You Notice:</h3>
                                    <ul className="seo-article-list">
                                        <li>Gradual blurring or cloudiness of vision.</li>
                                        <li>Eye redness that does not settle in a day or two.</li>
                                        <li>Persistent burning, itching or watering.</li>
                                        <li>Halos around lights, especially at night.</li>
                                        <li>New floaters or flashes of light.</li>
                                        <li>Double vision.</li>
                                        <li>Eye pain or heaviness.</li>
                                    </ul>

                                    <h3 className="seo-article-h3">Seek Emergency Care Immediately For:</h3>
                                    <ul className="seo-article-list">
                                        <li>Sudden loss of vision, partial or complete.</li>
                                        <li>A curtain or shadow across part of your vision.</li>
                                        <li>Severe eye pain, especially with nausea.</li>
                                        <li>Chemical splash in the eye.</li>
                                        <li>An injury from a sharp object, metal piece or firecracker.</li>
                                        <li>A red, painful eye with marked light sensitivity.</li>
                                    </ul>
                                    <p className="seo-article-p">
                                        Quick action can protect your sight. Some conditions, such as retinal detachment or acute glaucoma, need treatment within hours.
                                    </p>
                                </div>

                                {/* Block 4: Common Eye Problems */}
                                <div className="seo-article-block" id="common-eye-problems">
                                    <h2 className="seo-article-h2">
                                        Common Eye Problems We See in Moradabad
                                    </h2>
                                    <p className="seo-article-p">
                                        Local lifestyle and environment shape the eye problems people face. In and around Moradabad, doctors often see:
                                    </p>

                                    <h3 className="seo-article-h3">
                                        Refractive Errors: Short Sight, Long Sight and Astigmatism
                                    </h3>
                                    <p className="seo-article-p">
                                        Blurred vision caused by the eye&apos;s focusing system. It affects children, students and adults, and is corrected with glasses, contact lenses or surgery.
                                    </p>

                                    <h3 className="seo-article-h3">Cataract</h3>
                                    <p className="seo-article-p">
                                        A clouding of the natural lens that develops gradually, usually with age. It causes blurry, dull vision, glare and difficulty with night driving. Modern cataract surgery is a safe and routine day-care procedure that restores clear vision.
                                    </p>

                                    <h3 className="seo-article-h3">Glaucoma</h3>
                                    <p className="seo-article-p">
                                        Often called the silent thief of sight, glaucoma damages the optic nerve, usually without pain or early symptoms. Vision loss from glaucoma cannot be reversed, which makes early detection through regular pressure checks and optic nerve evaluation essential.
                                    </p>

                                    <h3 className="seo-article-h3">Diabetic Eye Disease</h3>
                                    <p className="seo-article-p">
                                        India has a large diabetic population, and diabetes can damage the retinal blood vessels. Diabetic retinopathy can progress silently, so every person with diabetes should have a dilated retinal examination at least once a year.
                                    </p>

                                    <h3 className="seo-article-h3">Dry Eye and Digital Eye Strain</h3>
                                    <p className="seo-article-p">
                                        Long hours on mobile phones and computers, along with dust, heat and air conditioning, lead to burning, gritty, tired eyes. Many people treat this with random drops for years when a proper evaluation would find the underlying cause.
                                    </p>

                                    <h3 className="seo-article-h3">Eye Infections and Allergies</h3>
                                    <p className="seo-article-p">
                                        Conjunctivitis, commonly known as pink eye, styes and allergic eye conditions are common, particularly during seasonal changes and in dusty conditions. Self-medication with steroid drops from a chemist can be dangerous and should be avoided.
                                    </p>

                                    <h3 className="seo-article-h3">Eye Injuries</h3>
                                    <p className="seo-article-p">
                                        Workshop injuries, metal particles, sparks, dust and road accidents cause a significant number of eye emergencies. Protective eyewear at work prevents many of them.
                                    </p>

                                    <h3 className="seo-article-h3">Squint and Lazy Eye in Children</h3>
                                    <p className="seo-article-p">
                                        Misaligned eyes and amblyopia, also called lazy eye, are best treated in early childhood. Delayed treatment can leave a child with permanent weak vision in one eye.
                                    </p>

                                    <h3 className="seo-article-h3">Retinal Problems</h3>
                                    <p className="seo-article-p">
                                        Retinal tears, detachments and degeneration can threaten vision seriously. Warning signs such as floaters, flashes and shadows deserve urgent examination.
                                    </p>

                                    <h3 className="seo-article-h3">Age-Related Changes</h3>
                                    <p className="seo-article-p">
                                        After 40, most people notice presbyopia, which is difficulty with close reading. Later in life, macular degeneration and other conditions may appear, which is another reason regular check-ups matter.
                                    </p>
                                </div>

                                {/* Block 5: Eye Examination */}
                                <div className="seo-article-block" id="eye-examination">
                                    <h2 className="seo-article-h2">
                                        What Happens During a Comprehensive Eye Examination?
                                    </h2>
                                    <p className="seo-article-p">
                                        Many patients feel anxious before their first visit. A complete eye check-up is painless and typically includes:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>
                                            <strong>Medical and eye history:</strong> Your doctor asks about symptoms, medicines, previous eye problems, diabetes, blood pressure and your family history.
                                        </li>
                                        <li>
                                            <strong>Visual acuity test:</strong> You read letters from a chart to measure how clearly you see at distance and near.
                                        </li>
                                        <li>
                                            <strong>Refraction test:</strong> The doctor determines whether you need glasses and the exact power. For children, special drops may be used to relax the focusing muscles and obtain an accurate measurement.
                                        </li>
                                        <li>
                                            <strong>Eye pressure measurement:</strong> This screens for glaucoma. The test is quick and usually painless.
                                        </li>
                                        <li>
                                            <strong>Slit-lamp examination:</strong> A magnifying microscope allows close inspection of the eyelids, cornea, lens and the front part of the eye.
                                        </li>
                                        <li>
                                            <strong>Dilated retinal examination:</strong> Drops widen the pupil so the doctor can see the retina and optic nerve at the back of the eye. Your vision may be blurry and light-sensitive for a few hours afterwards, so avoid driving immediately after.
                                        </li>
                                        <li>
                                            <strong>Additional tests when needed:</strong> These may include corneal mapping, optic nerve and retinal scans, visual field testing and dry eye assessments, depending on your condition.
                                        </li>
                                    </ul>
                                    <p className="seo-article-p">
                                        At the end of the visit, a good eye doctor explains the findings in simple language, answers your questions and agrees on a clear plan with you.
                                    </p>
                                </div>

                                {/* Block 6: Eye Care Services */}
                                <div className="seo-article-block" id="eye-care-services">
                                    <h2 className="seo-article-h2">
                                        Eye Care Services You May Need
                                    </h2>
                                    <p className="seo-article-p">
                                        A full-service eye hospital allows you to receive diagnosis and treatment in one place. Typical services include:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>Comprehensive eye check-ups for adults and seniors.</li>
                                        <li>Cataract evaluation and surgery.</li>
                                        <li>Glaucoma screening and management.</li>
                                        <li>Diabetic retinopathy screening and retina care.</li>
                                        <li>Refractive surgery consultation for patients who want to reduce dependence on glasses.</li>
                                        <li>Dry eye evaluation and treatment.</li>
                                        <li>Paediatric eye care for squint, lazy eye and school vision screening.</li>
                                        <li>Contact lens fitting and follow-up.</li>
                                        <li>Eye infection and allergy treatment.</li>
                                        <li>Eyelid and minor surgical procedures.</li>
                                        <li>Emergency eye care.</li>
                                    </ul>
                                    <p className="seo-article-p">
                                        <em>
                                            [Client to confirm and edit the exact list of services, procedures and technology available at Oracle Eye Hospital.]
                                        </em>
                                    </p>
                                </div>

                                {/* Block 7: Eye Care for Different Age Groups */}
                                <div className="seo-article-block" id="eye-care-age-groups">
                                    <h2 className="seo-article-h2">
                                        Eye Care for Different Age Groups
                                    </h2>

                                    <h3 className="seo-article-h3">Children</h3>
                                    <p className="seo-article-p">
                                        A child&apos;s vision develops fastest in the first years of life. Problems like squint, lazy eye or high refractive error are easier to treat early. Signs to watch for include squinting, tilting the head, sitting too close to screens, frequent eye rubbing, headaches and a drop in school performance. Children should have an eye check-up before starting school and as advised afterwards.
                                    </p>

                                    <h3 className="seo-article-h3">Young Adults and Working Professionals</h3>
                                    <p className="seo-article-p">
                                        Screen time, long study hours and poor lighting strain the eyes. Regular check-ups, correct glasses and healthy screen habits protect comfort and productivity.
                                    </p>

                                    <h3 className="seo-article-h3">Adults Over 40</h3>
                                    <p className="seo-article-p">
                                        This is when presbyopia appears and the risk of glaucoma, cataract and diabetic eye changes begins to rise. A yearly check-up is a sensible habit.
                                    </p>

                                    <h3 className="seo-article-h3">Senior Citizens</h3>
                                    <p className="seo-article-p">
                                        Cataract, glaucoma, macular changes and dry eye are more common. Better vision also reduces the risk of falls and improves independence and quality of life.
                                    </p>
                                </div>

                                {/* Block 8: Healthy Eye Habits */}
                                <div className="seo-article-block" id="healthy-eye-habits">
                                    <h2 className="seo-article-h2">
                                        Simple Habits for Healthy Eyes
                                    </h2>
                                    <p className="seo-article-p">
                                        Good eye health is built through everyday choices:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>
                                            Follow the 20-20-20 rule during screen use: every 20 minutes, look 20 feet away for 20 seconds.
                                        </li>
                                        <li>Wear UV-protective sunglasses outdoors.</li>
                                        <li>
                                            Use protective eyewear during construction, workshop, metal and polishing work, and while riding two-wheelers.
                                        </li>
                                        <li>
                                            Eat a balanced diet with green leafy vegetables, fruit, nuts and fish, and drink enough water.
                                        </li>
                                        <li>Do not rub your eyes, particularly when something is in them.</li>
                                        <li>Keep your blood sugar and blood pressure under control.</li>
                                        <li>Avoid smoking, which raises the risk of cataract and macular degeneration.</li>
                                        <li>
                                            Never use leftover or chemist-suggested steroid drops without a doctor&apos;s advice.
                                        </li>
                                        <li>Maintain contact lens hygiene and never sleep in lenses unless prescribed.</li>
                                        <li>Sleep well, because tired eyes feel dry and strained.</li>
                                        <li>Get your eyes tested regularly, even when you see well.</li>
                                    </ul>
                                </div>

                                {/* Block 9: How To Choose */}
                                <div className="seo-article-block" id="choose-eye-doctor">
                                    <h2 className="seo-article-h2">
                                        How to Choose the Right Eye Doctor in Moradabad
                                    </h2>
                                    <p className="seo-article-p">
                                        With many choices available, here is what to look for:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>
                                            <strong>Qualifications and experience:</strong> Check that the doctor is a qualified ophthalmologist with experience in the condition you have.
                                        </li>
                                        <li>
                                            <strong>Complete diagnostic facilities:</strong> Accurate treatment depends on accurate diagnosis. A hospital with proper testing equipment helps avoid guesswork.
                                        </li>
                                        <li>
                                            <strong>Clear communication:</strong> A good doctor explains the problem, the options, the expected results and the cost without pressure.
                                        </li>
                                        <li>
                                            <strong>Ethical advice:</strong> You should never feel pushed towards surgery or expensive products you do not need. The right doctor tells you honestly when treatment is not yet required.
                                        </li>
                                        <li>
                                            <strong>Range of services:</strong> A hospital that covers cataract, glaucoma, retina, children and emergencies means you can stay with the same team for years.
                                        </li>
                                        <li>
                                            <strong>Follow-up care:</strong> Eye treatment does not end after a procedure. Reliable aftercare protects your results.
                                        </li>
                                        <li>
                                            <strong>Hygiene and patient comfort:</strong> A clean, organised setting, reasonable waiting times and respectful staff all matter.
                                        </li>
                                        <li>
                                            <strong>Reputation and patient feedback:</strong> Honest reviews and word of mouth from people in your community are valuable.
                                        </li>
                                    </ul>
                                </div>

                                {/* Block 10: Why Choose Oracle */}
                                <div className="seo-article-block" id="why-choose">
                                    <h2 className="seo-article-h2">
                                        Why Patients Choose Oracle Eye Hospital for Eye Care in Moradabad
                                    </h2>
                                    <p className="seo-article-p">
                                        At Oracle Eye Hospital, our approach is built around the patient&apos;s sight, safety and understanding:
                                    </p>
                                    <ul className="seo-article-list">
                                        <li>
                                            <strong>Patient-first consultations:</strong> Time to listen, examine properly and explain your condition clearly.
                                        </li>
                                        <li>
                                            <strong>Complete eye care under one roof:</strong> From routine check-ups to advanced treatment, so you do not have to move between clinics.
                                        </li>
                                        <li>
                                            <strong>Accurate diagnosis:</strong> Careful examination and appropriate tests form the basis of every treatment plan.
                                        </li>
                                        <li>
                                            <strong>Care for the whole family:</strong> Children, adults and senior citizens can all receive treatment at the same hospital.
                                        </li>
                                        <li>
                                            <strong>Honest guidance:</strong> We recommend treatment only when it is needed and explain the options openly.
                                        </li>
                                        <li>
                                            <strong>Support through recovery:</strong> Clear instructions and follow-up visits help you heal well.
                                        </li>
                                        <li>
                                            <strong>Easy access for Moradabad and nearby towns:</strong> Patients from surrounding areas can receive quality eye care close to home.
                                        </li>
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
                                                    <a href="#what-eye-doctor-does">&bull; What an Eye Doctor Does</a>
                                                </li>
                                                <li>
                                                    <a href="#when-to-see-eye-doctor">&bull; When To See a Doctor</a>
                                                </li>
                                                <li>
                                                    <a href="#common-eye-problems">&bull; Common Eye Problems</a>
                                                </li>
                                                <li>
                                                    <a href="#eye-examination">&bull; Eye Examination</a>
                                                </li>
                                                <li>
                                                    <a href="#eye-care-services">&bull; Eye Care Services</a>
                                                </li>
                                                <li>
                                                    <a href="#eye-care-age-groups">&bull; Eye Care by Age</a>
                                                </li>
                                                <li>
                                                    <a href="#healthy-eye-habits">&bull; Healthy Eye Habits</a>
                                                </li>
                                                <li>
                                                    <a href="#choose-eye-doctor">&bull; Choosing a Doctor</a>
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
                                Meet Our Senior Eye Specialists
                            </h2>
                            <p className="seo-section-desc text-white-50">
                                Receive comprehensive eye care from experienced ophthalmologists at Oracle Eye Hospital, Moradabad.
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
                            Frequently Asked Questions About Eye Doctors in Moradabad
                        </h2>
                        <p className="seo-section-desc">
                            Clear answers to help you choose the right eye specialist and understand when to seek eye care.
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