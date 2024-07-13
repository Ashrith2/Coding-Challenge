export const mockLists = [
    {
        id: '1',
        name: 'Personal',
        color: '#24A6D9',
        todos: [
            { title: 'Buy groceries', completed: true, createdAt: new Date(), completedAt: new Date() },
            { title: 'Clean the house', completed: false, createdAt: new Date() },
            { title: 'Walk the dog', completed: true, createdAt: new Date(), completedAt: new Date() }
        ]
    },
    {
        id: '2',
        name: 'Work',
        color: '#8022D9',
        todos: [
            { title: 'Finish project report', completed: false, createdAt: new Date() },
            { title: 'Email client', completed: true, createdAt: new Date(), completedAt: new Date() }
        ]
    },
    {
        id: '3',
        name: 'Shopping',
        color: '#5CD859',
        todos: [
            { title: 'Buy a new phone', completed: false, createdAt: new Date() },
            { title: 'Order groceries online', completed: false, createdAt: new Date() }
        ]
    }
];
