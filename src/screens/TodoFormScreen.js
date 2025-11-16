import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { createTask, updateTask } from '../database/taskService';

export default function TodoFormScreen({ route, navigation }) {
  const { task } = route.params || {};
  const isEditing = !!task;

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');

  // Atualiza o título da tela quando está editando
  useEffect(() => {
    if (isEditing) {
      navigation.setOptions({ title: 'Editar Tarefa' });
    }
  }, [isEditing, navigation]);

  // Salva ou atualiza a tarefa
  const handleSave = async () => {
    // Validação: título é obrigatório
    if (!title.trim()) {
      Alert.alert('Erro', 'O título da tarefa é obrigatório');
      return;
    }

    try {
      if (isEditing) {
        // Atualiza tarefa existente
        await updateTask(task.id, title.trim(), description.trim());
        Alert.alert('Sucesso', 'Tarefa atualizada com sucesso!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('TodoList'),
          },
        ]);
      } else {
        // Cria nova tarefa
        await createTask(title.trim(), description.trim());
        Alert.alert('Sucesso', 'Tarefa criada com sucesso!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('TodoList'),
          },
        ]);
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        isEditing
          ? 'Não foi possível atualizar a tarefa'
          : 'Não foi possível criar a tarefa'
      );
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={globalStyles.container}>
        <View style={{ marginTop: 16 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 8,
              color: '#333',
            }}
          >
            Título <Text style={{ color: '#FF3B30' }}>*</Text>
          </Text>
          <TextInput
            style={globalStyles.formInput}
            placeholder="Digite o título da tarefa"
            value={title}
            onChangeText={setTitle}
            maxLength={200}
          />

          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 8,
              marginTop: 8,
              color: '#333',
            }}
          >
            Descrição
          </Text>
          <TextInput
            style={[globalStyles.formInput, globalStyles.formTextArea]}
            placeholder="Digite a descrição da tarefa (opcional)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            maxLength={1000}
          />

          <Pressable style={globalStyles.button} onPress={handleSave}>
            <Text style={globalStyles.buttonText}>Salvar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
