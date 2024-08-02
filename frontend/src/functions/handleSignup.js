import { useState } from 'react';
import * as zod from 'zod';
import { useNavigate } from 'react-router-dom';

const SignupSchema = zod.object({
  username: zod.string().min(1, "Username is required."),
  email: zod.string().email("Email should be a valid email."),
  password: zod.string().min(8, "Password should be at least 8 characters long."),
});

export const handleSignup = async (username, email, password, setErrors, setError, navigate, successNavigationUrl, isAgent) => {
  const result = SignupSchema.safeParse({ username, email, password });

  if (!result.success) {
    const errorObject = {};
    result.error.errors.forEach((error) => {
      const key = error.path[0];
      errorObject[key] = error.message;
    });
    setErrors(errorObject);
    return;
  }

  try {
    const response = await fetch('https://nhhhkm4ukivsp6d4difa5p6qom0awibm.lambda-url.us-east-1.on.aws/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, isAgent }),
    });

    const data = await response.json();

    if (response.status !== 200) {
      throw new Error(data.message);
    }

    alert('Registration successful. Please confirm your email.');
    localStorage.setItem('username', username);
    localStorage.setItem('isMfaComplete', 'false');
    navigate('/verify', { state: { username } });
  } catch (error) {
    setError(error.message);
  }
};
