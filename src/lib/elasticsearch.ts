import { Client } from '@elastic/elasticsearch'

const ELASTICSEARCH_NODE = process.env.ELASTICSEARCH_NODE || 'http://localhost:9200'

// Create client configuration
const clientConfig: any = {
  node: ELASTICSEARCH_NODE,
  requestTimeout: 30000,
  tls: {
    rejectUnauthorized: false
  }
}

// Add auth if credentials are provided
if (process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD) {
  clientConfig.auth = {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
  }
}

export const client = new Client(clientConfig)