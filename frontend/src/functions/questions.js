import axios from 'axios';

export const fetchQuestions = async () => {
    try {
        const response = await axios.get('https://54jic1478e.execute-api.us-east-1.amazonaws.com/prod/question/');
        const data = response.data;
        const questionsObj = data.reduce((acc, item) => {
            acc[item.id] = { question: item.question, answer: '' };
            return acc;
        }, {});
        return questionsObj;
    } catch (error) {
        console.error("Error fetching the questions", error);
        throw error;
    }
};

export const submitUserQuestions = async (username, questionsMap) => {
    try {
        const questionsArray = Object.keys(questionsMap).map(id => ({
            id: Number(id),
            answer: questionsMap[id].answer
        }));

        const response = await axios.post('https://54jic1478e.execute-api.us-east-1.amazonaws.com/prod/userquestions', {
            username,
            questions: questionsArray
        });

        return response.data;
    } catch (error) {
        console.error("Error submitting the questions", error);
        throw error;
    }
};

export const submitCaesarCipher = async (username, shift) => {
    try {
        const response = await axios.post('https://54jic1478e.execute-api.us-east-1.amazonaws.com/prod/caesarcipher', {
            username,
            shift
        });
        console.log("Cipher saved successfully:", response.data);

        return response.data;
    } catch (error) {
        console.error("Error submitting the Caesar cipher shift", error);
        throw error;
    }
};

export const fetchSingleQuestion = async (username) => {
    const response = await axios.post('https://54jic1478e.execute-api.us-east-1.amazonaws.com/prod/userquestion', { username });
    return response.data;
};

export const validateUserAnswer = async (username, questionId, answer) => {
    const response = await axios.post('https://54jic1478e.execute-api.us-east-1.amazonaws.com/prod/validateUserAnswer', {
        username,
        id: questionId,
        answer
    });
    return response.data;
};

export const validateCaesarCipher = async (username, originalText, caesarCipher) => {
    try {
        const response = await axios.post('https://54jic1478e.execute-api.us-east-1.amazonaws.com/prod/validateCaesarCipher', {
            username,
            originalText,
            caesarCipher
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};