// HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const subjects = [
    { name: 'Math', api: 'https://opentdb.com/api.php?amount=20&category=19&type=multiple' },
    { name: 'Science', api: 'https://opentdb.com/api.php?amount=20&category=17&type=multiple' },
    { name: 'Computer', api: 'https://opentdb.com/api.php?amount=20&category=18&type=multiple' },
    { name: 'General Knowledge', api: 'https://opentdb.com/api.php?amount=18&category=9&type=multiple' },
  ];
 
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to My Quiz App</Text>
      <Image
        source={{ uri: 'https://img.freepik.com/free-ai-image/portrait-young-students-with-books-education-day_94955549.htm' }}
        style={styles.image}
      />
      <Text style={styles.subHeader}>Choose a Subject to Start</Text>
      <View style={styles.subjectContainer}>
        {subjects.map((subject, index) => (
          <TouchableOpacity
            key={index}
            style={styles.subjectButton}
            onPress={() => navigation.navigate('Subject', { name: subject.name, api: subject.api })}
          >
            <Text style={styles.subjectText}>{subject.name}</Text>
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
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  subjectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  subjectButton: {
    backgroundColor: '#6200EE',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  subjectText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreen;
