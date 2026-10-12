"use client";
import DoctorBookingForm from "@/components/DoctorBookingForm";
import Link from "next/link";

export default function Page() {
  return (
    <>
      

	
<div className="dz-bnr-inr style-1  dz-bnr-inr-sm d-none" style={{"backgroundImage":"url(/Assets/img/inner-bg.jpg)"}}>
		<div className="container">
			<div className="dz-bnr-inr-entry d-table-cell">
				<h1 className="" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">Rachana</h1>

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
									<img src="/Assets/img/team/8.png" />
								</div>
							</div>
						</div>
						<div className="form-wrapper style-1   doctor_form" data-aos="fade-up" data-aos-delay="400" data-aos-duration="800">
							<div className="form-body">
								<div className="title-head">
									<h2 className="form-title m-b20" data-aos="fade-up">Book Your Appointment</h2>
								</div>
								<DoctorBookingForm doctorName="Dr. Rachana" />
							</div>
						</div>

					</aside>
				</div>
				<div className="col-xl-7 m-b10 ps-xl-5">
					<h2 className="title" data-aos="fade-up">Dr. Rachana</h2>
					<div className="section-head style-6 m-b30 " data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
						<div className="sub-title  mb-3" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
							MBBS, MS
						</div>

						<p className="fw-normal" data-aos="fade-up">
							Dr. Rachana completed her M.B.B.S and M.S from Sarojini Naidu Medical College,
							Agra. She has served as a Senior Resident at L.L.R.M Medical College, Meerut, and has also worked as an Assistant Professor at G.B.C.M, Dehradun, and V.I.M.S, Gajraula.
						</p>


						<p data-aos="fade-up">
							Currently, she is working at Oracle Eye Hospital as a Comprehensive Ophthalmologist, providing expert eye care and management for a wide range of ocular conditions. With extensive clinical and academic experience,
							she is committed to delivering quality patient care and advancing excellence in ophthalmology.
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
