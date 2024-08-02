import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { InputBox } from '../components/User_Registration_Components/InputBox';
import { Button } from '../components/User_Registration_Components/Button';
import { Heading } from '../components/User_Registration_Components/Heading';
import { fetchQuestions, submitUserQuestions, submitCaesarCipher } from '../functions/questions';
import DialogflowChatbot from './DialogflowChatbot';
import chatbotGif from '../assets/chatbot.gif';

function QuestionsPage() {
    const [questionsMap, setQuestionsMap] = useState({});
    const [username, setUsername] = useState('');
    const [shift, setShift] = useState('');
    const [isloading, setIsloading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsloading(true);
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            console.error("Username not found in local storage");
            navigate('/');
        }

        const getQuestions = async () => {
            try {
                const questions = await fetchQuestions();
                setQuestionsMap(questions);
                setIsloading(false);
            } catch (error) {
                console.error("Error fetching the questions", error);
            }
        };

        getQuestions();
    }, [navigate]);

    const handleChange = (id, value) => {
        setQuestionsMap(prevMap => ({
            ...prevMap,
            [id]: {
                ...prevMap[id],
                answer: value
            }
        }));
    };

    const handleNavigation = path => navigate(path);

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };
    const handleSubmit = async () => {
        try {
            console.log("Answers submitted:", questionsMap, "Shift:", shift);
            const response = await submitUserQuestions(username, questionsMap);
            const cipherResponse = await submitCaesarCipher(username, shift);
            console.log("Answers submitted successfully:", response);
            navigate('/validateCaesarCipher');
        } catch (error) {
            console.error("Error submitting answers", error);
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
                    <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
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
                                <a href="#" onClick={() => handleNavigation("/dashboard")} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Explore</a>
                            </li>
                            <li>
                                <a href="#" onClick={logout} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Logout</a>
                            </li>


                        </ul>
                    </div>
                </div>
            </nav>
            <div className="flex items-center justify-center h-full" style={{ backgroundColor: "#f6f6f6", paddingTop: '48px' }}>
                {isloading ? <div>Loading...</div>
                    : <div className="w-fit p-6 rounded-lg bg-white shadow-md h-screen">
                        <Heading label={"Questions and Caesar Cipher"} />
                        {Object.keys(questionsMap).map(key => (
                            <InputBox
                                key={key}
                                onChange={e => handleChange(key, e.target.value)}
                                placeholder="Enter your answer"
                                label={questionsMap[key].question}
                            />
                        ))}
                        <InputBox
                            onChange={e => setShift(e.target.value)}
                            placeholder="Enter shift value"
                            label="Shift"
                        />
                        <div className="pt-4">
                            <Button type="submit" label={"Submit"} onClick={handleSubmit} />
                        </div>
                    </div>
                }
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

export default QuestionsPage;