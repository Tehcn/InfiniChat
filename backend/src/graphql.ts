import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLScalarType, GraphQLList } from 'graphql'
import { Servers, Users } from './db'

const DateTimeType = new GraphQLScalarType({
    name: 'DateTime',
    serialize: (t) => {
        console.log(t);
        return new Date();
    }
});

const MessageType = new GraphQLObjectType({
    name: 'Message',
    fields: () => ({
        id: { type: GraphQLID },
        contents: { type: GraphQLString },
        senderId: { type: GraphQLInt }
    })
});

const ChannelType = new GraphQLObjectType({
    name: 'Channel',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        serverId: { type: GraphQLInt }
    })
});

const ServerType: any = new GraphQLObjectType({
    name: 'Server',
    fields: () => ({
        id: { type: GraphQLID, args: { name: { type: GraphQLString } } },
        name: { type: GraphQLString, args: { id: { type: GraphQLInt } } },
        icon: { type: GraphQLString, args: { id: { type: GraphQLInt } } },
        members: { type: new GraphQLList(UserType), args: { id: { type: GraphQLInt } } },
        channels: { type: new GraphQLList(ChannelType), args: { id: { type: GraphQLInt } } },
        createdAt: { type: DateTimeType, args: { id: { type: GraphQLInt } } }
    })
});

const UserType: any = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID, args: { username: { type: GraphQLString }, tag: { type: GraphQLInt } } },
        email: { type: GraphQLString, args: { id: { type: GraphQLInt } } },
        username: { type: GraphQLString, args: { id: { type: GraphQLInt } } },
        password: { type: GraphQLString, args: { id: { type: GraphQLInt } } },
        bio: { type: GraphQLString, args: { id: { type: GraphQLInt } } },
        icon: { type: GraphQLString, args: { id: { type: GraphQLInt } } },
        createdAt: { type: DateTimeType, args: { id: { type: GraphQLInt } } },
        servers: { type: new GraphQLList(ServerType), args: { id: { type: GraphQLInt } } },
        friends: { type: new GraphQLList(UserType), args: { id: { type: GraphQLInt } } }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        user: { type: UserType },
        server: { type: ServerType },
        allUsers: { type: new GraphQLList(UserType) }
    })
});

const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        createUser: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                username: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve: async (source, args, ctx, info) => await Users.create(args.email, args.username, args.password)
        },
        createServer: {
            type: ServerType,
            args: {
                name: { type: GraphQLString }
            },
            resolve: async (source, args, ctx, info) => await Servers.create(args.name)
        }
    })
})

export const roots = {
    read: {
        user: {
            id: (value: { username: string, tag: number }) => Users.getByNameAndTag(value.username, value.tag).then(user => user.filter(v => v.username == value.username && v.tag == value.tag)[0]),
            email: (value: { id: number }) => Users.getById(value.id).then(user => user?.email),
            username: (value: { id: number }) => Users.getById(value.id).then(user => user?.username),
            bio: (value: { id: number }) => Users.getById(value.id).then(user => user?.bio),
            icon: (value: { id: number }) => Users.getById(value.id).then(user => user?.icon),
            createdAt: (value: { id: number }) => Users.getById(value.id).then(user => user?.createdAt),
            servers: (value: { id: number }) => Users.getById(value.id).servers(),
            friends: (value: { id: number }) => Users.getById(value.id).friends(),
        },
        server: {
            id: (value: { name: string }) => Servers.getByName(value.name).then(server => server.filter(v => v.name == value.name)[0]),
            icon: (value: { id: number }) => Servers.getById(value.id).then(server => server?.icon),
            createdAt: (value: { id: number }) => Servers.getById(value.id).then(server => server?.createdAt),
            members: (value: { id: number }) => Servers.getById(value.id).members(),
            channels: (value: { id: number }) => Servers.getById(value.id).channels(),
        },
        // allUsers: {
        //     id: (value: { username: string, tag: number }) => Users.getByNameAndTag(value.username, value.tag).then(user => user.filter(v => v.username == value.username && v.tag == value.tag)[0]),
        //     email: (value: { id: number }) => Users.getById(value.id).then(user => user?.email),
        //     // username: (value: { id: number }) => Users.getById(value.id).then(user => user?.username),
        //     bio: (value: { id: number }) => Users.getById(value.id).then(user => user?.bio),
        //     icon: (value: { id: number }) => Users.getById(value.id).then(user => user?.icon),
        //     createdAt: (value: { id: number }) => Users.getById(value.id).then(user => user?.createdAt),
        //     servers: (value: { id: number }) => Users.getById(value.id).servers(),
        //     friends: (value: { id: number }) => Users.getById(value.id).friends(),
        // }
    },
    update: {
        user: {
            icon: (value: { id: number, file: File }) => Users.setIcon(value.id, value.file)
        }
    },
    RootQuery
};

export const schema = new GraphQLSchema({
    types: [
        RootQuery,
        UserType,
        ServerType,
        ChannelType,
        MessageType,
        DateTimeType
    ],
    query: RootQuery,
    mutation: RootMutation
});
