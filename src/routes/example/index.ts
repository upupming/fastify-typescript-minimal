import { FastifyPluginAsync } from 'fastify'
export const example: FastifyPluginAsync =  async function (fastify, opts) {
  fastify.get('/example', async function (request, reply) {
    return 'this is an example'
  })
}
