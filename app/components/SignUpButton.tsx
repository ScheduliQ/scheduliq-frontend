"use client";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
// import { handleUpload } from "../components/cloudinaryUploader"; // Adjust the path to your upload logic

export default function SignupButton() {
  const defaultProfilePictureUrl =
    "https://res.cloudinary.com/dcrhswmzi/image/upload/v1735645762/profile_pictures/hqsm6svm2pgp1zqzpohk.png";
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    profilePicture: defaultProfilePictureUrl, // For file upload
    gender: "",
    jobs: "",
    businessId: "",
  });
  const openSuccessModal = () => setIsSuccessModalOpen(true);
  const closeSuccessModal = () => setIsSuccessModalOpen(false);

  const openErrorModal = () => setIsErrorModalOpen(true);
  const closeErrorModal = () => setIsErrorModalOpen(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const files = (e.target as HTMLInputElement).files;

    if (type === "file" && files) {
      // Handle file inputs (e.g., profile picture)
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      // Handle other input types (text, email, etc.)
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    let profilePictureUrl = "";
    const fileFormData = new FormData();
    // Ensure profilePicture exists before appending
    if (formData.profilePicture) {
      fileFormData.append("file", formData.profilePicture);
    } else console.error("No profile picture selected");

    try {
      if (formData.profilePicture != defaultProfilePictureUrl) {
        const fileResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/upload`,
          {
            method: "POST",
            body: fileFormData,
          }
        );
        const fileResponseData = await fileResponse.json(); // Parse the JSON body
        profilePictureUrl = fileResponseData.url;
      } else {
        profilePictureUrl = defaultProfilePictureUrl;
      }

      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      const newUserUid = user.uid; // UID של המשתמש החדש
      const creationTime = user.metadata.creationTime; // Creation time of the user

      // Get Firebase token
      const idToken = await auth.currentUser?.getIdToken();

      // Prepare payload
      const payload = {
        uid: newUserUid, // UID של המשתמש החדש
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        profile_picture: profilePictureUrl, // Cloudinary URL
        gender: formData.gender,
        jobs: formData.jobs,
        business_id: formData.businessId,
        created_at: creationTime,
      };

      // Send payload to backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        // setSuccessMessage("User created successfully!");
        openSuccessModal();
        setTimeout(() => {
          closeSuccessModal();
        }, 2000); // Auto-hide after 2 seconds
        // alert("User created successfully!");
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          phone: "",
          profilePicture:
            "https://res.cloudinary.com/dcrhswmzi/image/upload/v1735645762/profile_pictures/hqsm6svm2pgp1zqzpohk.png",
          gender: "",
          jobs: "",
          businessId: "",
        });
        closeModal();
      } else {
        setErrorMessage("Failed to create user in the backend!");
        openErrorModal();
        setTimeout(() => {
          closeErrorModal();
        }, 5000);
        // alert("Failed to create user in the backend!");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setErrorMessage("Error creating user!\n Check console.");
      openErrorModal();
      setTimeout(() => {
        closeErrorModal();
      }, 5000);
      // alert("Error creating user!");
    }
  };

  return (
    <div className="font-sans">
      {/* Button to Open Modal */}
      <button className="btn btn-primary" onClick={openModal}>
        Sign Up
      </button>

      {isSuccessModalOpen && (
        <div
          role="alert"
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 alert alert-success w-auto max-w-xs shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>User created successfully!</span>
        </div>
      )}
      {/* Modal */}
      {isModalOpen && (
        <dialog id="registration-modal" className="modal modal-open">
          {isErrorModalOpen && (
            <div
              role="alert"
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 alert alert-error w-auto max-w-xs shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}
          <div className="modal-box bg-[#F7FAFC]">
            <h3 className="text-[#666666] font-bold text-lg mb-4">
              User Registration
            </h3>
            <form onSubmit={handleSubmit}>
              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label label-text text-[#666666]">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter First Name"
                    className="w-full px-4 py-3 bg-[#F3F6FA] border border-gray-300 rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#014DAE] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="label label-text text-[#666666]">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter Last Name"
                    className="w-full px-4 py-3 bg-[#F3F6FA] border border-gray-300 rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#014DAE] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="label label-text text-[#666666]">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  className="w-full px-4 py-3 bg-[#F3F6FA] border border-gray-300 rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#014DAE] focus:border-transparent"
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="label label-text text-[#666666]">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  className="w-full px-4 py-3 bg-[#F3F6FA] border border-gray-300 rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#014DAE] focus:border-transparent"
                  required
                />
              </div>

              {/* Rewrite Password */}
              <div className="mb-4">
                <label className="label label-text text-[#666666]">
                  Rewrite Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter Password"
                  className="w-full px-4 py-3 bg-[#F3F6FA] border border-gray-300 rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#014DAE] focus:border-transparent"
                  required
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="label label-text text-[#666666]">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  className="w-full px-4 py-3 bg-[#F3F6FA] border border-gray-300 rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#014DAE] focus:border-transparent"
                  required
                />
              </div>

              {/* Profile Picture */}
              <div className="mb-4">
                <label className="label label-text text-[#666666]">
                  Profile Picture
                </label>
                <input
                  type="file"
                  name="profilePicture"
                  onChange={handleChange}
                  className="file-input file-input-bordered w-full bg-[#F3F6FA] border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#014DAE]"
                />
              </div>

              {/* Gender */}
              <div className="mb-4">
                <label className="label label-text text-[#666666]">
                  Gender
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male" // Specify the value
                      checked={formData.gender === "male"} // Bind checked to formData.gender
                      onChange={handleChange} // Update formData.gender on selection
                      className="radio radio-primary"
                      required
                    />
                    <span className="ml-2 text-[#666666]">Male</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female" // Specify the value
                      checked={formData.gender === "female"} // Bind checked to formData.gender
                      onChange={handleChange} // Update formData.gender on selection
                      className="radio radio-primary"
                      required
                    />
                    <span className="ml-2 text-[#666666]">Female</span>
                  </label>
                </div>
              </div>

              {/* Jobs */}
              <div className="mb-4">
                <label className="label label-text text-[#666666]">Jobs</label>
                <input
                  type="text"
                  name="jobs"
                  value={formData.jobs}
                  onChange={handleChange}
                  placeholder="Enter Jobs (comma-separated)"
                  className="w-full px-4 py-3 bg-[#F3F6FA] border border-gray-300 rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#014DAE] focus:border-transparent"
                  required
                />
              </div>

              {/* Business ID */}
              <div className="mb-4">
                <label className="label label-text text-[#666666]">
                  Business ID
                </label>
                <input
                  type="text"
                  name="businessId"
                  value={formData.businessId}
                  onChange={handleChange}
                  placeholder="Enter Business ID"
                  className="w-full px-4 py-3 bg-[#F3F6FA] border border-gray-300 rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#014DAE] focus:border-transparent"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="modal-action">
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="btn border-none text-white bg-[#014DAE] hover:bg-[#012F70]"
                >
                  Submit
                </button>
                <button type="button" className="btn" onClick={closeModal}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
}
