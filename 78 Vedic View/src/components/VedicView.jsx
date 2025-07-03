import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function VedicView() {
  const [dob, setDob] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    place: "",
    hour: "",
    minute: "",
    ampm: "",
    contact: "",
    concern: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedDob = dob
      ? `${dob.getFullYear()}-${String(dob.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(dob.getDate()).padStart(2, "0")}`
      : "";

    const formattedTob = `${formData.hour}:${formData.minute} ${formData.ampm}`;

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbxKfT5t6Q9vH6FeTijl5I5bAH9NWRQqTtmxA_q6xso9CRVAGuNmL5Xwx-R3JlQDo7Q/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `name=${formData.name}&dob=${formattedDob}&tob=${formattedTob}&gender=${formData.gender}&place=${formData.place}&contact=${formData.contact}&concern=${formData.concern}`,
        }
      )
        .then((res) => res.text())
        .then((data) => {
          alert(data);
        });

      setSuccessMessage("✅ Your details have been successfully submitted!");

      // Reset form
      setDob(null);
      setFormData({
        name: "",
        gender: "",
        place: "",
        hour: "",
        minute: "",
        ampm: "",
        contact: "",
        concern: "",
      });
    } catch (error) {
      console.error("Error submitting to Google Sheet:", error);
      setSuccessMessage("❌ Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            🕉 Vedic View Kundli
          </h1>
          <p className="text-sm text-gray-500 mt-1 border-t border-gray-200 pt-2">
            Please enter your birth details to share them with our astrologer.
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 text-green-600 bg-green-100 border border-green-300 p-3 rounded-lg text-sm text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your Name"
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <DatePicker
              selected={dob}
              onChange={(date) => setDob(date)}
              dateFormat="dd-MM-yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="Select your Date of Birth"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              maxDate={new Date()}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time of Birth
            </label>
            <div className="flex space-x-2">
              <select
                name="hour"
                value={formData.hour}
                onChange={handleChange}
                required
                className="w-1/3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="">HH</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={String(i + 1).padStart(2, "0")}>
                    {String(i + 1).padStart(2, "0")}
                  </option>
                ))}
              </select>

              <select
                name="minute"
                value={formData.minute}
                onChange={handleChange}
                required
                className="w-1/3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="">MM</option>
                {[...Array(60)].map((_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>

              <select
                name="ampm"
                value={formData.ampm}
                onChange={handleChange}
                required
                className="w-1/3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="">AM/PM</option>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Place of Birth
            </label>
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleChange}
              required
              placeholder="e.g., Jabalpur, MP"
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact
            </label>
            <input
              type="number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              placeholder="Enter your Contact Number"
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Concern
            </label>
            <input
              type="text"
              name="concern"
              value={formData.concern}
              onChange={handleChange}
              required
              placeholder="What is your concern?"
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white font-semibold p-2 rounded-lg transition duration-200 flex justify-center items-center`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit Details"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
