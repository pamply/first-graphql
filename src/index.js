var express = require('express');
var graphqlHTTP = require('express-graphql');
var cors = require('cors');
var { buildSchema } = require('graphql');
var fakeDatabase = require('./database');

var options = require('./config-options');
// // var clientNodeGet = require('./client-node-get');
var clientNodeRequest = require('./client-node-request');
// var urlWithApi = require('./config-with-api');
// var call = require('./client-wreck');

// TYPE DEFINITIONS
class RandomDie {
    constructor(numSides) {
        this.numSides = numSides;
    }

    rollOnce() {
        return Math.floor(Math.random() * this.numSides) + 1;
    }

    roll({ numRolls }) {
        var output = [];
        for (let i = 0; i < numRolls; i++) {
            output.push(this.rollOnce());
        }
        return output;
    }
}

class Message {
    constructor(id, { author, content }) {
        this.id = id;
        this.author = author;
        this.content = content;
    }
}

// SCHEMA DEFINITION
var schema = buildSchema(`
    input MessageInput {
        content: String
        author: String
    }

    input UserInput {
        username: String
        password: String
        email: String
    }

    input LoginInput {
        username: String
        password: String
    }

    type Message {
        id: ID!
        content: String
        author: String
    }

    type User {
        username: String
        password: String
        email: String
    }

    type Mutation {
        createUser(input: UserInput): User
        createMessage(input: MessageInput): Message
        updateMessage(id: ID!, message: MessageInput): Message
    }

    type RandomDie {
        numSides: Int!
        rollOnce: Int!
        roll(numRolls: Int!): [Int]
    }

    type Query {
        callMethod1: String,
        callMethod2: String,
        getMessage(id: ID!): Message
        quoteOfTheDay: String
        random: Float!
        rollDice(numDice: Int, numSides: Int!): [Int]
        getDie(numSides: Int): RandomDie
        getUser(input: LoginInput): User
    }
`);

 // ACTIONS
const callMethod1 = () => {
    // clientNodeGet(options);
    // call(urlWithApi);
    clientNodeRequest(options);
    return "callMethod1";
}

const callMethod2 = () => {
    // clientNodeGet(options);
    // call(urlWithApi);
    clientNodeRequest(options);
    return "callMethod2";
}

const createUser = ({ input: { username, password, email } }) => {
    
    // clientNodeGet(options);

    fakeDatabase.users.push({
        username,
        password,
        email
    });
    return fakeDatabase.users[fakeDatabase.users.length - 1];
}

const getUser = ({ input }) => {
    return fakeDatabase.users.find(user => 
        user.username === input.username.toLowerCase() 
        && user.password === input.password.toLowerCase()
    );
}

const createMessage = ({ input }) => {
    const id = require('crypto').randomBytes(10).toString('hex');
    fakeDatabase[id] = input;
    return new Message(id, input);
}
const updateMessage = ({ id, input }) => {
    if(!fakeDatabase[id]) {
        throw new Error(`No message exists with id = ${id}`);
    }
    fakeDatabase[id] = input;
    return new Message(id, input);
}

const getMessage = (id) => {
    if(!fakeDatabase[id]) {
        throw new Error(`No message exists with id = ${id}`);
    }
    return fakeDatabase[id];
}

const quoteOfTheDay = () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvaton lies within';
}

const random = () => {
    return Math.random();
}

const rollDice = ({ numDice,  numSides}) => {
    var output = [];
    for(let i = 0; i < numDice; i++) {
        output.push(Math.floor(Math.random() * (numSides || 6)) + 1)
    }
    return output;
}

const getDie = ({ numSides }) => {
    return new RandomDie(numSides || 6);
}

// The root provides a resolver function for each API endpoint
var root = {
    callMethod1,
    callMethod2,
    createUser,
    getUser,
    createMessage,
    updateMessage,
    getMessage,
    quoteOfTheDay,
    random,
    rollDice,
    getDie
}

var app = express({
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
});
app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

const port = 3000;
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);
