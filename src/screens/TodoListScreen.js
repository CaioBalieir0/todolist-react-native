import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { globalStyles } from '../styles/globalStyles';
import { getTasks, deleteTask, toggleDone } from '../database/taskService';
import CustomPicker from '../components/CustomPicker';
import { useAuth } from '../context/AuthContext';
import { showSuccess, showError } from '../utils/toast';

export default function TodoListScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'done', 'pending'
  const [filterTitle, setFilterTitle] = useState('');

  // Carrega as tarefas do banco de dados
  const loadTasks = async () => {
    if (!user || !user.id) {
      console.error('Usuário não está logado');
      return;
    }

    try {
      const tasksList = await getTasks(user.id);
      setTasks(tasksList);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as tarefas');
      console.error(error);
    }
  };

  // Carrega tarefas quando a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [user])
  );

  // Configura o header com avatar e botão de logout
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 10,
          }}
        >
          {/* Avatar e Nome do Usuário */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 12,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#007AFF',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#333',
                maxWidth: 120,
              }}
              numberOfLines={1}
            >
              {user?.email || 'Usuário'}
            </Text>
          </View>

          {/* Botão de Logout */}
          <Pressable
            onPress={() => {
              logout();
              navigation.replace('Login');
            }}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              backgroundColor: '#FF3B30',
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 14,
                fontWeight: '600',
              }}
            >
              Sair
            </Text>
          </Pressable>
        </View>
      ),
    });
  }, [navigation, user, logout]);

  // Atualiza a lista ao puxar para baixo
  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  // Exclui uma tarefa com confirmação
  const handleDelete = (task) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir a tarefa "${task.title}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            if (!user || !user.id) {
              showError('Erro', 'Usuário não está logado');
              return;
            }

            try {
              await deleteTask(task.id, user.id);
              await loadTasks();
              showSuccess(
                'Tarefa excluída',
                'A tarefa foi removida com sucesso'
              );
            } catch (error) {
              showError(
                'Erro',
                error.message || 'Não foi possível excluir a tarefa'
              );
            }
          },
        },
      ]
    );
  };

  // Marca tarefa como concluída ou pendente
  const handleToggleDone = async (task) => {
    if (!user || !user.id) {
      showError('Erro', 'Usuário não está logado');
      return;
    }

    try {
      await toggleDone(task.id, task.done, user.id);
      showSuccess(`${task.title}:`, 'Status atualizado');
      await loadTasks();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o status da tarefa');
      showError('Erro', 'Não foi possível atualizar o status da tarefa');
    }
  };

  // Navega para a tela de edição
  const handleEdit = (task) => {
    navigation.navigate('TodoForm', { task });
  };

  // Renderiza cada item da lista
  const renderTaskItem = ({ item }) => {
    const isDone = item.done;

    return (
      <View
        style={[globalStyles.taskItem, isDone && globalStyles.taskItemDone]}
      >
        <Text
          style={[globalStyles.taskTitle, isDone && globalStyles.taskTitleDone]}
        >
          {item.title}
        </Text>

        {item.description ? (
          <Text
            style={[
              globalStyles.taskDescription,
              isDone && globalStyles.taskDescriptionDone,
            ]}
          >
            {item.description}
          </Text>
        ) : null}

        <Text
          style={[
            globalStyles.taskStatus,
            isDone && globalStyles.taskStatusDone,
          ]}
        >
          {isDone ? '✓ Concluída' : '○ Pendente'}
        </Text>

        <View style={globalStyles.taskActions}>
          <Pressable
            style={[globalStyles.actionButton, globalStyles.editButton]}
            onPress={() => handleEdit(item)}
          >
            <Text style={globalStyles.actionButtonText}>Editar</Text>
          </Pressable>

          <Pressable
            style={[globalStyles.actionButton, globalStyles.deleteButton]}
            onPress={() => handleDelete(item)}
          >
            <Text style={globalStyles.actionButtonText}>Excluir</Text>
          </Pressable>

          <Pressable
            style={[globalStyles.actionButton, globalStyles.doneButton]}
            onPress={() => handleToggleDone(item)}
          >
            <Text style={globalStyles.actionButtonText}>
              {isDone ? 'Desfazer' : 'Concluir'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  // Filtra as tarefas baseado nos filtros
  const filteredTasks = tasks.filter((task) => {
    // Filtro por status
    if (filterStatus === 'done' && !task.done) return false;
    if (filterStatus === 'pending' && task.done) return false;

    // Filtro por título
    if (filterTitle.trim()) {
      const titleMatch = task.title
        .toLowerCase()
        .includes(filterTitle.toLowerCase().trim());
      if (!titleMatch) return false;
    }

    return true;
  });

  // Renderiza lista vazia
  const renderEmptyList = () => (
    <View style={globalStyles.emptyList}>
      <Text style={globalStyles.emptyListText}>
        {tasks.length === 0
          ? 'Nenhuma tarefa cadastrada\nToque no botão + para adicionar uma nova tarefa'
          : 'Nenhuma tarefa encontrada com os filtros aplicados'}
      </Text>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      {/* Filtros */}
      <View style={globalStyles.filterContainer}>
        <Text style={globalStyles.filterLabel}>Filtros</Text>

        {/* Linha horizontal dividida em duas metades */}
        <View style={globalStyles.filterRow}>
          {/* Metade esquerda: Filtro por Status (com CustomPicker) */}
          <View style={globalStyles.filterHalf}>
            <Text style={globalStyles.filterRowLabel}>Status:</Text>
            <CustomPicker
              selectedValue={filterStatus}
              onValueChange={(itemValue) => setFilterStatus(itemValue)}
              items={[
                { label: 'Todas', value: 'all' },
                { label: 'Pendentes', value: 'pending' },
                { label: 'Concluídas', value: 'done' },
              ]}
              placeholder="Selecione status..."
            />
          </View>

          {/* Metade direita: Filtro por Título (TextInput) */}
          <View style={globalStyles.filterHalf}>
            <Text style={globalStyles.filterRowLabel}>Título:</Text>
            <TextInput
              style={globalStyles.filterInput}
              placeholder="Buscar por título..."
              value={filterTitle}
              onChangeText={setFilterTitle}
              autoCapitalize="none"
            />
          </View>
        </View>
      </View>

      <FlatList
        data={filteredTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={
          filteredTasks.length === 0 ? { flex: 1 } : { paddingBottom: 100 }
        }
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Botão flutuante para adicionar nova tarefa */}
      <Pressable
        style={globalStyles.fab}
        onPress={() => navigation.navigate('TodoForm')}
      >
        <Text style={globalStyles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}
