"use client";
import { useEffect, useRef } from "react";

function formatNumberWithCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function StatsCounters() {
  const containerRef = useRef(null);
  const surgeriesRef = useRef(null);
  const patientsRef = useRef(null);
  const yearsRef = useRef(null);
  const isStarted = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isStarted.current) {
            isStarted.current = true;

            const duration = 2500; // 2.5s steady continuous smooth counting
            const surgeryTarget = 25000;
            const patientTarget = 50000;
            const yearTarget = 15;

            let startTime = null;

            const animate = (timestamp) => {
              if (!startTime) startTime = timestamp;
              const elapsed = timestamp - startTime;
              const progress = Math.min(elapsed / duration, 1);

              // Linear continuous motion matching reference website jQuery CounterUp
              // (No heavy cubic easing that causes it to stall or crawl at the end)
              const currentSurgeries = Math.floor(progress * surgeryTarget);
              const currentPatients = Math.floor(progress * patientTarget);
              const currentYears = Math.floor(progress * yearTarget);

              if (surgeriesRef.current) {
                surgeriesRef.current.innerText = formatNumberWithCommas(currentSurgeries);
              }
              if (patientsRef.current) {
                patientsRef.current.innerText = formatNumberWithCommas(currentPatients);
              }
              if (yearsRef.current) {
                yearsRef.current.innerText = currentYears.toString();
              }

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                // Ensure exact final numbers
                if (surgeriesRef.current) surgeriesRef.current.innerText = "25,000";
                if (patientsRef.current) patientsRef.current.innerText = "50,000";
                if (yearsRef.current) yearsRef.current.innerText = "15";
              }
            };

            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="row m-b10">
      <div className="col-xxl-4 col-sm-4 col-6 wow fadeInRight" data-wow-delay="0.6s" data-wow-duration="0.8s">
        <div className="content-bx style-1 m-b30">
          <span className="content-text">
            <span ref={surgeriesRef} className="counter">
              0
            </span>
            +
          </span>
          <h3 className="title m-b0">Surgeries Done</h3>
        </div>
      </div>
      <div className="col-xxl-4 col-sm-4 col-6 wow fadeInRight" data-wow-delay="0.8s" data-wow-duration="0.8s">
        <div className="content-bx style-1 m-b30">
          <span className="content-text">
            <span ref={patientsRef} className="counter">
              0
            </span>
            +
          </span>
          <h3 className="title m-b0">Happy Patients</h3>
        </div>
      </div>
      <div className="col-xxl-4 col-sm-4 col-6 wow fadeInRight" data-wow-delay="1.0s" data-wow-duration="0.8s">
        <div className="content-bx style-1 m-b30">
          <span className="content-text">
            <span ref={yearsRef} className="counter">
              0
            </span>
            +
          </span>
          <h3 className="title m-b0">Years of Excellence</h3>
        </div>
      </div>
    </div>
  );
}
