import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Chat = ({ navigation, route }) => {
  const { driverName } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hola queria hacer una reserva con usted para mover algunas cosas de mi casa', sender: 'user' },
    { id: '2', text: 'Claro tengo disponible el dia lunes y martes luego de las 3 de la tarde', sender: 'driver' },
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), text: message, sender: 'user' },
      ]);
      setMessage('');
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userMessage : styles.driverMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0} // Adjust offset if needed
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity testID="chat-back-button" onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#6B9AC4" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{driverName}</Text>
        </View>

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Chat"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity accessibilityLabel="chat-send-button" onPress={sendMessage}>
            <Ionicons name="send" size={24} color="#6B9AC4" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  driverMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5E5',
  },
  headerContainer: {
    alignItems: 'center',
    borderBottomColor: '#E5E5E5',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 116,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    flex: 1,
    fontSize: 16,
    marginRight: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  inputContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopColor: '#E5E5E5',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  messageBubble: {
    borderRadius: 8,
    marginVertical: 5,
    maxWidth: '75%',
    padding: 10,
  },
  messageText: {
    color: '#333',
  },
  messagesContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  safeArea: {
    backgroundColor: 'white',
    flex: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6B9AC4',
  },
});

export default Chat;

Chat.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      driverName: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
