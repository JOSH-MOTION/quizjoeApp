import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Button, Modal, Pressable, Alert } from 'react-native';

const SubjectScreen = ({ route }) => {
  const { name, dataUrl, biologyUrl } = route.params;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [isBiology, setIsBiology] = useState(false);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [numQuestions, setNumQuestions] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (isBiology) {
      fetch(biologyUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch Biology questions');
          }
          return response.json();
        })
        .then((data) => {
          setQuestions(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching Biology questions:', error);
          setLoading(false);
        });
    } else {
      fetch(dataUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch questions');
          }
          return response.json();
        })
        .then((data) => {
          setQuestions(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching questions:', error);
          setLoading(false);
        });
    }
  }, [dataUrl, biologyUrl, isBiology]);

  useEffect(() => {
    if (numQuestions !== null) {
      setQuestions(prevQuestions => prevQuestions.slice(0, numQuestions));
      setCurrentPage(0);
      setQuizCompleted(false); // Reset quiz completion state when starting a new quiz
    }
  }, [numQuestions]);

  const handleAnswerPress = (questionNumber, selectedAnswer) => {
    if (answerLocked) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionNumber]: selectedAnswer,
    }));

    setAnswerLocked(true);

    setTimeout(() => {
      handleNext();
      setAnswerLocked(false);
    }, 3000);
  };

  const handleNext = () => {
    if (currentPage < questions.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      calculateScore();
      setQuizCompleted(true); // Mark quiz as completed
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentPage(0);
    setQuizCompleted(false);
    setAnswerLocked(false);
    setNumQuestions(null); // Optionally reset the number of questions
    setModalVisible(true); // Re-open the question selection modal
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question) => {
      if (selectedAnswers[question.number] === question.answer) {
        score += 1;
      }
    });
   
    Alert.alert("Quiz Complete", `Your score is ${score}/${questions.length}`);
  };

  const currentQuestion = questions[currentPage];
  const userAnswer = selectedAnswers[currentQuestion?.number];

  useEffect(() => {
    if (!answerLocked) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestion?.number]: null,
      }));
    }
  }, [currentPage, answerLocked, currentQuestion]);

  const handleSelectQuestions = (num) => {
    if (num < 5) {
      Alert.alert("Invalid Selection", "You must select at least 5 questions.");
      return;
    }
    setNumQuestions(num);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {!numQuestions && (
          <Button title="Select Number of Questions" onPress={() => setModalVisible(true)} />
        )}
        <Text style={styles.header}>Subject: {name}</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {currentQuestion ? (
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>{currentQuestion.sentence}</Text>
              {Object.entries(currentQuestion.options).map(([key, value]) => {
                const isCorrect = key === currentQuestion.answer;
                const isSelected = userAnswer === key;
                const answerStyle = [
                  styles.answerButton,
                  isSelected && { backgroundColor: isCorrect ? '#4CAF50' : '#F44336' },
                  answerLocked && isCorrect && { backgroundColor: '#4CAF50' },
                ];

                return (
                  <TouchableOpacity
                    key={key}
                    style={answerStyle}
                    onPress={() => handleAnswerPress(currentQuestion.number, key)}
                    disabled={answerLocked}
                  >
                    <Text style={styles.answerText}>
                      {key}. {value}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {userAnswer && (
                <Text style={styles.feedbackText}>
                  {userAnswer === currentQuestion.answer ? 'Correct!' : 'Incorrect! Correct answer shown.'}
                </Text>
              )}
            </View>
          ) : (
            <Text>No questions available</Text>
          )}
          <View style={styles.navigationButtons}>
            <Button title="Previous" onPress={handlePrevious} disabled={currentPage === 0} />
            <Button title="Next" onPress={handleNext} disabled={currentPage === questions.length - 1 || answerLocked} />
          </View>
          {quizCompleted && (
            <View style={styles.restartButtonContainer}>
              <Button title="Restart Quiz" onPress={handleRestart} />
            </View>
          )}
        </ScrollView>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Number of Questions</Text>
            {[5, 10, 15, 20].map((num) => (
              <Pressable key={num} style={styles.modalButton} onPress={() => handleSelectQuestions(num)}>
                <Text style={styles.modalButtonText}>{num}</Text>
              </Pressable>
            ))}
            <Pressable style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    paddingBottom: 30,
  },
  questionContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  answerButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  answerText: {
    fontSize: 14,
    color: '#333',
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#007AFF',
    textAlign: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  restartButtonContainer: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#ddd',
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
  },
  modalCloseButton: {
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#ccc',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

export default SubjectScreen;
