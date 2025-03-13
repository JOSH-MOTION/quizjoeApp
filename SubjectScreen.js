import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';

const SubjectScreen = ({ route }) => {
  const { name, dataUrl } = route.params;
  const [questions, setQuestions] = useState([]);
  const [displayQuestions, setDisplayQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questionCountInput, setQuestionCountInput] = useState(''); // User input for question count

  // Shuffle and slice questions based on count
  const prepareQuestions = (count) => {
    const numCount = parseInt(count, 10);
    if (isNaN(numCount) || numCount < 1 || numCount > questions.length) {
      alert(`Please enter a valid number between 1 and ${questions.length}`);
      return;
    }
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setDisplayQuestions(shuffled.slice(0, numCount));
    setQuizStarted(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!dataUrl) {
        setError('Invalid subject URL');
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching data from: ${dataUrl}`);
        const response = await fetch(dataUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        console.log('Fetched data:', result);
        setQuestions(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error('Fetch Error:', err.message);
        setError(`Failed to load quiz: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataUrl]);

  const selectAnswer = (questionId, selectedOption) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const goToPrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const goToNext = () => {
    if (currentIndex < displayQuestions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const finishQuiz = () => {
    setQuizFinished(true);
  };

  const calculateScore = () => {
    let score = 0;
    displayQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.answer) score += 1;
    });
    return score;
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading {name} Quiz...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubText}>Please check your network or server.</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No questions available for {name}</Text>
      </View>
    );
  }

  if (!quizStarted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{name} Quiz</Text>
        <Text style={styles.selectionText}>
          How many questions would you like to answer? (1 - {questions.length})
        </Text>
        <TextInput
          style={styles.input}
          value={questionCountInput}
          onChangeText={setQuestionCountInput}
          placeholder="Enter number"
          keyboardType="numeric"
          autoFocus={true}
        />
        <View style={styles.selectionContainer}>
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => prepareQuestions(questionCountInput)}
          >
            <Text style={styles.selectionButtonText}>Start Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => prepareQuestions(questions.length)}
          >
            <Text style={styles.selectionButtonText}>All Questions ({questions.length})</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (quizFinished) {
    const score = calculateScore();
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{name} Quiz - Results</Text>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Score: {score} / {displayQuestions.length}</Text>
          <Text style={styles.percentageText}>
            {((score / displayQuestions.length) * 100).toFixed(2)}%
          </Text>
        </View>
      </View>
    );
  }

  const currentQuestion = displayQuestions[currentIndex];
  const selectedAnswer = userAnswers[currentQuestion.id];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name} Quiz</Text>
      <Text style={styles.questionNumber}>
        Question {currentIndex + 1} of {displayQuestions.length}
      </Text>
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{currentQuestion.sentence}</Text>
        {['A', 'B', 'C', 'D'].map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === currentQuestion.answer;
          const backgroundColor = isSelected
            ? isCorrect
              ? '#d4edda' // Green
              : '#f8d7da' // Red
            : '#f9f9f9'; // Default

          return (
            <TouchableOpacity
              key={option}
              style={[styles.optionButton, { backgroundColor }]}
              onPress={() => selectAnswer(currentQuestion.id, option)}
            >
              <Text style={styles.optionText}>
                {option}: {currentQuestion.options[option]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
          onPress={goToPrevious}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={currentIndex === displayQuestions.length - 1 ? finishQuiz : goToNext}
        >
          <Text style={styles.navButtonText}>
            {currentIndex === displayQuestions.length - 1 ? 'Finish' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  selectionText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  selectionButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  selectionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionNumber: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  optionButton: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
  },
  optionText: {
    fontSize: 16,
    color: '#444',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingBottom: 20,
  },
  navButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  percentageText: {
    fontSize: 24,
    color: '#666',
  },
});

export default SubjectScreen;