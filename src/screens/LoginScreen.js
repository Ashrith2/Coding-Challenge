import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import colors from "../colors";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => navigation.navigate('Home'))
            .catch(error => setErrorMessage(error.message));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>{`Welcome back!\nLogin to continue.`}</Text>
            {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputTitle}>Email</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        onChangeText={setEmail}
                        value={email}
                    />
                </View>
                <View style={[styles.inputContainer, { marginTop: 32 }]}>
                    <Text style={styles.inputTitle}>Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        autoCapitalize="none"
                        onChangeText={setPassword}
                        value={password}
                    />
                </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.signUpLink}
                onPress={() => navigation.navigate("SignUp")}
            >
                <Text style={styles.signUpText}>
                    New to TaskManager? <Text style={styles.signUpTextBold}>Sign Up</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        justifyContent: "center",
        alignItems: "center",
        padding: 16
    },
    greeting: {
        marginTop: 32,
        fontSize: 28,
        fontWeight: "600",
        textAlign: "center",
        color: colors.blue,
    },
    errorMessage: {
        height: 72,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30,
        color: colors.red,
        textAlign: "center",
        marginTop: 16,
        fontSize: 14,
        fontWeight: "500"
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30,
        width: '100%',
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputTitle: {
        color: colors.darkGray,
        fontSize: 14,
        textTransform: "uppercase",
        marginBottom: 8,
        fontWeight: "500"
    },
    input: {
        borderWidth: 1,
        borderColor: colors.lightGray,
        borderRadius: 8,
        height: 48,
        fontSize: 16,
        paddingHorizontal: 16,
        color: colors.black,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    button: {
        marginHorizontal: 30,
        backgroundColor: colors.blue,
        borderRadius: 8,
        height: 52,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
        width: '100%',
    },
    buttonText: {
        color: colors.white,
        fontWeight: "600",
        fontSize: 18
    },
    signUpLink: {
        alignSelf: "center",
        marginTop: 32,
    },
    signUpText: {
        color: colors.blue,
        fontSize: 15,
    },
    signUpTextBold: {
        fontWeight: "700",
        color: colors.blue
    }
});

export default LoginScreen;
