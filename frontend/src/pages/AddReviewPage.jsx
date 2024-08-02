import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

import DialogflowChatbot from './DialogflowChatbot';
import chatbotGif from '../assets/chatbot.gif';

export default function AddReviewPage() {
    const navigate = useNavigate();
    const { bookingId } = useParams();

    const [bookingInformation, setBookingInformation] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const isAgent = localStorage.getItem("isAgent") === "true";
        if (isAgent) {
            toast.error("Unauthorized access. Please log in as a traveler.");
            setTimeout(() => navigate("/"), 3500);
        } else {
            // Get the booking ID passed via state
            if (bookingId) {
                fetchBookingInformation(bookingId);
            } else {
                toast.error("No booking ID provided.");
                navigate("/bookings");
            }
        }
    }, [navigate, location.state]);

    async function fetchBookingInformation(bookingId) {
        try {
            const response = await axios.post(`https://gpz4swubwbypipmptbe3gjvbqa0goopb.lambda-url.us-east-1.on.aws/`, { "booking_reference": bookingId });
            setBookingInformation(response.data);

            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching booking details:", error);
            setError('Failed to load booking details.');
            setIsLoading(false);
        }
    }

    const [showChatbot, setShowChatbot] = useState(false);


    const toggleChatbot = () => {
        setShowChatbot(!showChatbot);
    };

    const handleReviewSubmit = async () => {
        if (!reviewText.trim()) {
            toast.error("Review text cannot be empty.");
            return;
        }
        try {
            const response = await axios.post(`https://us-central1-stone-trees-414417.cloudfunctions.net/addReview`, {
                bookingId: bookingInformation.id,
                reviewText,
                roomNumber: bookingInformation.roomNumber,
                startDate: bookingInformation.startDate,
                endDate: bookingInformation.endDate,
                username: bookingInformation.username

            });
            toast.success("Review added successfully!");
            setTimeout(() => navigate("/bookings"), 2000);

        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error("Failed to submit review.");
        }
    };

    const handleNavigation = path => navigate(path);

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

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
                                <a href="#" onClick={() => handleNavigation("/rooms")} className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Explore</a>
                            </li>
                            <li>
                                <a href="#" onClick={() => handleNavigation("/bookings")} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Bookings</a>
                            </li>
                            <li>
                                <a href="#" onClick={logout} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Logout</a>
                            </li>


                        </ul>
                    </div>
                </div>
            </nav>

            <div className="p-10">
                <h2 className="mb-4 text-3xl font-semibold text-gray-900">Add Review for Booking </h2>
                <p className="text-gray-600">Review your experience with DalVacation on this booking from {bookingInformation.startDate} to {bookingInformation.endDate} for the room number{bookingInformation.roomNumber}</p>
                <div className='mt-4'>
                    <ToastContainer />
                    <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Type your review here" className="w-full p-2 border rounded" />
                    <button onClick={handleReviewSubmit} className="mt-4 px-4 py-2 text-white bg-blue-700 rounded hover:bg-blue-800">Submit Review</button>
                </div>
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
    );
}
