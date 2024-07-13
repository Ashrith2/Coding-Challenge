# Coding-Challenge

# TaskManager

A task management application built with React Native and Firebase.

## Table of Contents

- [Setup](#setup)
- [Running the Project](#running-the-project)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Setup

-Install the dependencies:
`
npm install
`
- Create a Firebase project at Firebase Console.
- Add a web app to your Firebase project.
- Copy the Firebase config object.
- Create a firebase.js file in the root of your project and paste the Firebase config:
- add the credentials you get from firebase.
```
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```
## Running the Project
- Start the development server:
`
npx expo start
`
- Follow the instructions in the terminal to open the app on your simulator or physical device.

- Using Expo Go:

```
Download the Expo Go app from the App Store (iOS) or Google Play Store (Android).
Open the Expo Go app on your device.
Scan the QR code displayed in the terminal after running npx expo start.
Instructions to follow in the terminal:

The terminal will provide interactive options. Use them to quickly launch the app on your preferred device.
Press w to open the project in the web browser.
Press r to reload the app.
Press m to toggle the developer menu.
```
## Features
- User authentication (Sign up, Login)
- Task management (CRUD operations)
- Leaderboard showing top users
- Filtering tasks by date (today, week, month)

## Contributing
if you want to contribute to this project, please follow these steps:
- Fork the repository.
- Create a new branch (git checkout -b feature/YourFeature).
- Make your changes and commit them (git commit -m 'Add some feature').
- Push to the branch (git push origin feature/YourFeature).
- Create a new Pull Request.

### Prerequisites
- Install the necessary dependencies for Firebase and DateTimePicker:
  
  `npm install firebase react-native-modal-datetime-picker`

## Firestore Index Setup

If you encounter an error related to Firestore indexes, follow these steps to create the necessary index:

1. **Go to Firestore Indexes Page:**
   Open the Firebase console and navigate to your Firestore database. Select the "Indexes" tab.

2. **Start Creating a New Index:**
   Click on the "Create Index" button.

3. **Define the Composite Index:**
   Create an index with the following fields:
   
   - **Collection ID**: `tasks`
   - **Fields**:
     - `dueDate`: Ascending
     - `userId`: Ascending

4. **Save the Index:**
   Click on "Create" to save the index. Firestore will take some time to build the index. Once it is ready, your queries should work without the indexing error.

### Example Index Creation

Here’s how you might set up the index if the collection is `tasks` and the fields are `dueDate` and `userId`:

- **Collection ID**: `tasks`
- **Field**: `dueDate` (Ascending)
- **Field**: `userId` (Ascending)

Once the index is created, the error should be resolved, and your Firestore queries should work as expected.

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/YourUsername/TaskManager.git
   cd TaskManager
