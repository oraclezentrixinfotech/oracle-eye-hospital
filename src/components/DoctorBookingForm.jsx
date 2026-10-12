"use client";
import { useState } from "react";

export default function DoctorBookingForm({ doctorName = "" }) {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    PhoneNumber: "",
    AppointmentDate: "",
    AppointmentTime: "",
    Service: "",
    Message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, PhoneNumber: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(formData.PhoneNumber)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({
        Name: "",
        Email: "",
        PhoneNumber: "",
        AppointmentDate: "",
        AppointmentTime: "",
        Service: "",
        Message: "",
      });
    }, 1000);
  };

  return (
    <>
      <form id="bookingForm" className="dzForm" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-sm-6 m-b20">
            <div className="floating-underline underline-1 input-white input-icon-left">
              <span className="input-group-text text-primary">
                <i className="feather icon-user"></i>
              </span>
              <input
                name="Name"
                type="text"
                className="form-control"
                placeholder="Your Name"
                required
                value={formData.Name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-sm-6 m-b20">
            <div className="floating-underline underline-1 input-white input-icon-left">
              <span className="input-group-text text-primary">
                <i className="feather icon-mail"></i>
              </span>
              <input
                name="Email"
                type="email"
                className="form-control"
                placeholder="Your Email"
                required
                value={formData.Email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-sm-6 m-b20">
            <div className="floating-underline underline-1 input-white input-icon-left">
              <span className="input-group-text text-primary">
                <i className="feather icon-phone"></i>
              </span>
              <input
                name="PhoneNumber"
                type="tel"
                className="form-control"
                placeholder="Phone Number"
                required
                pattern="[6-9]\d{9}"
                maxLength={10}
                value={formData.PhoneNumber}
                onChange={handlePhoneChange}
              />
            </div>
          </div>
          <div className="col-sm-6 m-b20">
            <div className="floating-underline underline-1 input-white input-icon-left">
              <span className="input-group-text text-primary">
                <i className="feather icon-calendar"></i>
              </span>
              <input
                name="AppointmentDate"
                required
                type="text"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
                className="form-control"
                id="datePickerOnly"
                placeholder="Date"
                value={formData.AppointmentDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-sm-6 m-b20">
            <div className="floating-underline underline-1 input-white input-icon-left">
              <span className="input-group-text text-primary">
                <i className="feather icon-clock"></i>
              </span>
              <input
                name="AppointmentTime"
                required
                type="text"
                onFocus={(e) => (e.target.type = "time")}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = "text";
                }}
                className="form-control"
                id="timePickerOnly"
                placeholder="Time"
                value={formData.AppointmentTime}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-sm-6 m-b20">
            <div className="floating-underline underline-1 input-white input-icon-left">
              <span className="input-group-text text-primary">
                <i className="feather icon-server"></i>
              </span>
              <select
                name="Service"
                id="service"
                className="form-control"
                required
                value={formData.Service}
                onChange={handleChange}
              >
                <option value="">--Select Service--</option>
                <option value="Cataract Service">Cataract Service</option>
                <option value="Cornea Refractive Service">Cornea, Refractive & Dry eyes Services</option>
                <option value="Vitreoretinal Service">Vitreoretinal Service</option>
                <option value="Pediatric Eye Service">Pediatric Eye Service</option>
                <option value="Glaucoma Service">Glaucoma Service</option>
                <option value="Contact Lens Service">Contact Lens Service</option>
                <option value="Orthoptics Service">Orthoptics Service</option>
                <option value="Myopia Clinic">Myopia Clinic</option>
                <option value="Computer Vision Syndrome">Computer Vision Syndrome</option>
              </select>
            </div>
          </div>

          <div className="col-sm-12 m-b20">
            <div className="floating-underline underline-1 input-white input-icon-left">
              <span className="input-group-text text-primary">
                <i className="feather flaticon-message"></i>
              </span>
              <textarea
                name="Message"
                required
                rows={3}
                className="form-control"
                placeholder="Your Message"
                value={formData.Message}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <div className="col-sm-12 m-t10">
            <button
              type="submit"
              id="btnSubmit"
              className="btn btn-lg w-100 appointmemt_btnn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fa fa-spinner fa-spin m-r5"></i> Booking...
                </>
              ) : (
                <>
                  <i className="feather icon-calendar m-r5"></i> Book An appointment
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {showSuccess && (
        <div className="booking-popup-overlay" onClick={() => setShowSuccess(false)}>
          <div className="booking-popup-box" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 text-success" style={{ fontSize: "50px" }}>✓</div>
            <h3 className="mb-2">Appointment Booked!</h3>
            <p className="text-muted">
              Thank you! Your appointment request {doctorName ? `with ${doctorName} ` : ""}has been submitted successfully.
              We will contact you shortly to confirm the appointment.
            </p>
            <button className="btn btn-primary mt-3" onClick={() => setShowSuccess(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
