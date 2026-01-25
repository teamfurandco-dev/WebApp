export interface User {
  id: string;
  email: string;
  role?: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
  }
}
