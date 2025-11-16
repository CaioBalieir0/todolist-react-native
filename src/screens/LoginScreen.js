import React, { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { loginUser } from '../database/userService';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Validação local: email e senha não podem estar vazios
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha email e senha');
      return;
    }

    try {
      await loginUser(email.trim(), password);
      // Login bem-sucedido - navega para a lista de tarefas
      navigation.replace('TodoList');
    } catch (error) {
      Alert.alert('Erro', error.message || 'Email ou senha inválidos');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.loginContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ width: '100%', maxWidth: 400 }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
            marginBottom: 40,
            textAlign: 'center',
            color: '#333',
          }}
        >
          Todo List
        </Text>

        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <TextInput
          style={globalStyles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <Pressable style={globalStyles.button} onPress={handleLogin}>
          <Text style={globalStyles.buttonText}>Entrar</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Register')}
          style={{ marginTop: 16 }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: '#007AFF',
              fontSize: 16,
            }}
          >
            Não tem uma conta? Criar conta
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
