import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    TextInput,
    Keyboard,
    Animated,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import colors from '../colors';
import { Swipeable } from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Timestamp } from 'firebase/firestore';

const TaskModal = ({ list, closeModal, updateList, firebaseService }) => {
    const [newTodo, setNewTodo] = useState('');
    const [todoTime, setTodoTime] = useState(null);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);
    const [isEditMode, setEditMode] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        if (!list) {
            closeModal();
        }
    }, [list]);

    const toggleTodoCompleted = index => {
        let newList = { ...list };
        newList.todos[index].completed = !newList.todos[index].completed;

        updateList(newList);
        firebaseService.updateUserTasks(list.userId);
    };

    const handleAddOrEditTodo = () => {
        if (!newTodo.trim()) {
            return;
        }
        let newList = { ...list };
        if (isEditMode) {
            newList.todos[editIndex] = {
                ...newList.todos[editIndex],
                title: newTodo,
                time: todoTime ? Timestamp.fromDate(todoTime) : null,
            };
        } else {
            if (!newList.todos.some(todo => todo.title === newTodo)) {
                newList.todos.push({
                    title: newTodo,
                    completed: false,
                    time: todoTime ? Timestamp.fromDate(todoTime) : null,
                });
            }
        }

        updateList(newList);
        firebaseService.updateUserTasks(list.userId);
        setNewTodo('');
        setTodoTime(null);
        setEditMode(false);
        setEditIndex(null);
        Keyboard.dismiss();
    };

    const deleteTodo = index => {
        let newList = { ...list };
        newList.todos.splice(index, 1);

        updateList(newList);
        firebaseService.updateUserTasks(list.userId);
    };

    const editTodo = index => {
        let todo = list.todos[index];
        setNewTodo(todo.title);
        setTodoTime(todo.time ? todo.time.toDate() : null);
        setEditMode(true);
        setEditIndex(index);
    };

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleConfirmDate = date => {
        setTodoTime(date);
        hideDatePicker();
    };

    const showTimePicker = () => {
        setTimePickerVisible(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisible(false);
    };

    const handleConfirmTime = time => {
        setTodoTime(time);
        hideTimePicker();
    };

    const renderTodo = (todo, index) => {
        return (
            <Swipeable renderRightActions={(_, dragX) => rightActions(dragX, index)}>
                <View style={styles.todoContainer}>
                    <TouchableOpacity onPress={() => toggleTodoCompleted(index)}>
                        <Ionicons
                            name={todo.completed ? 'checkbox' : 'square-outline'}
                            size={24}
                            color={colors.gray}
                            style={{ width: 32 }}
                        />
                    </TouchableOpacity>

                    <Text
                        style={[
                            styles.todo,
                            {
                                textDecorationLine: todo.completed ? 'line-through' : 'none',
                                color: todo.completed ? colors.gray : colors.black,
                            },
                        ]}
                    >
                        {todo.title}
                    </Text>
                    <Text style={styles.dueDate}>
                        {todo.time ? new Date(todo.time.toDate()).toLocaleString() : ''}
                    </Text>
                    <TouchableOpacity onPress={() => editTodo(index)}>
                        <Ionicons name='create-outline' size={24} color={colors.gray} />
                    </TouchableOpacity>
                </View>
            </Swipeable>
        );
    };

    const rightActions = (dragX, index) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0.9],
            extrapolate: 'clamp',
        });

        const opacity = dragX.interpolate({
            inputRange: [-100, -20, 0],
            outputRange: [1, 0.9, 0],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity onPress={() => deleteTodo(index)}>
                <Animated.View style={[styles.deleteButton, { opacity }]}>
                    <Animated.Text style={{ color: colors.white, fontWeight: '800', transform: [{ scale }] }}>
                        Delete
                    </Animated.Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    const taskCount = list.todos.length;
    const completedCount = list.todos.filter(todo => todo.completed).length;

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
            <SafeAreaView style={styles.container}>
                <TouchableOpacity
                    style={{ position: 'absolute', top: 64, right: 32, zIndex: 10 }}
                    onPress={closeModal}
                >
                    <AntDesign name='close' size={24} color={colors.black} />
                </TouchableOpacity>

                <View style={[styles.section, styles.header, { borderBottomColor: list.color }]}>
                    <View>
                        <Text style={styles.title}>{list.name}</Text>
                        <Text style={styles.taskCount}>
                            {completedCount} of {taskCount} tasks
                        </Text>
                    </View>
                </View>

                <View style={[styles.section, { flex: 3, marginVertical: 16 }]}>
                    <FlatList
                        data={list.todos}
                        renderItem={({ item, index }) => renderTodo(item, index)}
                        keyExtractor={(_, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                <View style={[styles.section, styles.footer]}>
                    <TextInput
                        style={[styles.input, { borderColor: list.color }]}
                        onChangeText={text => setNewTodo(text)}
                        value={newTodo}
                        placeholder="New task"
                    />
                    <TouchableOpacity onPress={showTimePicker}>
                        <Text style={styles.dueDateButton}>Set Time</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.addTodo, { backgroundColor: list.color }]}
                        onPress={handleAddOrEditTodo}
                    >
                        <AntDesign name={isEditMode ? 'edit' : 'plus'} size={16} color={colors.white} />
                    </TouchableOpacity>
                </View>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode='date'
                    onConfirm={handleConfirmDate}
                    onCancel={hideDatePicker}
                />
                <DateTimePickerModal
                    isVisible={isTimePickerVisible}
                    mode='time'
                    onConfirm={handleConfirmTime}
                    onCancel={hideTimePicker}
                />
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        alignSelf: 'stretch',
    },
    header: {
        justifyContent: 'flex-end',
        marginLeft: 64,
        borderBottomWidth: 3,
        paddingTop: 16,
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        color: colors.black,
    },
    taskCount: {
        marginTop: 4,
        marginBottom: 16,
        color: colors.gray,
        fontWeight: '600',
    },
    footer: {
        paddingHorizontal: 32,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    input: {
        flex: 1,
        height: 48,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        marginRight: 8,
        paddingHorizontal: 8,
    },
    addTodo: {
        borderRadius: 4,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    todoContainer: {
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 32,
    },
    todo: {
        color: colors.black,
        fontWeight: '700',
        fontSize: 16,
        flex: 1,
    },
    dueDate: {
        color: colors.gray,
        fontSize: 12,
    },
    deleteButton: {
        flex: 1,
        backgroundColor: colors.red,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
    },
    dueDateButton: {
        color: colors.blue,
        fontSize: 16,
        marginHorizontal: 10,
    },
});

export default TaskModal;
