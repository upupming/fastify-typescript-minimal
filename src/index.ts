import fastify from 'fastify'
import { Static, Type } from '@sinclair/typebox'

interface IQuerystring {
  username: string;
  password: string;
}

interface IHeaders {
  'h-Custom': string;
}

interface IReply {
  200: { success: boolean };
  302: { url: string };
  '4xx': { error: string };
}

const server = fastify()

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

server.get<{
  Querystring: IQuerystring,
  Headers: IHeaders,
  Reply: IReply | string
}>('/auth', {
  preValidation: (request, reply, done) => {
    const { username, password } = request.query
    done(username !== 'admin' ? new Error('Must be admin') : undefined) // only validate `admin` account
  }
}, async (request, reply) => {
  const customerHeader = request.headers['h-Custom']
  // do something with request data

  // chaining .statusCode/.code calls with .send allows type narrowing. For example:
  // this works
  // reply.code(200).send({ success: true });
  // // but this gives a type error
  // reply.code(200).send('uh-oh');
  // it even works for wildcards
  // reply.code(404).send({ error: 'Not found' });

  return `logged in!`
})


export const User = Type.Object({
  name: Type.String(),
  mail: Type.Optional(Type.String({ format: 'email' })),
})

export type UserType = Static<typeof User>

server.post<{ Body: UserType, Reply: UserType }>(
  '/',
  {
    schema: {
      body: User,
      response: {
        200: User
      },
    },
  },
  (request, reply) => {
    // The `name` and `mail` types are automatically inferred
    const { name, mail } = request.body;
    reply.status(200).send({ name, mail });
  }
)

const todo = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    done: { type: 'boolean' },
  },
  required: ['name'],
} as const; // don't forget to use const !

import { FromSchema } from "json-schema-to-ts";
server.post<{ Body: FromSchema<typeof todo> }>(
  '/todo',
  {
    schema: {
      body: todo,
      response: {
        201: {
          type: 'string',
        },
      },
    }
  },
  async (request, reply): Promise<void> => {

    /*
    request.body has type
    {
      [x: string]: unknown;
      description?: string;
      done?: boolean;
      name: string;
    }
    */

    request.body.name // will not throw type error
    request.body.notthere // will throw type error

    reply.status(201).send();
  },
);

import * as plugins from './plugins'
Object.values(plugins).forEach((plugin) => {
  server.register(plugin)
})
import * as routes from './routes'
Object.values(routes).forEach((route) => {
  server.register(route)
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
