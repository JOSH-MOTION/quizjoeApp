import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const AboutScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('./images/settingB.png')} // Replace with the path to your logo
        style={styles.logo}
      />
      <Text style={styles.header}>About Us</Text>
      <Text style={styles.text}>
        Welcome to our quiz app! This application allows you to test your knowledge
        across various subjects. We aim to provide a fun and educational experience.
        Stay tuned for more subjects and features.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});

export default AboutScreen;
