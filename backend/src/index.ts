import express from 'express'
import { schema } from './graphql'
import { Users } from './db'
import { hash } from './crypto';
import { roots } from './graphql';

const run = async () => {
    const { graphqlHTTP } = await import('@bluesialia/express-graphql');

    const app = express();
    const PORT = process.env.PORT || 80;

    app.get('/', (req, res) => {
        res.sendStatus(200);
    });

    app.get('/test', (req, res) => {
        res.send(Users.create('test@example.com', 'test', 'testpassword'));
    });

    app.use(
        '/graphql',
        graphqlHTTP({
            schema,
            rootValue: {
                userRead: roots.read.user,
                serverRead: roots.read.server,
                userUpdate: roots.update.user,
            },
            graphiql: true
        })
    )

    app.listen(PORT, () => console.log(`server started on port ${PORT}`));

}

run();