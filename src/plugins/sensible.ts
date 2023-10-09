import fp from 'fastify-plugin'

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export const sensible = fp(async function (fastify, opts) {
  fastify.register(require('fastify-sensible'), {
    errorHandler: false
  })
})
