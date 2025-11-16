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
import { createUser } from '../database/userService';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    console.log('handleRegister chamado');
    console.log(
      'Email:',
      email,
      'Senha length:',
      password.length,
      'Confirm length:',
      confirmPassword.length
    );

    // Validações
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      console.log('Validação falhou: campos vazios');
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validação falhou: email inválido');
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    // Verifica se as senhas coincidem
    if (password !== confirmPassword) {
      console.log('Validação falhou: senhas não coincidem');
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    // Verifica tamanho mínimo da senha
    if (password.length < 6) {
      console.log(
        'Validação falhou: senha muito curta. Tamanho:',
        password.length
      );
      Alert.alert(
        'Erro',
        `A senha deve ter pelo menos 6 caracteres (atual: ${password.length})`
      );
      return;
    }

    console.log('Todas as validações passaram, tentando criar usuário...');

    try {
      console.log('Tentando criar usuário:', email.trim());
      const userId = await createUser(email.trim(), password);
      console.log('Usuário criado com ID:', userId);
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      Alert.alert('Erro', error.message || 'Não foi possível criar a conta');
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
          Criar Conta
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

        <TextInput
          style={globalStyles.input}
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <Pressable style={globalStyles.button} onPress={handleRegister}>
          <Text style={globalStyles.buttonText}>Criar Conta</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Login')}
          style={{ marginTop: 16 }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: '#007AFF',
              fontSize: 16,
            }}
          >
            Já tem uma conta? Entrar
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
