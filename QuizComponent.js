import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const QuizComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    // Make a GET request to the OTDB API endpoint that provides random biology questions
    axios.get('https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple')
      .then(response => {
        // Extract the questions array from the response
        const { results } = response.data;
        setQuestions(results);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
        setLoading(false);
      });
  }, []); // Empty dependency array to fetch data only once when component mounts

  const handleAnswerClick = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore(score + 1);
    }
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setSelectedAnswer(null); // Reset selected answer for the next question
    } else {
      setShowScore(true);
    }
  };

  const handleChange = (choice) => {
    setSelectedAnswer(choice);
  };

  return (
    <View style={styles.quizContainer}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          {showScore ? (
            <View style={styles.result}>
              <Text style={styles.resultText}>Your Score: {score}/{questions.length}</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.questionHeader}>Question {currentQuestionIndex + 1}</Text>
              <Text style={styles.questionText}>{questions[currentQuestionIndex].question}</Text>
              <View style={styles.answerChoices}>
                {questions[currentQuestionIndex].incorrect_answers.map((choice, index) => (
                  <TouchableOpacity key={index} onPress={() => handleChange(choice)}>
                    <Text style={[styles.choice, selectedAnswer === choice && styles.selectedChoice]}>
                      {choice}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => handleChange(questions[currentQuestionIndex].correct_answer)}>
                  <Text style={[styles.choice, selectedAnswer === questions[currentQuestionIndex].correct_answer && styles.selectedChoice]}>
                    {questions[currentQuestionIndex].correct_answer}
                  </Text>
                </TouchableOpacity>
              </View>
              <Button title="Next" onPress={handleAnswerClick} disabled={!selectedAnswer} />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  quizContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  questionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  questionText: {
    marginBottom: 20,
  },
  answerChoices: {
    alignItems: 'center',
    marginBottom: 20,
  },
  choice: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: '#007bff',
    color: '#fff',
    marginBottom: 10,
  },
  selectedChoice: {
    backgroundColor: '#0056b3',
  },
  result: {
    backgroundColor: '#f3f3f3',
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 20,
  },
});

export default QuizComponent;
