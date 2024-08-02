import React, { Suspense, lazy ,useState} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import ChatScreen from  './pages/ChatScreen/ChatScreen';
import Book from './pages/BookingDialog';
import './App.css';

const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const QuestionsPage = lazy(() => import('./pages/QuestionsPage'));
const VerifyQuestionsPage = lazy(() => import('./pages/VerifyQuestions'));
const ValidateCaesarCipherPage = lazy(() => import('./pages/ValidateCaesarCipher'));
const ViewAllBookingsPage = lazy(() => import('./pages/ViewAllBookingsPage'));
const AddReviewPage = lazy(() => import('./pages/AddReviewPage'));

const TestHome = lazy(() => import('./pages/TestHome'));
const AnalysticsDashborad= lazy(() => import('./pages/AnalysticsDashborad'));
import Spinner from './components/User_Registration_Components/Spinner';

function App() {
  return (
    <div>
    <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/verifyQuestions" element={<VerifyQuestionsPage />} />
          <Route path="/validateCaesarCipher" element={<ValidateCaesarCipherPage />} />
          <Route path="/room/:roomNumber" element={<RoomDetail />} />
          <Route path="/book/:roomNumber" element={<Book />} />
          <Route path="/bookings" element={<ViewAllBookingsPage />} />
          <Route path="/addReview/:bookingId" element={<AddReviewPage />} />
          <Route path="/" element={<TestHome />} />
          <Route path="/dashboard" element={<AnalysticsDashborad/>} />
          <Route path="/tickets" element={<ChatScreen />} />
        </Routes>
      </Suspense>
        
    </BrowserRouter>
    </div>
  );
}

export default App;
