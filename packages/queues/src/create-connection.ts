import { envConfig } from "./config"

export const createConnection = () => {
  return { url: envConfig.REDIS_URI }
}