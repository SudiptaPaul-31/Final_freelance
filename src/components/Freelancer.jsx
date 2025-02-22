import Navbar from "./Navbar";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Helper function to render stars based on the rating
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<span key={i}>&#9733;</span>); // Full star
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<span key={i}>&#9734;</span>); // Half star
    } else {
      stars.push(<span key={i}>&#9734;</span>); // Empty star
    }
  }
  return <div className="text-yellow-500">{stars}</div>;
};

const Freelancer = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    email: "",
    mobile: "",
    role: "",
    profileImage: "",
  });
  const [profile, setProfile] = useState({
    name: "",
    description: "",
    email: "",
    mobile: "",
    rating: 5,
    profileImage: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError("No access token found");
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/api/v1/user/current-user",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setProfile((prevProfile) => ({
          ...prevProfile,
          name: response.data.data.username,
          email: response.data.data.email,
          rating: response.data.data.rating,
          profileImage: response.data.data.profileImage,
        }));
      } catch (error) {
        setError(
          `Error fetching current user: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    setFormValues(profile);
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormValues(profile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("No access token found");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/v1/employee/update",
        formValues,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setProfile(response.data.employee);
        setIsEditing(false);
        setError("");
      } else {
        setError(
          `Unexpected response: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error details:", error.response?.data);
      setError(
        `Error saving profile data: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="text-black flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-4">
            <div className="mt-4">
              {isEditing ? (
                <></>
              ) : (
                <>
                  <label className="font-semibold"></label>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {profile.name}
                  </h2>
                </>
              )}
            </div>
            <div className="mt-2">
              <label className="font-semibold">Description:</label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formValues.description}
                  onChange={handleInputChange}
                  className="mt-2 text-gray-600 bg-gray-200 rounded-lg -mb-12 w-full h-[25vh] resize-none"
                />
              ) : (
                <p className="mt-2 text-gray-600">{profile.description}</p>
              )}
            </div>
            <div className="mt-20">
              <label className="font-semibold">Mobile:</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="mobile"
                  value={formValues.mobile}
                  onChange={handleInputChange}
                  className="ml-4 bg-gray-200 border-4 rounded-lg w-[30vw]"
                />
              ) : (
                <span className="ml-2">{profile.mobile}</span>
              )}
            </div>
            <div className="mt-2">
              {isEditing ? (
                <></>
              ) : (
                <>
                  <label className="font-semibold">Email:</label>
                  <span className="ml-2">{profile.email}</span>
                </>
              )}
            </div>
            <div className="mt-2">
              {isEditing ? (
                <></>
              ) : (
                <>
                  <label className="font-semibold">Role:</label>
                  <p className="ml-2">{profile.role}</p>
                </>
              )}
            </div>
            <div className="mt-2">
              {isEditing ? (
                <></>
              ) : (
                <>
                  <label className="font-semibold">Rating:</label>
                  <span className="ml-2">{profile.rating} </span>
                </>
              )}
            </div>
          </div>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="flex justify-end p-4">
            {isEditing ? (
              <>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
              </>
            ) : (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Freelancer;
