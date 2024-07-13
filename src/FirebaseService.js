import { db } from './firebase';
import { 
    collection, 
    getDocs, 
    onSnapshot, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    setDoc, 
    query, 
    where, 
    orderBy, 
    getDoc,
    Timestamp 
} from 'firebase/firestore';
import { auth } from './firebase';

class FirebaseService {
    constructor() {
        this.listsRef = collection(db, 'lists');
        this.usersRef = collection(db, 'users');
        this.unsubscribe = null;
        this.currentUserEmail = "";

        
        auth.onAuthStateChanged(user => {
            if (user) {
                this.currentUserEmail = user.email;
            }
        });
    }

    // Function to get lists for a specific user
    getLists(callback, uid) {
        const listsQuery = query(this.listsRef, where('userId', '==', uid), orderBy('name'));
        this.unsubscribe = onSnapshot(listsQuery, (snapshot) => {
            let lists = [];
            snapshot.forEach(doc => {
                lists.push({ id: doc.id, ...doc.data() });
            });
            callback(lists);
        });
    }

    // Function to get all tasks for a specific user
    getAllTasks(callback, uid) {
        const listsQuery = query(this.listsRef, where('userId', '==', uid));
        this.unsubscribe = onSnapshot(listsQuery, (snapshot) => {
            let lists = [];
            snapshot.forEach(doc => {
                lists.push({ id: doc.id, ...doc.data() });
            });
            callback(lists);
        });
    }

    // Function to add a new list
    async addList(list, uid) {
        await addDoc(this.listsRef, { ...list, userId: uid });
        this.updateUserTasks(uid);
    }

    // Function to update an existing list
    async updateList(list) {
        const docRef = doc(db, 'lists', list.id);
        await updateDoc(docRef, list);
        this.updateUserTasks(list.userId);
    }

    // Function to delete an existing list
    async deleteList(list) {
        const docRef = doc(db, 'lists', list.id);
        await deleteDoc(docRef);
        this.updateUserTasks(list.userId);
    }

    // Function to add a new user
    async addUser(user) {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, {
            email: user.email,
            completedTasks: 0,
            totalTasks: 0
        });
    }

    // Function to get details of a user
    async getUser(uid, callback) {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            callback(docSnap.data());
        } else {
            callback(null);
        }
    }

    // Function to get all users
    getUsers(callback) {
        const usersQuery = query(this.usersRef, orderBy('completedTasks', 'desc'));
        this.unsubscribe = onSnapshot(usersQuery, (snapshot) => {
            let users = [];
            snapshot.forEach(doc => {
                users.push({ id: doc.id, ...doc.data() });
            });
            callback(users);
        });
    }

    // Function to update the task count for a user
    async updateUserTasks(uid) {
        const listsQuery = query(this.listsRef, where('userId', '==', uid));
        const snapshot = await getDocs(listsQuery);

        let completedTasks = 0;
        let totalTasks = 0;
        let todayCompletedTasks = 0;
        let todayTotalTasks = 0;

        const { start, end } = this.getStartAndEndOfDay(new Date());

        snapshot.forEach(doc => {
            const todos = doc.data().todos || [];
            totalTasks += todos.length;
            completedTasks += todos.filter(todo => todo.completed).length;

            todos.forEach(todo => {
                if (todo.time && todo.time.toDate() >= start && todo.time.toDate() <= end) {
                    todayTotalTasks++;
                    if (todo.completed) {
                        todayCompletedTasks++;
                    }
                }
            });
        });

        const docRef = doc(db, 'users', uid);
        const userDoc = await getDoc(docRef);

        if (!userDoc.exists()) {
            await setDoc(docRef, {
                email: this.currentUserEmail,
                completedTasks,
                totalTasks,
                todayCompletedTasks,
                todayTotalTasks
            });
        } else {
            await updateDoc(docRef, {
                email: this.currentUserEmail,
                completedTasks,
                totalTasks,
                todayCompletedTasks,
                todayTotalTasks
            });
        }
    }

    // Helper function to get the start and end of a day
    getStartAndEndOfDay(date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        return { start, end };
    }

    // Helper function to get the start and end of a week
    getStartAndEndOfWeek(date) {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        return { start, end };
    }

    // Helper function to get the start and end of a month
    getStartAndEndOfMonth(date) {
        if (!date) {
            date = new Date();
        }
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        return { start, end };
    }

    // Function to get tasks for today
    getTodayTasks(callback, uid, date) {
        const { start, end } = this.getStartAndEndOfDay(date);
        const listsQuery = query(
            this.listsRef,
            where('userId', '==', uid),
            where('dueDate', '>=', Timestamp.fromDate(start)),
            where('dueDate', '<=', Timestamp.fromDate(end))
        );
        this.unsubscribe = onSnapshot(listsQuery, (snapshot) => {
            let lists = [];
            snapshot.forEach(doc => {
                lists.push({ id: doc.id, ...doc.data() });
            });
            callback(lists);
        });
    }

    // Function to get tasks for this week
    getWeekTasks(callback, uid, date) {
        const { start, end } = this.getStartAndEndOfWeek(date);
        const listsQuery = query(
            this.listsRef,
            where('userId', '==', uid),
            where('dueDate', '>=', Timestamp.fromDate(start)),
            where('dueDate', '<=', Timestamp.fromDate(end))
        );
        this.unsubscribe = onSnapshot(listsQuery, (snapshot) => {
            let lists = [];
            snapshot.forEach(doc => {
                lists.push({ id: doc.id, ...doc.data() });
            });
            callback(lists);
        });
    }

    // Function to get tasks for this month
    getMonthTasks(callback, uid, date) {
        const { start, end } = this.getStartAndEndOfMonth(date);
        const listsQuery = query(
            this.listsRef,
            where('userId', '==', uid),
            where('dueDate', '>=', Timestamp.fromDate(start)),
            where('dueDate', '<=', Timestamp.fromDate(end))
        );
        this.unsubscribe = onSnapshot(listsQuery, (snapshot) => {
            let lists = [];
            snapshot.forEach(doc => {
                lists.push({ id: doc.id, ...doc.data() });
            });
            callback(lists);
        });
    }

    // Function to detach snapshot listeners
    detach() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}

export default FirebaseService;
