import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState('low');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const addTask = () => {
    if (task.trim().length > 0) {
      setTasks([
        ...tasks,
        { id: Date.now().toString(), text: task, completed: false, priority }
      ]);
      setTask('');
      setPriority('low');
    }
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((item) => item.id !== id));
  };

  const editTask = (item) => {
    setTask(item.text);
    setPriority(item.priority);
    setSelectedTask(item);
    setModalVisible(true);
  };

  const saveTask = () => {
    if (selectedTask) {
      setTasks(
        tasks.map((item) =>
          item.id === selectedTask.id
            ? { ...item, text: task, priority }
            : item
        )
      );
      setModalVisible(false);
      setSelectedTask(null);
      setTask('');
      setPriority('low');
    }
  };

  const sortedTasks = tasks.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const renderItem = ({ item }) => (
    <View style={[styles.task, { borderLeftColor: getPriorityColor(item.priority) }]}>
      <TouchableOpacity style={styles.taskTextContainer} onPress={() => toggleTask(item.id)}>
        <Text
          style={[
            styles.taskText,
            item.completed && styles.completedTask,
          ]}
        >
          {item.text}
        </Text>
      </TouchableOpacity>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.editButton} onPress={() => editTask(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#FF6B6B';
      case 'medium':
        return '#FFD93D';
      default:
        return '#6BCB77';
    }
  };

  const PriorityButton = ({ label, onPress, isSelected }) => (
    <TouchableOpacity
      style={[
        styles.priorityButton,
        { backgroundColor: isSelected ? getPriorityColor(label.toLowerCase()) : '#2C2C2C' }
      ]}
      onPress={onPress}
    >
      <Text style={[styles.priorityButtonText, { color: isSelected ? '#1E1E1E' : '#E0E0E0' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.mainContent}>
          <Text style={styles.title}>Task Manager</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={task}
              onChangeText={setTask}
              placeholder="Add a new task"
              placeholderTextColor="#888"
            />
          </View>
          <View style={styles.priorityContainer}>
            <PriorityButton
              label="Low"
              onPress={() => setPriority('low')}
              isSelected={priority === 'low'}
            />
            <PriorityButton
              label="Medium"
              onPress={() => setPriority('medium')}
              isSelected={priority === 'medium'}
            />
            <PriorityButton
              label="High"
              onPress={() => setPriority('high')}
              isSelected={priority === 'high'}
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>Add Task</Text>
          </TouchableOpacity>
          <FlatList
            data={sortedTasks}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        </View>
      </KeyboardAvoidingView>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              value={task}
              onChangeText={setTask}
              placeholder="Edit task"
              placeholderTextColor="#888"
            />
            <View style={styles.priorityContainer}>
              <PriorityButton
                label="Low"
                onPress={() => setPriority('low')}
                isSelected={priority === 'low'}
              />
              <PriorityButton
                label="Medium"
                onPress={() => setPriority('medium')}
                isSelected={priority === 'medium'}
              />
              <PriorityButton
                label="High"
                onPress={() => setPriority('high')}
                isSelected={priority === 'high'}
              />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={saveTask}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#E0E0E0',
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    backgroundColor: '#1E1E1E',
    color: '#E0E0E0',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priorityButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  priorityButtonText: {
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#3700B3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  task: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 5,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  buttons: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#0077BE',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#CF6679',
    padding: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: '#E0E0E0',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 10,
    width: '85%',
    maxWidth: 400,
  },
  saveButton: {
    backgroundColor: '#3700B3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#2C2C2C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: 'bold',
  },
});