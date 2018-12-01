var express = require('express');
var graphqlHTTP = require('express-graphql');
var cors = require('cors');
var { buildSchema } = require('graphql');
var fakeDatabase = require('./database');

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

var schema = buildSchema(`
    input MessageInput {
        content: String
        author: String
    }

    type Message {
        id: ID!
        content: String
        author: String
    }

    type Mutation {
        createMessage(input: MessageInput): Message
        updateMessage(id: ID!, message: MessageInput): Message
    }

    type RandomDie {
        numSides: Int!
        rollOnce: Int!
        roll(numRolls: Int!): [Int]
    }

    type Query {
        getMessage(id: ID!): Message
        quoteOfTheDay: String
        random: Float!
        rollDice(numDice: Int, numSides: Int!): [Int]
        getDie(numSides: Int): RandomDie
    }
`);

// The root provides a resolver function for each API endpoint
var root = {
    
    createMessage: ({ input }) => {
        const id = require('crypto').randomBytes(10).toString('hex');
        fakeDatabase[id] = input;
        return new Message(id, input);
    },

    updateMessage: ({ id, input }) => {
        if(!fakeDatabase[id]) {
            throw new Error(`No message exists with id = ${id}`);
        }
        fakeDatabase[id] = input;
        return new Message(id, input);
    },

    getMessage: (id) => {
        if(!fakeDatabase[id]) {
            throw new Error(`No message exists with id = ${id}`);
        }
        return fakeDatabase[id];
    },
    quoteOfTheDay: () => {
        return Math.random() < 0.5 ? 'Take it easy' : 'Salvaton lies within';
    },
    random: () => {
        return Math.random();
    },
    rollDice: ({ numDice,  numSides}) => {
        var output = [];
        for(let i = 0; i < numDice; i++) {
            output.push(Math.floor(Math.random() * (numSides || 6)) + 1)
        }
        return output;
    },
    getDie: ({ numSides }) => {
        return new RandomDie(numSides || 6);
    }
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
