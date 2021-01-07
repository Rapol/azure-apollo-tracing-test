const { ApolloServer } = require('apollo-server-azure-functions');
const { ApolloGateway } = require('@apollo/gateway');

const createHandler = async ({ logger }) => {
    const gateway = new ApolloGateway({
        serviceList: [
            { name: 'bookService', url: 'http://localhost:7071/api/bookService'},
        ],
        debug: true,
        logger,
    });
    const { schema, executor } = await gateway.load();
    const server = new ApolloServer({
        schema,
        executor,
        tracing: true,
        debug: true,
        introspection: true,
        playground: true,
        logger,
    });

    return server.createHandler({
        cors: {
            origin: '*',
            credentials: true,
            methods: 'GET, POST',
            allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
            exposedHeaders: '*',
        },
    });
};

let cachedApolloHandler = null;

exports.graphqlHandler = (context, request) => {
    const logger = {
        debug: context.log.verbose,
        info: context.log.info,
        warn: context.log.warn,
        error: context.log.error,
    };
    // if cachedApolloHandler is null, this means there was an error before,
    // lets retry creating the apollo server
    if (!cachedApolloHandler) {
        cachedApolloHandler = createHandler({ logger });
    }
    cachedApolloHandler
        .then((handler) => handler(context, request))
        .catch((err) => {
            // if it failed, set cachedApolloHandler to null so that next request will try to recreate it
            cachedApolloHandler = null;
            // return a 500 error instead of hanging
            return context.done(err);
        });
};
