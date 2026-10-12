import AppointmentForm from "@/components/AppointmentForm";

export const metadata = {
  title: "Book an Appointment | Oracle Eye Hospital",
  description: "Request an appointment with an eye specialist at Oracle Eye Hospital, Moradabad.",
};

export default function AppointmentPage({ searchParams }) {
  const initialDoctor = typeof searchParams?.doctor === "string" ? searchParams.doctor : "";
  return (
    <>
      <div className="dz-bnr-inr style-1 dz-bnr-inr-sm" style={{ backgroundImage: "url(/Assets/img/inner-bg.jpg)" }}>
        <div className="container">
          <div className="dz-bnr-inr-entry d-table-cell">
            <h1>Get Appointment</h1>
          </div>
        </div>
      </div>
      <section className="content-inner bg-light appointment-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10">
              <div className="appointment-request-card">
                <div className="appointment-request-heading">
                  <span>Oracle Eye Hospital</span>
                  <h2>Book your appointment</h2>
                  <p>Fill in your details and our team will call you to confirm a convenient time.</p>
                </div>
                <AppointmentForm initialDoctor={initialDoctor} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
