import React, { useState, useEffect } from 'react';
// import { View, Text, Button, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

const QuizComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null); // Track the correct answer
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false); // Tracks if an answer has been submitted

  useEffect(() => {
    // Fetch data from local JSON file in the public folder
    fetch('http://localhost:3000/Biology.json')
      .then(response => response.json())
      .then(data => {
        setQuestions(data.questions); // Assuming your JSON has a "questions" field
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
        setLoading(false);
      });
  }, []);

  const handleAnswerClick = () => {
    const currentQuestion = questions[currentQuestionIndex];
    
    // Compare the selected answer to the correct answer
    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore(score + 1);
    }

    // Show the correct answer and mark the answer as submitted
    setCorrectAnswer(currentQuestion.correct_answer);
    setIsAnswerSubmitted(true);

    // Wait 2 seconds before moving to the next question
    setTimeout(() => {
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < questions.length) {
        setCurrentQuestionIndex(nextQuestionIndex);
        setSelectedAnswer(null); // Reset the selected answer for the next question
        setCorrectAnswer(null); // Reset the correct answer
        setIsAnswerSubmitted(false); // Allow new answer submissions
      } else {
        setShowScore(true);
      }
    }, 2000); // 2 seconds delay to display correct and wrong answers
  };

  const handleChange = choice => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(choice); // Allow answer selection only if not yet submitted
    }
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
                    <Text
                      style={[
                        styles.choice,
                        selectedAnswer === choice && styles.selectedChoice, // Highlight selected answer
                        isAnswerSubmitted && correctAnswer === choice && styles.correctChoice, // Highlight correct answer
                        isAnswerSubmitted && selectedAnswer === choice && correctAnswer !== choice && styles.wrongChoice, // Highlight wrong answer
                      ]}
                    >
                      {choice}
                    </Text>
                  </TouchableOpacity>
                ))}
                {/* Correct answer option */}
                <TouchableOpacity onPress={() => handleChange(questions[currentQuestionIndex].correct_answer)}>
                  <Text
                    style={[
                      styles.choice,
                      selectedAnswer === questions[currentQuestionIndex].correct_answer && styles.selectedChoice, // Highlight selected correct answer
                      isAnswerSubmitted && styles.correctChoice, // Highlight correct answer
                    ]}
                  >
                    {questions[currentQuestionIndex].correct_answer}
                  </Text>
                </TouchableOpacity>
              </View>
              <Button title="Submit" onPress={handleAnswerClick} disabled={!selectedAnswer || isAnswerSubmitted} />
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
  correctChoice: {
    backgroundColor: '#28a745', // Green for correct answer
  },
  wrongChoice: {
    backgroundColor: '#dc3545', // Red for wrong answer
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
