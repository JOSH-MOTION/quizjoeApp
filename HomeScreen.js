import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const handlePress = (subject) => {
    let dataUrl = '';
    if (subject === 'Biology') {
      dataUrl = 'http://192.168.43.238:3000/Biology.json';
    } else if (subject === 'English') {
      dataUrl = 'http://192.168.43.238:3000/English.json';
    } else if (subject === 'Mathematics') {
      dataUrl = 'http://192.168.43.238:3000/Mathematics.json';
    }
    navigation.navigate('Subject', { name: subject, dataUrl });
  };

  return (
    <ImageBackground source={require('./images/student.jpeg')} style={styles.background}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('About')}>
            <Text style={styles.navButtonText}>About</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Select Your Subject</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.card} onPress={() => handlePress('Biology')}>
            <Text style={styles.cardText}>Biology</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => handlePress('English')}>
            <Text style={styles.cardText}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => handlePress('Mathematics')}>
            <Text style={styles.cardText}>Mathematics</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    paddingTop: 30,
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 10,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff', // White text color for visibility
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#007bff',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default HomeScreen;
