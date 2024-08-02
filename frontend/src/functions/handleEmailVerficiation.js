import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LAMBDA_FUNCTION_URL = 'https://4e7jzjs74x7amt3ykmf6wkdaaa0tkkpl.lambda-url.us-east-1.on.aws/';

export const useConfirmRegistration = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

    const handleEmailVerification = async (username, code) => {
        try {
            const response = await fetch(LAMBDA_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, code }),
            });

            const data = await response.json();

            if (response.status !== 200) {
                throw new Error(data.message);
            }

            console.log('Verification result: ' + data.message);
            alert('Email verification successful.');
            navigate('/questions');
        } catch (err) {
            setError(err.message || JSON.stringify(err));
        }
    };

  return { handleEmailVerification, error };
};
// fix in deployment final try
