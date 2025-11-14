import { DataAPIClient } from "@datastax/astra-db-ts";


export const connection_db = (() => {
const {ASTRA_DB_ENDPOINT: endpoint, ASTRA_DB_TOKEN: token} = process.env;
  const client = new DataAPIClient()
  const database = client.db(endpoint!, {token})
  return database;
})