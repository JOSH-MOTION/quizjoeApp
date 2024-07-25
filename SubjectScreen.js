// SubjectScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SubjectScreen = ({ route }) => {
  const { name, api } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(api)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setQuestions(data.results);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, [api]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert(`Quiz finished! Your score is ${score + (isCorrect ? 1 : 0)}/${questions.length}`);
      // Reset the quiz or navigate back
      setCurrentQuestionIndex(0);
      setScore(0);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Error: {error.message}</Text>
      </View>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>No questions available</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(() => Math.random() - 0.5);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{name}</Text>
      <View style={styles.content}>
        <Text style={styles.question}>{currentQuestion.question}</Text>
        {answers.map((answer, index) => (
          <TouchableOpacity
            key={index}
            style={styles.answerButton}
            onPress={() => handleAnswer(answer === currentQuestion.correct_answer)}
          >
            <Text style={styles.answerText}>{answer}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  content: {
    width: '100%',
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    color: '#555',
  },
  answerButton: {
    backgroundColor: '#6200EE',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  answerText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SubjectScreen;
