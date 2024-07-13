import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import FirebaseService from "../FirebaseService";
import colors from "../colors";

export default class LeaderboardScreen extends React.Component {
    state = {
        users: []
    };

    componentDidMount() {
        this.firebaseService = new FirebaseService();
        this.firebaseService.getUsers(users => {
            console.log('Users fetched: ', users); 
            this.setState({ users });
        });
    }

    renderUser = ({ item }) => (
        <View style={styles.userContainer}>
            <Text style={styles.userText}>{item.email}</Text>
            <Text style={styles.userText}>
                Tasks Completed: {item.completedTasks || 0} / {item.totalTasks || 0}
            </Text>
        </View>
    );

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Leaderboard</Text>
                <FlatList
                    data={this.state.users}
                    renderItem={this.renderUser}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center"
    },
    list: {
        paddingBottom: 32
    },
    userContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray
    },
    userText: {
        fontSize: 16
    }
});
