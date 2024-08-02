import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import DialogflowChatbot from './DialogflowChatbot';
import chatbotGif from '../assets/chatbot.gif';


import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

export default function AnalysticsDashboard() {


    const navigate = useNavigate();

    const handleNavigation = path => navigate(path);

    useEffect(() => {

        const isAgent = localStorage.getItem("isAgent") === "true";
        if (!isAgent) {
            toast.error("Unauthorized access. Please log in as an agent.");
            setTimeout(() => navigate("/"), 7000);
        }
    }, [navigate]);


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
                <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="https://github.com/user-attachments/assets/f2a32e92-e60b-4cb7-8aa8-1bcd032e7fbe" className="h-8" alt="Flowbite Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">DalVacation</span>
                </a>
                <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                    
                    <li>
                    <a href="#" onClick={() => handleNavigation("/rooms")}className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Explore</a>
                    </li>
                    <li>
                    <a href="#" onClick={logout} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Logout</a>
                    </li>
                    <ToastContainer/>
                    
                </ul>
                </div>
            </div>
            </nav>
            <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
                <h2 className="text-2xl font-bold mb-4">View Statistic</h2>
                <div className="shadow-lg rounded-lg overflow-hidden">
                    <iframe
                        width="1200"
                        height="600"
                        src="https://lookerstudio.google.com/embed/reporting/0135df98-2b97-4fc5-a7be-a7285b1d18d8/page/zEz5D"
                        frameBorder="0"
                        style={{ border: 0 }}
                        allowFullScreen
                        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                    ></iframe>
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


