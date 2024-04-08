import {connectToDatabase, getDatabase} from './database/database.js';
import {updateDB} from './cronjobs/updateDB.js';
import {typeDefs, resolvers} from './graphql/definations.js';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import cron from 'node-cron';



import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 4000;

await connectToDatabase();

cron.schedule('0 2 * * *', () => {
    console.log(`Updating database at ${new Date() }}`);
    updateDB();
});
// await updateDB();

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: { port: port },
    context: async ({ req }) => {
        return { database: getDatabase() };
    },
});

console.log(`🚀  Server ready at: ${url}`);

