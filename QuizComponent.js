import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const QuizComponent = ({ route }) => {
    const { subject } = route.params; // Subject passed as a parameter
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120); // 2-minute timer

    useEffect(() => {
        fetch(`http://192.168.100.103:3000/quiz/${subject}`)
            .then(response => response.json())
            .then(data => setQuestions(data))
            .catch(error => console.error('Error fetching quiz:', error));
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            alert(`Time's up! Your score: ${score}/${questions.length}`);
        }
    }, [timeLeft]);

    const handleAnswer = (optionKey) => {
        const correctAnswer = questions[currentQuestion].answer;
        setSelectedOption(optionKey);

        if (optionKey === correctAnswer) {
            setScore(score + 1);
        }

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedOption(null);
            } else {
                alert(`Quiz completed! Your score: ${score}/${questions.length}`);
            }
        }, 1000);
    };

    if (questions.length === 0) return <Text>Loading quiz...</Text>;

    const question = questions[currentQuestion];

    return (
        <View style={styles.container}>
            <Text style={styles.timer}>Time Left: {timeLeft}s</Text>
            <Text style={styles.question}>{question.sentence}</Text>

            {Object.entries(question.options).map(([key, value]) => (
                <TouchableOpacity
                    key={key}
                    style={[
                        styles.option,
                        selectedOption === key && 
                        (key === question.answer ? styles.correct : styles.wrong)
                    ]}
                    onPress={() => handleAnswer(key)}
                    disabled={selectedOption !== null}
                >
                    <Text style={styles.optionText}>{key}: {value}</Text>
                </TouchableOpacity>
            ))}

            <Text style={styles.score}>Score: {score}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
    timer: { fontSize: 18, textAlign: 'center', marginBottom: 10, fontWeight: 'bold' },
    question: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    option: { padding: 10, marginVertical: 5, backgroundColor: '#ddd', borderRadius: 5 },
    optionText: { fontSize: 18 },
    correct: { backgroundColor: 'green' },
    wrong: { backgroundColor: 'red' },
    score: { fontSize: 20, textAlign: 'center', marginTop: 20, fontWeight: 'bold' }
});

export default QuizComponent;
