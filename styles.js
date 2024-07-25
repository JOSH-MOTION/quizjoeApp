import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  quizContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  result: {
    backgroundColor: '#f3f3f3',
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
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
});
