import { FastifyPluginAsync } from 'fastify'

export const root: FastifyPluginAsync = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return { root: true }
  })
}
