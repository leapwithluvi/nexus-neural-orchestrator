import { getRequestListener } from '@hono/node-server'
import app from '../src/index.js'

declare const process: any;

export const config = {
  api: {
    bodyParser: false,
  },
}

export default getRequestListener(app.fetch)
