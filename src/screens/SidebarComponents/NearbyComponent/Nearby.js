import React, { useState, useEffect } from "react";
import axios from "axios";
import VideocamIcon from "@mui/icons-material/Videocam";
import PhoneIcon from "@mui/icons-material/Phone";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ForumIcon from "@mui/icons-material/Forum";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const Nearby = () => {
  const [nearby, setNearby] = useState([]);
  const [filter, setFilter] = useState("all");
  const [locationError, setLocationError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    const locationPermission = localStorage.getItem("locationPermissionGranted");

    if (locationPermission === "true") {
      getLocation();
    } else {
      setShowModal(true);
    }
  }, []);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User's location:", position.coords);
        fetchNearbyUsers(latitude, longitude);
        fetchAddress(latitude, longitude); // Fetch human-readable address
        setShowModal(false);
      },
      () => {
        setLocationError(true);
        setShowModal(true);
      }
    );
  };

  const fetchNearbyUsers = async (lat, lon) => {
    try {
      const response = await axios.get("/api/get-nearby-users", {
        params: { latitude: lat, longitude: lon },
      });
      setNearby(response.data);
    } catch (error) {
      console.error("Error fetching nearby users:", error);
    }
  };

  const fetchAddress = async (lat, lon) => {
    try {
      const response = await axios.get(
        ` https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const address = response.data.display_name;
      setUserAddress(address); // Set the address to the state
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const toggleFollow = (id) => {
    setNearby((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, isFollowing: !item.isFollowing } : item
      )
    );
  };

  // const filteredNearby = nearby.filter((item) => {
  //   if (filter === "all") return true;
  //   if (filter === "online") return item.isOnline;
  //   if (filter === "offline") return !item.isOnline;
  //   return true;
  // });

  const handleAllowLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("User's location:", position.coords);
        localStorage.setItem("locationPermissionGranted", "true");
        setLocationError(false);
        fetchNearbyUsers(position.coords.latitude, position.coords.longitude);
        fetchAddress(position.coords.latitude, position.coords.longitude); // Fetch human-readable address
        setShowModal(false);
      },
      () => {
        setLocationError(true);
        localStorage.setItem("locationPermissionGranted", "false");
        setShowModal(true);
      }
    );
  };

  return (
    <>
      {/* <div className="flex justify-end mx-6 xs:mx-1 gap-x-2 mb-3">
        <button
          className={`px-3 rounded-md ${
            filter === "all" ? "bg-violet-500 text-white" : "bg-white text-black"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-4 rounded-md ${
            filter === "online" ? "bg-lime-500 text-white" : "bg-white text-black"
          }`}
          onClick={() => setFilter("online")}
        >
          Online
        </button>
        <button
          className={`px-4 rounded-md ${
            filter === "offline" ? "bg-red-500 text-white" : "bg-white text-black"
          }`}
          onClick={() => setFilter("offline")}
        >
          Offline
        </button>
      </div> */}

      <div className="flex justify-center mx-6 xs:mx-1 my-3 text-lg font-semibold text-white">
        {userAddress ? (
          <p >
            Your location: {userAddress}
          </p>
        ) : locationError ? (
          <p className="text-red-500">Permission required to fetch location</p>
        ) : (
          <p>Fetching your location...</p>
        )}
      </div>

      <div className="scrollable-div flex justify-center mx-6 xs:mx-1 my-1 gap-6 xs:gap-1.5 items-center h-[91vh] md:h-[87vh] overflow-y-auto xs:mt-3 w-full">
      <p className=" text-black text-2xl ">No one is online nearby.</p>
        {/* {filteredNearby.map((item) => (
          <div
            key={item._id}
            className="relative rounded-md h-52 xs:h-44 cursor-pointer overflow-hidden group"
          >
            <img
              src={item.profile_url}
              className="h-full w-full object-cover rounded-md"
              alt={item.name}
            />

            <div
              className={`absolute top-2 right-2 w-4 h-4 rounded-full border-2 ${
                item.isOnline
                  ? "bg-lime-500 border-lime-500"
                  : "bg-red-500 border-red-500"
              }`}
            />
            <div
              className="absolute top-2 xs:top-1 left-2 xs:left-1 flex items-center bg-main-gradient text-white rounded-md px-2 py-1 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toggleFollow(item._id);
              }}
            >
              {item.isFollowing ? (
                <DoneAllIcon style={{ fontSize: "1rem" }} />
              ) : (
                <GroupAddIcon style={{ fontSize: "1rem" }} />
              )}
              <span className="ml-1 text-sm">
                {item.isFollowing ? "Following" : "Follow"}
              </span>
            </div>

            <div className="h-[50%] w-[100%] absolute right-0 -bottom-[100%] bg-[#1f3d4738] opacity-100 backdrop-blur-sm rounded-md group-hover:bottom-0 duration-700 flex flex-col items-center justify-center">
              <div className="flex items-center gap-x-3 xs:gap-x-1">
                <div className="bg-main-gradient text-white rounded-full px-2 py-1">
                  <ForumIcon style={{ fontSize: "1.25rem" }} />
                </div>
                <div className="bg-main-gradient text-white px-2 py-1 rounded-full my-3">
                  <PhoneIcon style={{ fontSize: "1.25rem" }} />
                </div>
                <div className="bg-main-gradient text-white px-2 py-1 rounded-full">
                  <VideocamIcon style={{ fontSize: "1.25rem" }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div> */}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-md">
              <h2 className="text-lg font-semibold mb-4">Allow Location Access</h2>
              <p className="text-sm mb-4">
                We need your location to fetch nearby people. Please allow access
                to your location.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="bg-gray-300 px-4 py-2 rounded-md"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-main-gradient text-white px-4 py-2 rounded-md"
                  onClick={handleAllowLocation}
                >
                  Allow Location
                </button>
              </div>
            </div>
          </div>
        )}

        {locationError && (
          <div className="text-center text-red-500 mt-4">
            Cannot fetch nearby people without location access.
          </div>
        )}
      </div>
    </>
  );
};

export default Nearby;