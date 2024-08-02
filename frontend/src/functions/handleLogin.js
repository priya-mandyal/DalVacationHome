import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import * as zod from 'zod';

const LAMBDA_FUNCTION_URL = 'https://7hxctkdr5vr4qa3q42wudlwxdy0xfrsk.lambda-url.us-east-1.on.aws/';

const SignInSchema = zod.object({
  username: zod.string().min(1, "Username is required."),
  password: zod.string().min(1, "Password is required."),
});
const sendNotif = async (username) => {
  const checkUserExistsUrl = "https://p5f6gcpuuolcbfu6r2brtqyp7q0nbqqd.lambda-url.us-east-1.on.aws/";
  try {
    const resp = await fetch(checkUserExistsUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username })
  });
  const data = await resp.json();
    const response = await fetch("https://yejjnvlqu5.execute-api.us-east-1.amazonaws.com/notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({"username":data.data.username, "email":data.data.email, "action":"login" }),
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
export const handleLogin = async (username, password, setErrors, setError, navigate, successNavigationUrl) => {
  
  const result = SignInSchema.safeParse({ username, password });

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
    const response = await fetch(LAMBDA_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log(data);

    if (response.status !== 200) {
      throw new Error(data.message);
    }

    const { access_token, id_token, isAgent } = data;
    //sendNotif(username);
    localStorage.setItem('token', access_token);
    localStorage.setItem('idToken', id_token);
    localStorage.setItem('username', username);
    localStorage.setItem('isAgent', isAgent);

    navigate(successNavigationUrl);
  } catch (err) {
    setError(err.message || JSON.stringify(err));
  }

  
};
