import { useState } from "react"
import { BottomWarning } from "../components/User_Registration_Components/BottomWarning"
import { Button } from "../components/User_Registration_Components/Button"
import { Heading } from "../components/User_Registration_Components/Heading"
import { InputBox } from "../components/User_Registration_Components/InputBox"
import { SubHeading } from "../components/User_Registration_Components/SubHeading"
import { useNavigate } from "react-router-dom"
import { handleLogin } from "../functions/handleLogin"
import { validatePassword } from "../functions/validatepassword"
import { useEffect } from 'react';
import DialogflowChatbot from './DialogflowChatbot';
import chatbotGif from '../assets/chatbot.gif';







export default function Signup() {

  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");


  const navigate = useNavigate();

  const successNavigationUrl = "/verifyquestions";

  const handleNavigation = path => navigate(path);



  const logout = () => {
    localStorage.clear();
    navigate("/");
  };


  const handleSignInClick = (e) => {
    e.preventDefault();

    handleLogin(username, password, setErrors, setError, navigate, successNavigationUrl);
  };

  useEffect(() => {
    document.title = "Login"

  }, []);

  const [showChatbot, setShowChatbot] = useState(false);


  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };



  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://github.com/user-attachments/assets/f2a32e92-e60b-4cb7-8aa8-1bcd032e7fbe" className="h-8" alt="#" />
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
                <a href="#" onClick={() => handleNavigation("/register")} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Register</a>
              </li>



            </ul>
          </div>
        </div>
      </nav>
      <div className="mt-10" style={{ backgroundColor: "#f6f6f6", }}>
        <div className="flex flex-grow justify-center" style={{ backgroundColor: "#f6f6f6" }}>
          <div className="flex flex-col sm:flex-row justify-between w-full max-w-screen-lg mx-auto p-4 mb-3">

            <div className="w-full sm:w-1/2 flex flex-col justify-center items-center">
              <Heading label={"Welcome! Login Now."} />
              <p className="text-slate-500 text-md  text-center mt-3">
                Login to get access to a platform to book next vacation
              </p>
              <SubHeading label={"Enter your infromation to login into account"} />
            </div>
            <div className="w-full lg:pl-48  md:w-1/2 flex flex-col justify-center items-center">
              <div className="rounded-lg bg-white w-full md:w-96 text-center p-2 px-4 mx-auto">
                <Heading label={"Login"} />
                <InputBox onChange={e => {
                  setUsername(e.target.value);
                  setErrors(prevErrors => ({ ...prevErrors, username: null }));
                }} placeholder="Enter your username" label={"Username"} />
                <div style={{ height: '15px', color: 'red' }} className="text-left ml-1 mt-1">{errors.username && <p className="text-red-500">{errors.username}</p>}</div>

                <InputBox onChange={e => {
                  const password = e.target.value;
                  setPassword(password);
                  // const passwordError = validatePassword(password);
                  // setErrors(prevErrors => ({ ...prevErrors, password: passwordError }));
                }} placeholder="Enter your password" label={"Password"} type="password" />
                <div style={{ height: '40px', color: 'red' }} className="text-left ml-1">{errors.password && <p className="text-red-500">{errors.password}</p>}</div>

                <div className="pt-4">
                  <Button type="submit" label={"Login"} onClick={handleSignInClick} />
                  <div style={{ height: '25px', color: 'red' }} className="text-left ml-1">{error && <p className="text-red-500 pt-2">{error}</p>}</div>

                </div>
                <BottomWarning label={"Dont have an account?"} buttonText={"Register"} to={"/register"} />
              </div>
            </div>
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

  )
}


