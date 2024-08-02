import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputBox } from '../components/User_Registration_Components/InputBox';
import { Button } from '../components/User_Registration_Components/Button';
import { Heading } from '../components/User_Registration_Components/Heading';
import { validateCaesarCipher } from '../functions/questions';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import DialogflowChatbot from './DialogflowChatbot';
import chatbotGif from '../assets/chatbot.gif';


import 'react-toastify/dist/ReactToastify.css';

function ValidateCaesarCipher() {
    const [username, setUsername] = useState('');
    const [originalText, setOriginalText] = useState('');
    const [caesarCipher, setCaesarCipher] = useState('');
    const navigate = useNavigate();

    const checkUserExistsUrl = "https://p5f6gcpuuolcbfu6r2brtqyp7q0nbqqd.lambda-url.us-east-1.on.aws/";
    const addUserDetailsUrl = "https://2zqaddg3k7q5v76wfbrzfvfney0nfowj.lambda-url.us-east-1.on.aws/";
    const accumalateUserDataUrl = "https://us-central1-stone-trees-414417.cloudfunctions.net/dataAnaysticsAccumator";
    const handleNavigation = path => navigate(path);


    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            console.error("Username not found in local storage");
            navigate('/');
        }

        // Generate random originalText on mount
        setOriginalText(generateRandomString(5)); // Adjust the length as needed
    }, [navigate]);

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    const generateRandomString = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const sendNotif = async (username, action) => {
        try {
            const resp = await fetch(checkUserExistsUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
            const data = await resp.json();
            const response = await fetch("https://yejjnvlqu5.execute-api.us-east-1.amazonaws.com/notification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "username": data.data.username, "email": data.data.email, "action": action }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }

            const responseData = await response.json();
            console.log("Success:", responseData);
        } catch (error) {
            console.error("Error:", error);
        }
    };


    const checkUserExists = async (username) => {
        try {
            const response = await fetch(checkUserExistsUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
            const data = await response.json();
            if (response.status === 404) { // User does not exist
                addUserDetails(username);  // Call to add user details
                console.log(username);
                //sendNotif(username, "register");
                //Sent a registration email/notification to the user

                //hit the api with endpoint checkUserExist to fetch all details from dynamodb
                setTimeout(() =>
                    navigate('/login'), 3500);

            } else {
                const userData = data.data;
                const username = userData.username;
                const isAgent = userData['custom:isAgent'];
                const email = userData.email;

                axios.post(accumalateUserDataUrl, {
                    username: username,
                    email: email,
                    isAgent: isAgent,

                });
                // Send a login email/notification to the user
                sendNotif(data.data.username, "login");
                setTimeout(() =>
                    navigate('/rooms'), 3500);

            }
        } catch (error) {
            console.error("Error checking user existence", error);
        }
    };

    const addUserDetails = async (username) => {
        try {
            const response = await fetch(addUserDetailsUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
            const data = await response.json();
            if (response.ok) {
                console.log('User details successfully stored in DynamoDB:', data);
            } else {
                console.error('Failed to add user details:', data.message);
            }
        } catch (error) {
            console.error("Error adding user details", error);
        }
        sendNotif(username, "register");
    };


    const handleSubmit = async () => {
        try {
            const response = await validateCaesarCipher(username, originalText, caesarCipher);
            if (response.isCorrect) {
                console.log(response)
                toast.success("Correct answer");
                checkUserExists(username);

            } else {
                console.error("Incorrect answer");
                toast.error("Incorrect answer");
            }
        } catch (error) {
            console.error("Error validating Caesar cipher", error);
        }

    };

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
                                <a href="#" onClick={() => handleNavigation("/rooms")} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Explore</a>
                            </li>
                            <li>
                                <a href="#" onClick={logout} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Logout</a>
                            </li>


                        </ul>
                    </div>
                </div>
            </nav>
            <ToastContainer />
            <div className="flex items-center justify-center h-screen" style={{ backgroundColor: "#f6f6f6", paddingTop: '48px' }}>
                <div className="w-fit p-6 rounded-lg bg-white shadow-md h-fit">
                    <Heading label={"Decipher Caesar Cipher"} />
                    <p className="text-slate-500 text-md text-center mt-3">Original Text: {originalText}</p>
                    <InputBox
                        onChange={e => setCaesarCipher(e.target.value)}
                        placeholder="Enter Caesar Cipher"
                        label="Caesar Cipher"
                    />
                    <div className="pt-4">
                        <Button type="submit" label={"Submit"} onClick={handleSubmit} />
                    </div>
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

export default ValidateCaesarCipher;