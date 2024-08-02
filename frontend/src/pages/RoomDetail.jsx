import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BookingDialog from './BookingDialog';
import DialogflowChatbot from './DialogflowChatbot';
import chatbotGif from '../assets/chatbot.gif';




const RoomDetail = () => {
  const { roomNumber } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editRoom, setEditRoom] = useState({});
  const [message, setMessage] = useState('');
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [reviews, setReviews] = useState([]);

  const getStarRating = (score) => {
    if (score >= 0.60) return '★★★★★';
    if (score >= 0.20) return '★★★★';
    if (score > -0.2) return '★★★';
    return '★★';
  };
  const [showChatbot, setShowChatbot] = useState(false);


  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };


  useEffect(() => {
    async function fetchRoomDetails() {
      try {
        const response = await axios.get(`https://kh21qn58pc.execute-api.us-east-1.amazonaws.com/dev/room?roomNumber=${roomNumber}`);
        if (response.status === 200) {
          setRoom(response.data);
          setEditRoom({ ...response.data });
        } else {
          console.error('Failed to fetch room details');
          navigate('/rooms');
        }
      } catch (error) {
        console.error('Error fetching room details:', error.message);
        navigate('/rooms');
      }
    }

    async function fetchReviews() {
      try {
        const response = await axios.get(`https://us-central1-stone-trees-414417.cloudfunctions.net/newGetReviews?roomNumber=${roomNumber}`);
        if (response.status === 200) {
          setReviews(response.data);
        } else {
          console.error('Failed to fetch reviews');
        }
      } catch (error) {
        console.error('Error fetching reviews:', error.message);
      }
    }

    fetchRoomDetails();
    fetchReviews();
  }, [roomNumber, navigate]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`https://qksr2y7npb.execute-api.us-east-1.amazonaws.com/dev/deleteRoom?roomNumber=${roomNumber}`);
      if (response.status === 200) {
        setMessage('Room deleted successfully');
        setTimeout(() => {
          setMessage('');
          navigate('/rooms');
        }, 3000);
      } else {
        console.error('Failed to delete room');
      }
    } catch (error) {
      console.error('Error deleting room:', error.message);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setMessage('');
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditRoom({ ...room });
    setMessage('');
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`https://vvum2yrbhi.execute-api.us-east-1.amazonaws.com/dev/updateRoom?roomNumber=${roomNumber}`, editRoom);
      if (response.status === 200) {
        setRoom({ ...editRoom });
        setEditMode(false);
        setMessage('Room details updated successfully');
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        console.error('Failed to update room details');
      }
    } catch (error) {
      console.error('Error updating room details:', error.message);
    }
  };

  const handleNavigation = path => navigate(path);

  const handleBookNow = () => {
    setShowBookingDialog(true);
  };

  const handleCloseBookingDialog = () => {
    setShowBookingDialog(false);
  };

  if (!room) {
    return <div>Loading...</div>;
  }
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const role = localStorage.getItem('token') ? (localStorage.getItem('isAgent') === 'true' ? 'agent' : 'user') : 'guest';

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
                    <a href="#" onClick={logout} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Logout</a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Room {room.roomNumber} Details</h1>
        {message && (
          <div className="bg-green-500 text-white px-4 py-2 rounded mb-4">{message}</div>
        )}
        <div className="border rounded-lg p-4 shadow-lg">
          <img src={room.imageUrl} alt={`Room ${room.roomNumber}`} className="w-full h-60 object-cover rounded-md mb-4" />
          {editMode ? (
            <div>
              <label className="block mb-2">
                Price: <input type="number" name="price" value={editRoom.price} onChange={(e) => setEditRoom({ ...editRoom, price: e.target.value })} className="border p-2" />
              </label>
              <label className="block mb-2">
                Image URL: <input type="text" name="imageUrl" value={editRoom.imageUrl} onChange={(e) => setEditRoom({ ...editRoom, imageUrl: e.target.value })} className="border p-2" />
              </label>
              <label className="block mb-2">
                Discount Code: <input type="text" name="discountCode" value={editRoom.discountCode} onChange={(e) => setEditRoom({ ...editRoom, discountCode: e.target.value })} className="border p-2" />
              </label>
              <label className="block mb-2">
                Discount: <input type="number" name="discount" value={editRoom.discount} onChange={(e) => setEditRoom({ ...editRoom, discount: e.target.value })} className="border p-2" />
              </label>
              <div className="mt-2">
                <label className="mr-2">
                  <input
                    type="checkbox"
                    name="ac_boolean"
                    checked={editRoom.ac_boolean}
                    onChange={(e) => setEditRoom({ ...editRoom, ac_boolean: e.target.checked })}
                    className="mr-1"
                  />
                  AC
                </label>
                <label className="mr-2">
                  <input
                    type="checkbox"
                    name="parking_boolean"
                    checked={editRoom.parking_boolean}
                    onChange={(e) => setEditRoom({ ...editRoom, parking_boolean: e.target.checked })}
                    className="mr-1"
                  />
                  Parking
                </label>
                <label className="mr-2">
                  <input
                    type="checkbox"
                    name="mini_fridge_boolean"
                    checked={editRoom.mini_fridge_boolean}
                    onChange={(e) => setEditRoom({ ...editRoom, mini_fridge_boolean: e.target.checked })}
                    className="mr-1"
                  />
                  Mini Fridge
                </label>
                <label className="mr-2">
                  <input
                    type="checkbox"
                    name="no_smoking_boolean"
                    checked={editRoom.no_smoking_boolean}
                    onChange={(e) => setEditRoom({ ...editRoom, no_smoking_boolean: e.target.checked })}
                    className="mr-1"
                  />
                  No Smoking
                </label>
                <label className="mr-2">
                  <input
                    type="checkbox"
                    name="pet_friendly_boolean"
                    checked={editRoom.pet_friendly_boolean}
                    onChange={(e) => setEditRoom({ ...editRoom, pet_friendly_boolean: e.target.checked })}
                    className="mr-1"
                  />
                  Pet Friendly
                </label>
              </div>
              <div className="mt-4">
                <button onClick={handleSaveEdit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">Save</button>
                <button onClick={handleCancelEdit} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-lg mb-4">{room.roomType}</p>
              <p className="text-gray-600 mb-4">{room.description}</p>
              <p className="text-lg font-semibold mb-2">Features:</p>
              <ul className="mb-4">
                <li>{room.ac_boolean && 'Air Conditioning'}</li>
                <li>{room.parking_boolean && 'Parking'}</li>
                <li>{room.mini_fridge_boolean && 'Mini Fridge'}</li>
                <li>{room.no_smoking_boolean && 'No Smoking'}</li>
                <li>{room.pet_friendly_boolean && 'Pet Friendly'}</li>
              </ul>
              <p className="text-lg mb-4">Price: ${room.price} per night</p>
              {role === 'agent' && (
                <div className="mb-4">
                  <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">Edit</button>
                  <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
                </div>
              )}
              {role === 'user' && (
                <button onClick={handleBookNow} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Book Now</button>
              )}
            </div>
          )}
        </div>
        <h1 className='text-pretty text-2xl mt-2'>Have a look at the previous reviews</h1>
        {reviews.length === 0 ? (
          <p className="text-center text-base mt-4">No reviews found.</p>
        ) : (
          <table className="min-w-full table-auto leading-normal mt-8">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-400 bg-gray-100 text-center text-lg font-semibold text-black uppercase tracking-wider">
                  Date
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-400 bg-gray-100 text-center text-lg font-semibold text-black uppercase tracking-wider">
                  Username
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-400 bg-gray-100 text-center text-lg font-semibold text-black uppercase tracking-wider">
                  Review
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-400 bg-gray-100 text-center text-lg font-semibold text-black uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, index) => (
                <tr key={index}>
                  <td className="px-5 py-2 border-b border-gray-300 bg-white text-base text-center">
                    {review.endDate}
                  </td>
                  <td className="px-5 py-2 border-b border-gray-300 bg-white text-base text-center">
                    {review.username}
                  </td>
                  <td className="px-5 py-2 border-b border-gray-300 bg-white text-base">
                    {review.reviewText}
                  </td>
                  <td className="px-5 py-2 border-b border-gray-300 bg-white text-2xl text-yellow-400 text-center">
                    {getStarRating(review.sentimentScore)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {showBookingDialog && <BookingDialog roomNumber={roomNumber} onClose={handleCloseBookingDialog} />}
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
};

export default RoomDetail;
