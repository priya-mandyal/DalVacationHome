import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DialogflowChatbot from "./DialogflowChatbot";
import chatbotGif from "../assets/chatbot.gif";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    price: "",
    imageUrl: "",
    type: "Standard",
    discountCode: "",
    discount: 0.0,
    ac_boolean: false,
    parking_boolean: false,
    mini_fridge_boolean: false,
    no_smoking_boolean: false,
    pet_friendly_boolean: false,
  });

  const role = !localStorage.getItem("token")
    ? "guest"
    : localStorage.getItem("isAgent") === "true"
    ? "agent"
    : "user";

  const handleNavigation = (path) => navigate(path);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await axios.get(
          "https://zb5jomh6w8.execute-api.us-east-1.amazonaws.com/dev/getRooms"
        );
        if (response.status === 200) {
          setRooms(response.data);
        } else {
          console.error("Failed to fetch rooms");
        }
      } catch (error) {
        console.error("Error fetching rooms:", error.message);
      }
    }

    fetchRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setNewRoom((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleAddRoom = async () => {
    const newRoomData = {
      roomNumber: parseInt(newRoom.roomNumber),
      price: parseInt(newRoom.price),
      type: newRoom.type,
      discountCode: newRoom.discountCode,
      discount: parseInt(newRoom.discount),
      imageUrl:
        newRoom.imageUrl ||
        "https://t3.ftcdn.net/jpg/06/19/00/08/240_F_619000872_AxiwLsfQqRHMkNxAbN4l5wg1MsPgBsmo.jpg",
      ac_boolean: newRoom.ac_boolean,
      parking_boolean: newRoom.parking_boolean,
      mini_fridge_boolean: newRoom.mini_fridge_boolean,
      no_smoking_boolean: newRoom.no_smoking_boolean,
      pet_friendly_boolean: newRoom.pet_friendly_boolean,
    };

    try {
      const response = await axios.post(
        "https://k2lsxz3que.execute-api.us-east-1.amazonaws.com/dev/saveRooms",
        newRoomData
      );
      if (response.status === 200) {
        newRoomData.id = newRoomData.roomNumber;
        setRooms([...rooms, newRoomData]);
        setNewRoom({
          roomNumber: "",
          price: "",
          imageUrl: "",
          type: "Standard",
          discountCode: "",
          discount: 0,
          ac_boolean: false,
          parking_boolean: false,
          mini_fridge_boolean: false,
          no_smoking_boolean: false,
          pet_friendly_boolean: false,
        });
        console.log("Room added successfully");
      } else {
        console.error("Failed to add room");
      }
    } catch (error) {
      console.error("Error adding room:", error.message);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const [showChatbot, setShowChatbot] = useState(false);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://github.com/user-attachments/assets/f2a32e92-e60b-4cb7-8aa8-1bcd032e7fbe"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              DalVacation
            </span>
          </a>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="#"
                  onClick={() => handleNavigation("/")}
                  className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              {role === "guest" && (
                <>
                  <li>
                    <a
                      href="#"
                      onClick={() => handleNavigation("/login")}
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    >
                      Login
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => handleNavigation("/register")}
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    >
                      Register
                    </a>
                  </li>
                </>
              )}
              {role === "user" && (
                <>
                  <li>
                    <a
                      href="#"
                      onClick={() => handleNavigation("/bookings")}
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    >
                      Bookings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => handleNavigation("/tickets")}
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    >
                      Dal Support - Tickets
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={logout}
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    >
                      Logout
                    </a>
                  </li>
                </>
              )}
              {role === "agent" && (
                <>
                  <li>
                    <a
                      href="#"
                      onClick={() => handleNavigation("/dashboard")}
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => handleNavigation("/tickets")}
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    >
                      Dal Support - Tickets
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      onClick={logout}
                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                    >
                      Logout
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Rooms</h1>
        {role === "agent" && (
          <div className="mb-4">
            <input
              type="number"
              name="roomNumber"
              value={newRoom.roomNumber}
              onChange={handleChange}
              placeholder="Room Number"
              className="border p-2 mr-2"
            />
            <input
              type="number"
              name="price"
              value={newRoom.price}
              onChange={handleChange}
              placeholder="Room Price"
              className="border p-2 mr-2"
            />
            <input
              type="text"
              name="imageUrl"
              value={newRoom.imageUrl}
              onChange={handleChange}
              placeholder="Image URL"
              className="border p-2 mr-2"
            />
            <div className="mt-2">
              <label className="mr-2">
                <input
                  type="checkbox"
                  name="ac_boolean"
                  checked={newRoom.ac_boolean}
                  onChange={handleChange}
                  className="mr-1"
                />
                AC
              </label>
              <label className="mr-2">
                <input
                  type="checkbox"
                  name="parking_boolean"
                  checked={newRoom.parking_boolean}
                  onChange={handleChange}
                  className="mr-1"
                />
                Parking
              </label>
              <label className="mr-2">
                <input
                  type="checkbox"
                  name="mini_fridge_boolean"
                  checked={newRoom.mini_fridge_boolean}
                  onChange={handleChange}
                  className="mr-1"
                />
                Mini Fridge
              </label>
              <label className="mr-2">
                <input
                  type="checkbox"
                  name="no_smoking_boolean"
                  checked={newRoom.no_smoking_boolean}
                  onChange={handleChange}
                  className="mr-1"
                />
                No Smoking
              </label>
              <label>
                <input
                  type="checkbox"
                  name="pet_friendly_boolean"
                  checked={newRoom.pet_friendly_boolean}
                  onChange={handleChange}
                  className="mr-1"
                />
                Pet Friendly
              </label>
            </div>
            <button
              onClick={handleAddRoom}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
            >
              Add Room
            </button>
          </div>
        )}
        <div className="flex flex-wrap -mx-2">
          {rooms.map((room) => (
            <div
              key={room.roomNumber}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
            >
              <div className="border rounded-lg p-4 shadow-lg">
                <img
                  src={room.imageUrl}
                  alt={`Room ${room.roomNumber}`}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h2 className="text-lg font-semibold">
                  Room {room.roomNumber}
                </h2>
                <p className="text-gray-600">Price: ${room.price}</p>
                <Link
                  to={`/room/${room.roomNumber}`}
                  className="text-blue-500 hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={toggleChatbot}
        className="fixed bottom-4 right-4 bg-transparent p-3 rounded-full shadow-lg"
        style={{
          border: "none",
          borderRadius: "50%",
          backgroundColor: "#6B46C1",
        }}
      >
        <img
          src={chatbotGif}
          alt="Chat with us"
          className="w-24 h-24 rounded-full"
          style={{ borderRadius: "50%" }}
        />
      </button>

      {showChatbot && <DialogflowChatbot onClose={toggleChatbot} />}
    </>
  );
};

export default Rooms;
