import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';

const ContactScreen = () => {
  const handleEmail = () => {
    Linking.openURL('mailto:support@example.com'); // Replace with your support email
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contact Us</Text>
      <Text style={styles.text}>For any inquiries or support, please contact us at:</Text>
      <Text style={styles.email} onPress={handleEmail}>
        support@example.com
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
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
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});

export default ContactScreen;
