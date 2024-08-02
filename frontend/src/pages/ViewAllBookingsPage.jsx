import { useState, useEffect } from "react"

import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
import { BottomWarning } from "../components/User_Registration_Components/BottomWarning"
import { Button } from "../components/User_Registration_Components/Button"
import { Heading } from "../components/User_Registration_Components/Heading"
import { InputBox } from "../components/User_Registration_Components/InputBox"
import { SubHeading } from "../components/User_Registration_Components/SubHeading"
import DialogflowChatbot from './DialogflowChatbot';
import chatbotGif from '../assets/chatbot.gif';

export default function ViewAllBookings() {

    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        const isAgent = localStorage.getItem("isAgent") === "true";
        if (isAgent) {

            toast.error("Unauthorized access. Please log in as an traveler.");
            setTimeout(() =>
                navigate("/"),
                3500
            );
        } else {
            fetchBookings();
        }
    }, []);

    async function fetchBookings() {
        const response = await axios.post("https://qat5se5cv3iunxip3mwyea7v5e0lzwmh.lambda-url.us-east-1.on.aws/", { username: localStorage.getItem("username") });
        setBookings(response.data);
        console.log(response.data);
    }

    // async function fetchReviews() {
    //     const response =await axios.get("https://us-central1-stone-trees-414417.cloudfunctions.net/getRoomsReview?roomNumber=1");
    //     console.log(response.data);
    //     // setBookings(response.data);

    // }





    const handleNavigation = (path) => {
        // Use this function to handle the click event
        navigate(path);
    };


    const handleAddReview = (bookingId) => {
        console.log("Attempting to navigate with booking ID:", bookingId);
        navigate(`/addReview/${bookingId}`);
    };

    function logout() {
        localStorage.clear();
        setTimeout(() => {

            navigate("/");
        }, 1500);
    }

    const [showChatbot, setShowChatbot] = useState(false);


    const toggleChatbot = () => {
        setShowChatbot(!showChatbot);
    };


    return (
        <>



            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="https://github.com/user-attachments/assets/f2a32e92-e60b-4cb7-8aa8-1bcd032e7fbe" className="h-8" alt="Flowbite Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">DalVacation</span>
                    </a>
                    <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <a href="#" onClick={() => handleNavigation("/")} className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Home</a>
                            </li>
                            <li>
                                <a href="#" onClick={() => handleNavigation("/bookings")} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Bookings</a>
                            </li>
                            <li>
                                    <a href="#" onClick={() => handleNavigation("/tickets")} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Dal Support - Tickets</a>
                                </li>
                            <li>
                                <a href="#" onClick={logout} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Logout</a>
                            </li>


                        </ul>
                    </div>
                </div>
            </nav>
            <div className="p-4">
                <h2 className="mb-4 text-3xl font-semibold text-gray-900">Booking History</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookings.map((booking, index) => (
                        <div key={index} className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-slate-300 dark:border-gray-700">
                            <h6 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
                                Booking Reference: {booking.booking_reference}

                            </h6>
                            <p className="font-normal text-gray-700">
                                Room Number: {booking.roomNumber} <br />
                                Start Date: {booking.startDate} <br />
                                End Date: {booking.endDate} <br />
                                Comments: {booking.comment}
                            </p>
                            <a href="#" onClick={() => handleAddReview(booking.booking_reference)} className="inline-flex mt-4 items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Add Reviews
                                <svg className="rtl:rotate-180 w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                </svg>
                            </a>
                        </div>
                    ))}
                </div>
                <ToastContainer />
            </div>



            <button
                onClick={toggleChatbot}
                className="fixed bottom-4 right-4 bg-transparent p-3 rounded-full shadow-lg"
                style={{
                    border: 'none',
                    borderRadius: '50%',
                    backgroundColor: '#6B46C1',
                }}
            >
                <img
                    src={chatbotGif}
                    alt="Chat with us"
                    className="w-24 h-24 rounded-full"
                    style={{ borderRadius: '50%' }}
                />
            </button>

            {showChatbot && <DialogflowChatbot onClose={toggleChatbot} />}

        </>
    )



}
