import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../colors';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Timestamp } from 'firebase/firestore'; 

const AddTaskModal = ({ addList, closeModal }) => {
    const [name, setName] = useState("");
    const [color, setColor] = useState(colors.blue);
    const [dueDate, setDueDate] = useState(null);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);

    const createTask = () => {
        const task = {
            name,
            color,
            todos: [],
            dueDate: dueDate ? Timestamp.fromDate(dueDate) : null 
        };
        addList(task);
        setName("");
        closeModal();
    };

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleConfirm = (date) => {
        setDueDate(date);
        hideDatePicker();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={{ position: 'absolute', top: 64, right: 32 }} onPress={closeModal}>
                <AntDesign name="close" size={24} color={colors.black} />
            </TouchableOpacity>

            <View style={{ alignSelf: 'stretch', marginHorizontal: 32 }}>
                <Text style={styles.title}>Create Task List</Text>

                <TextInput
                    style={styles.input}
                    placeholder="List Name"
                    onChangeText={text => setName(text)}
                    value={name}
                />

                <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
                    <Text style={styles.datePickerText}>
                        {dueDate ? dueDate.toDateString() : "Set Due Date"}
                    </Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
                    <TouchableOpacity
                        style={[styles.colorSelect, { backgroundColor: colors.blue }]}
                        onPress={() => setColor(colors.blue)}
                    />
                    <TouchableOpacity
                        style={[styles.colorSelect, { backgroundColor: colors.green }]}
                        onPress={() => setColor(colors.green)}
                    />
                    <TouchableOpacity
                        style={[styles.colorSelect, { backgroundColor: colors.red }]}
                        onPress={() => setColor(colors.red)}
                    />
                    <TouchableOpacity
                        style={[styles.colorSelect, { backgroundColor: colors.orange }]}
                        onPress={() => setColor(colors.orange)}
                    />
                    <TouchableOpacity
                        style={[styles.colorSelect, { backgroundColor: colors.yellow }]}
                        onPress={() => setColor(colors.yellow)}
                    />
                </View>

                <TouchableOpacity style={[styles.create, { backgroundColor: color }]} onPress={createTask}>
                    <Text style={{ color: colors.white, fontWeight: "600" }}>Create!</Text>
                </TouchableOpacity>
            </View>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: colors.black,
        alignSelf: 'center',
        marginBottom: 16
    },
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.lightGray,
        borderRadius: 6,
        height: 50,
        marginTop: 8,
        paddingHorizontal: 16,
        fontSize: 18
    },
    create: {
        marginTop: 24,
        height: 50,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    colorSelect: {
        width: 30,
        height: 30,
        borderRadius: 4
    },
    datePickerButton: {
        marginTop: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.lightGray,
        borderRadius: 6
    },
    datePickerText: {
        fontSize: 18,
        color: colors.gray
    }
});

export default AddTaskModal;
