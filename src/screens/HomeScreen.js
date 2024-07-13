import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, Button } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';
import TaskList from '../components/TaskList';
import AddTaskModal from '../components/AddTaskModal';
import TaskModal from '../components/TaskModel';
import FirebaseService from '../FirebaseService';
import { auth } from '../firebase';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const HomeScreen = ({ navigation }) => {
    const [addTodoVisible, setAddTodoVisible] = useState(false);
    const [lists, setLists] = useState([]);
    const [user, setUser] = useState({});
    const [selectedList, setSelectedList] = useState(null);
    const [filter, setFilter] = useState('all'); // default filter
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const firebaseService = new FirebaseService();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user);
                firebaseService.currentUserEmail = user.email;  
                loadTasks();
                loadUsers();
            } else {
                navigation.navigate('Login');
            }
        });

        return () => {
            firebaseService.detach();
            unsubscribe();
        };
    }, [user, filter, selectedDate]);

    const toggleAddTodoModal = () => {
        setAddTodoVisible(!addTodoVisible);
    };

    const loadTasks = () => {
        if (!user.uid) return;

        switch (filter) {
            case 'today':
                firebaseService.getTodayTasks(setLists, user.uid, selectedDate);
                break;
            case 'week':
                firebaseService.getWeekTasks(setLists, user.uid, selectedDate);
                break;
            case 'month':
                firebaseService.getMonthTasks(setLists, user.uid, selectedDate);
                break;
            default:
                firebaseService.getAllTasks(setLists, user.uid);
                break;
        }
    };

    const loadUsers = () => {
        firebaseService.getUsers(setUsers);
    };

    const addList = list => {
        const { uid } = user;
        firebaseService.addList({
            name: list.name,
            color: list.color,
            todos: [],
            dueDate: list.dueDate
        }, uid);
        loadTasks();
    };

    const updateList = list => {
        firebaseService.updateList(list);
        loadTasks();
    };

    const deleteList = list => {
        firebaseService.deleteList(list);
        loadTasks();
    };

    const handleLogout = () => {
        auth.signOut().then(() => {
            navigation.navigate('SignIn');
        });
    };

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleConfirmDate = (date) => {
        setSelectedDate(date);
        setDatePickerVisible(false);
        setFilter('today'); 
    };

    const renderList = list => {
        return (
            <TaskList
                list={list}
                updateList={updateList}
                deleteList={deleteList}
                selectList={setSelectedList}
            />
        );
    };

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                visible={addTodoVisible}
                onRequestClose={toggleAddTodoModal}
            >
                <AddTaskModal closeModal={toggleAddTodoModal} addList={addList} />
            </Modal>

            <Modal
                animationType="slide"
                visible={selectedList !== null}
                onRequestClose={() => setSelectedList(null)}
            >
                <TaskModal
                    list={selectedList}
                    closeModal={() => setSelectedList(null)}
                    updateList={updateList}
                    firebaseService={firebaseService} 
                />
            </Modal>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: 16 }}>
                <TouchableOpacity style={styles.authButton} onPress={handleLogout}>
                    <Text style={styles.authButtonText}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('Leaderboard')}>
                    <Text style={styles.authButtonText}>Leaderboard</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row' }}>
                <View style={styles.divider} />
                <Text style={styles.title}>
                    Task <Text style={{ fontWeight: '300', color: colors.blue }}>Manager</Text>
                </Text>
                <View style={styles.divider} />
            </View>

            <View style={{ marginVertical: 48 }}>
                <TouchableOpacity style={styles.addList} onPress={toggleAddTodoModal}>
                    <AntDesign name="plus" size={16} color={colors.blue} />
                </TouchableOpacity>

                <Text style={styles.add}>Add Task</Text>
            </View>

            <View style={{ height: 275, paddingLeft: 32 }}>
                <FlatList
                    data={lists}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setSelectedList(item)}>
                            {renderList(item)}
                        </TouchableOpacity>
                    )}
                    keyboardShouldPersistTaps="always"
                />
            </View>

            <View style={styles.filterContainer}>
                <Button title="All" onPress={() => { setFilter('all'); setSelectedDate(new Date()); }} />
                <Button title="Today" onPress={showDatePicker} />
                <Button title="Week" onPress={() => { setFilter('week'); setSelectedDate(new Date()); }} />
                <Button title="Month" onPress={() => { setFilter('month'); setSelectedDate(new Date()); }} />
            </View>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmDate}
                onCancel={hideDatePicker}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    divider: {
        backgroundColor: colors.lightBlue,
        height: 1,
        flex: 1,
        alignSelf: 'center'
    },
    title: {
        fontSize: 38,
        fontWeight: '800',
        color: colors.black,
        paddingHorizontal: 64
    },
    addList: {
        borderWidth: 2,
        borderColor: colors.lightBlue,
        borderRadius: 4,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    add: {
        color: colors.blue,
        fontWeight: '600',
        fontSize: 14,
        marginTop: 8
    },
    authButton: {
        backgroundColor: colors.blue,
        padding: 10,
        borderRadius: 5
    },
    authButtonText: {
        color: colors.white,
        fontWeight: '600'
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 16
    }
});

export default HomeScreen;
