"use client";
import DoctorBookingForm from "@/components/DoctorBookingForm";
import Link from "next/link";

export default function Page() {
  return (
    <>
      

	
<div className="dz-bnr-inr style-1  dz-bnr-inr-sm d-none" style={{"backgroundImage":"url(/Assets/img/inner-bg.jpg)"}}>
		<div className="container">
			<div className="dz-bnr-inr-entry d-table-cell">
				<h1 className="" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">Dr Sujata Tomar</h1>

			</div>
		</div>
	</div>


	
<section className="content-inner ">
		<div className="container">
			<div className="row">
				<div className="col-xl-5 m-b30">
					<aside className="side-bar sticky-top p-0">
						<div className="widget " data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
							<div className="dz-team">
								<div className="dz-media rounded">
									<img src="/Assets/img/team/6.png" />
								</div>
							</div>
						</div>
						<div className="form-wrapper style-1   doctor_form" data-aos="fade-up" data-aos-delay="400" data-aos-duration="800">
							<div className="form-body">
								<div className="title-head">
									<h2 className="form-title m-b20" data-aos="fade-up">Book Your Appointment</h2>
								</div>
								<DoctorBookingForm doctorName="Dr. Sujata Tomar" />
							</div>
						</div>

					</aside>
				</div>
				<div className="col-xl-7 m-b10 ps-xl-5">
					<h2 className="title" data-aos="fade-up">Dr. Sujata Tomar </h2>
					<div className="section-head style-6 m-b30 " data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
						<div className="sub-title  mb-3" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
							MBBS, MS, FRCS
						</div>

						<p className="fw-normal" data-aos="fade-up">
							Dr. Sujata Tomar is a highly skilled Consultant Ophthalmologist with expertise in cataract surgery, retinal examination, glaucoma management, uveitis treatment, dry eye management, and diabetic retinopathy care. She has extensive surgical experience, having successfully performed over 5,000 phacoemulsification cataract surgeries, including premium intraocular lens implantation (multifocal and toric IOLs), more than 2,000 Small Incision Cataract Surgeries (SICS), 200 pterygium excisions, and numerous intravitreal injections.
						</p>


						<p data-aos="fade-up">
							Dr.  Sujata completed her MBBS from Government Medical College, Mysore, followed by an MS in Ophthalmology from Dr. Ram Manohar Lohia Hospital, New Delhi. She further earned the prestigious FRCS (Ophthalmology) from the Royal College of Physicians and Surgeons of Glasgow. With her commitment to clinical excellence, surgical precision, and patient-centered care, she strives to deliver the highest standards of eye care and vision restoration.
						</p>


					</div>

					<div className="info-widget style-1 widget-sm  bg-light shadow-none m-b50 m-md-b20  doctor_form" data-aos="fade-up" data-aos-delay="800" data-aos-duration="800">
						<div className="widget-content">
							<h2 className="title" data-aos="fade-up">My Time Schedule</h2>
							<ul>
								<li>Monday <span>10:00AM - 8:00PM</span></li>
								<li>Tuesday <span>10:00AM - 8:00PM</span></li>
								<li>Wednesday <span>10:00AM - 8:00PM</span></li>
								<li>Thursday <span>10:00AM - 8:00PM</span></li>
								<li>Friday <span>10:00AM - 8:00PM</span></li>
								<li>Saturday <span>10:00AM - 8:00PM</span></li>
							</ul>
						</div>
					</div>
					<div className="info-widget style-2 shadow-none bg-light m-b50 m-md-b20  doctor_form" data-aos="fade-up" data-aos-delay="1000" data-aos-duration="800">
						<div className="row g-xl-5 g-4">
							<div className="col-md-6">
								<div className="icon-bx-wraper style-3 align-items-center">
									<div className="icon-bx bg-primary">
										<span className="icon-cell">
											<i className="feather icon-mail"></i>
										</span>
									</div>
									<div className="icon-content">
										<h3 className="dz-title fw-semibold" data-aos="fade-up">Send us a Mail</h3>
										<p data-aos="fade-up"><a href="mailto:oracleeyehospital@gmail.com" className="text-body"><span className="__cf_email__">oracleeyehospital@gmail.com</span></a></p>
									</div>
								</div>
							</div>
							<div className="col-md-6">
								<div className="icon-bx-wraper style-3 align-items-center">
									<div className="icon-bx bg-primary">
										<span className="icon-cell">
											<i className="feather icon-phone"></i>
										</span>
									</div>
									<div className="icon-content">
										<h3 className="dz-title fw-semibold" data-aos="fade-up">Call Us:</h3>
										<p data-aos="fade-up"><a href="tel:+91 8006803111" className="text-body">+91 8006803111</a></p>
									</div>
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	</section>



    </>
  );
}
