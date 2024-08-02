import React, { useState } from 'react';
import axios from 'axios';
import DialogflowChatbot from './DialogflowChatbot';
import chatbotGif from '../assets/chatbot.gif'

const BookingDialog = ({ roomNumber, onClose }) => {

  const checkUserExistsUrl = "https://p5f6gcpuuolcbfu6r2brtqyp7q0nbqqd.lambda-url.us-east-1.on.aws/";

  const [bookingDetails, setBookingDetails] = useState({
    startDate: '',
    endDate: '',
    emailId: '',
    comment: ''
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://m64pi02yx0.execute-api.us-east-1.amazonaws.com/dev/bookRoom', {
        startDate: bookingDetails.startDate,
        endDate: bookingDetails.endDate,
        username: localStorage.getItem("username"),
        emailId: bookingDetails.emailId,
        comment: bookingDetails.comment,
        roomNumber: roomNumber
      });
      if (response.status === 200) {
        let username = localStorage.getItem('username');
        sendNotif(username, 'bookingsuccess');
        setBookingSuccess(true);
        setTimeout(() => {
          setBookingSuccess(false);
          onClose();
        }, 3000);
      } else {
        let username = localStorage.getItem('username');
        sendNotif(username, 'bookingfailure');
        setBookingError('Failed to book room. Please try again.');
      }
    } catch (error) {
      let username = localStorage.getItem('username');
      sendNotif(username, 'bookingfailure');
      setBookingError('Error booking room. Please try again later.');
    }
  };

  const [showChatbot, setShowChatbot] = useState(false);


  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Book Room {roomNumber}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={bookingDetails.startDate}
              onChange={handleChange}
              required
              className="border p-2 w-full mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={bookingDetails.endDate}
              onChange={handleChange}
              required
              className="border p-2 w-full mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email ID</label>
            <input
              type="text"
              name="emailId"
              value={bookingDetails.emailId}
              onChange={handleChange}
              className="border p-2 w-full mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Additional Comments</label>
            <textarea
              name="comment"
              value={bookingDetails.comment}
              onChange={handleChange}
              rows="3"
              className="border p-2 w-full mt-1"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">Confirm Booking</button>
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
          </div>
        </form>
        {bookingError && <p className="text-red-500 mt-2">{bookingError}</p>}
        {bookingSuccess && <p className="text-green-500 mt-2">Booking successful!</p>}
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
    </div>
  );
};

export default BookingDialog;
