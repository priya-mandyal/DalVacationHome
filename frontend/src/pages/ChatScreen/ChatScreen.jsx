import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ChatList from "./ChatList";
import MessagePanel from "./MessagePanel";
import { db } from "../../config/firebase";
import {
  setDoc,
  doc,
  collection,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
 
 
function ChatScreen() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const [isChatListVisible, setIsChatListVisible] = useState(false);
  const [chatId,setChatId] = useState(null);
  const toggleChatList = () => {
    setIsChatListVisible(!isChatListVisible);
  };
 
  const navigate = useNavigate();
  const role = !localStorage.getItem('token') ? 'guest' : (localStorage.getItem('isAgent') === 'true' ? 'agent' : 'user');

  useEffect(() => {
    const fetchLatestMessage = async () => {
      const userId = localStorage.getItem("username");
      const conversationDocRef = doc(db, "issues", userId);
      const docSnap = await getDoc(conversationDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        let latestMessage = null;

        Object.keys(data).forEach((key) => {
          if (data[key].email != null) {
            return;
          }
          if (
            !latestMessage ||
            data[key].lastMessageTimestamp > latestMessage.lastMessageTimestamp
          ) {
            latestMessage = {
              message: data[key].firstMessage,
              lastMessageTimestamp: data[key].lastMessageTimestamp,
              id: key,
            };
          }
        });

        if (latestMessage) {
          setChatId(latestMessage.id);
        }
      }
    };

    fetchLatestMessage();

    if (token) {
      setUser(localStorage.getItem("user"));
    }
  }, [token]);
 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleNavigation = (path) => {
    // Use this function to handle the click event
    navigate(path);
};

function logout() {
  localStorage.clear();
  setTimeout(() => {
  
      navigate("/");
  }, 1500);
}
 
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900">
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
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
                            <a href="#" onClick={() => handleNavigation("/")} className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Home</a>
                        </li>
                        {role === 'guest' && (
                            <>
                                <li>
                                    <a href="#" onClick={() => handleNavigation("/login")} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Login</a>
                                </li>
                                <li>
                                    <a href="#" onClick={() => handleNavigation("/register")} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Register</a>
                                </li>
                            </>
                        )}
                        {role === 'user' && (
                            <>
                               
                                <li>
                                    <a href="#" onClick={() => handleNavigation("/bookings")} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Bookings</a>
                                </li>
                                <li>
                                    <a href="#" onClick={() => handleNavigation("/tickets")} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Dal Support - Tickets</a>
                                </li>
                                <li>
                                    <a href="#" onClick={logout} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Logout</a>
                                </li>
                            </>
                        )}
                        {role === 'agent' && (
                            <>
                                <li>
                                    <a href="#" onClick={() => handleNavigation("/dashboard")} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Dashboard</a>
                                </li>
                                <li>
                                    <a href="#" onClick={() => handleNavigation("/tickets")} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Dal Support - Tickets</a>
                                </li>
                                
                                <li>
                                    <a href="#" onClick={logout} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Logout</a>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>

      <main className="flex-1 flex text-sm md:text-base overflow-hidden">
      
        <div
          className={`fixed md:relative overflow-hidden md:flex ${
            isChatListVisible ? "w-full" : "w-1/4"
          } w-1/4 z-50 bg-gray-900 transition-transform transform ${
            isChatListVisible ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <ChatList chatId={chatId} setChatId={setChatId}/>
          <button
            className="md:hidden absolute top-4 right-4 text-white"
            onClick={toggleChatList}
          >
            {/* Close Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-1">
          <MessagePanel chatId={chatId} setChatId={setChatId}/>
        </div>
      </main>
    </div>
  );
}
 
export default ChatScreen;
 