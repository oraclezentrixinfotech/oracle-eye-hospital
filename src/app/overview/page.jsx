"use client";
import Link from "next/link";
import StatsCounters from "@/components/StatsCounters";

export default function Page() {
  return (
    <>
      

	
<div className="dz-bnr-inr style-1  dz-bnr-inr-sm" style={{"backgroundImage":"url(/Assets/img/inner-bg.jpg)"}}>
		<div className="container">
			<div className="dz-bnr-inr-entry d-table-cell">
				<h1 className="" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">Overview</h1>

			</div>
		</div>
	</div>



	
<section className="content-inner overlay-opacity-10 overflow-hidden  " style={{"backgroundImage":"url(/Assets/images/background/bg7.webp)"}}>
		<div className="container">
			<div className="row content-wrapper style-1 m-b30 justify-content-center">
				<div className="col-xxl-6 col-xl-6 col-lg-6">
					<div className="content-media m-b30">
						<div className="dz-media">
							<img src="/Assets/img/about/2.png" className="side-media" />
							<img src="/Assets/img/about/1.png" />
						</div>


						<div className="item1" data-bottom-top="transform: translateY(-30px)" data-top-bottom="transform: translateY(30px)">
							<div className="svg-rotate-wrapper">

								<svg viewBox="0 0 100 100" className="rotating-text-svg">
									<defs>
										<path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"></path>
									</defs>
									<text fill="#ffffff" fontSize="13" wordSpacing="-4" letterSpacing="3">
										<textPath href="#circlePath">ORACLE &nbsp;&nbsp;&nbsp; EYE &nbsp;&nbsp;&nbsp; HOSPITAL &nbsp;&nbsp;&nbsp;</textPath>
									</text>
								</svg>

								<i className="icon feather icon-arrow-up-right center-arrow-icon"></i>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xxl-6 col-xl-6 col-lg-6">
					<div className="section-head style-14 m-b30 " data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
						<span className="sub-title">Welcome to Ophthalmology</span>
						<h2 className="title" data-aos="fade-up">We Preserve, Enhance And Protect Your Vision</h2>
						<p data-aos="fade-up">Trusted ophthalmic care with world-class expertise, advanced technology, and compassionate treatment for patients of all ages.</p>
						<p data-aos="fade-up">
							<b>We believe in high quality</b> patient care. Currently, we have highly skilled professionals to take care of our large patient base.
							We take pride in letting you know that we match our growing volume of work with improving quality.
						</p>
					</div>
					<StatsCounters />

				</div>
			</div>
		</div>
	</section>
















    </>
  );
}
