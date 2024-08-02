import React, { useState } from 'react';
import DialogflowChatbot from './DialogflowChatbot';
import chatbotGif from '../assets/chatbot.gif';
import image1 from '../assets/Dalvacation1.jpg';
import { useNavigate } from 'react-router-dom';


const TestHome = () => {
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);


  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  const handleNavigation = path => navigate(path);


  const login = () => {
    navigate("/login");
  };

  return (
    <>

      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://github.com/user-attachments/assets/f2a32e92-e60b-4cb7-8aa8-1bcd032e7fbe" className="h-8" alt="/" />
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
                <a href="#" onClick={login} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Login</a>
              </li>



            </ul>
          </div>
        </div>
      </nav>


      <div>

        <section className="md:h-screen md:pb-0 pb-10 flex justify-center items-center">
          <div className="container mx-auto">
            <div className="flex flex-col-reverse md:flex-row justify-between items-center">
              <div className="px-6 md:px-0 md:w-1/2">
                <div className="text-black">
                  <h1 className="md:text-4xl text-lg-black font-bold  mb-2 md:mb-6">Welcome to Dal Vacation Home, where each room invites relaxation and every stay creates memories.</h1>
                  <p className="md:text-lg  mb-2 md:mb-8">Explore a world of comfort and discover your perfect getaway at Dal Vacation Home, where every stay promises a unique adventure.</p>
                  <button onClick={() => navigate(`/rooms`)} className="bg-gray-800 text-white py-2 px-6 rounded-full hover:bg-gray-600 font-semibold">Explore Rooms</button>
                </div>
              </div>
              <div className="px-6 md:px-0 md:w-1/2">
                <div className="w-full h-[calc(100vh-100px)]">
                  <img src={image1} alt="Banner" className="object-contain w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-10">
          <div className="container mx-auto">
            <div className="text-center">
              <h2 className="text-4xl font-bold">Exceptional Holiday Homes Just for You</h2>
              <h5 className="text-md text-gray-500">Unique Retreats in Beautiful Locations</h5>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
              <div className="bg-white shadow-xl p-10 rounded-lg">
                <h3 className="text-lg font-bold">Reliable Stays</h3>
                <p className="text-gray-800">
                  Find your perfect holiday escape with Dal Vacation Home, where every listing is verified for a memorable and authentic stay.
                </p>
              </div>
              <div className="bg-white shadow-xl p-10 rounded-lg">
                <h3 className="text-lg font-bold">Support Available 24/7</h3>
                <p className="text-gray-800">
                  Our committed team is always ready to assist, ensuring your needs are met at all times during your stay.
                </p>
              </div>
              <div className="bg-white shadow-xl p-10 rounded-lg">
                <h3 className="text-lg font-bold">Expertise in Hospitality</h3>
                <p className="text-gray-800">
                  From quaint bungalows to grand estates, Dal Vacation Home offers a range of properties managed with the utmost professionalism.
                </p>
              </div>
            </div>
          </div>
        </section>


        <section className="bg-white py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">About Us</h2>
            <p className="text-gray-600 text-lg">
              Dal Vacation Home offers unique and comfortable stays, providing an array of rooms perfect for relaxation and adventure in memorable destinations. Explore, relax, and rediscover tranquility with us. Whether you're seeking a peaceful retreat or an exciting escape, our thoughtfully designed spaces and exceptional service ensure a delightful experience tailored just for you. Immerse yourself in comfort and enjoy personalized amenities at our welcoming haven.
            </p>
          </div>
        </section>

        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto flex justify-between items-center">
            <p className="text-sm">© 2024 DAL VACATION HOME</p>
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:text-gray-400">About Us</a></li>
              <li><a href="#" className="hover:text-gray-400">Services</a></li>
              <li><a href="#" className="hover:text-gray-400">Contact</a></li>
            </ul>
          </div>
        </footer>





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
      </div>
    </>
  );
};

export default TestHome;
