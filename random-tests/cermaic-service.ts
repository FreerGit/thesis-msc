import { CeramicClient } from '@ceramicnetwork/http-client'
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'

export class CeramicService {
  private ceramic: CeramicClient

  constructor() {
    this.ceramic = new CeramicClient('http://localhost:7007')
  }

  async createOrganizationDID(orgName: string, adminKey: string) {
    // Create organization DID
    const provider = new Ed25519Provider(adminKey)
    const did = new DID({ provider, resolver: getResolver() })
    await did.authenticate()

    // Create DID document with organization info
    const stream = await this.ceramic.createStream('tile', {
      metadata: {
        schema: null,
        family: 'organization',
      },
      content: {
        name: orgName,
        type: 'organization',
        createdAt: new Date().toISOString(),
        admins: [did.id],
      }
    })

    return stream.id.toString()
  }

  async createUserDID(orgDID: string, userData: any) {
    // Create user DID linked to organization
    const stream = await this.ceramic.createStream('tile', {
      metadata: {
        schema: null,
        family: 'user',
      },
      content: {
        ...userData,
        organizationDID: orgDID,
        type: 'user',
        createdAt: new Date().toISOString(),
      }
    })

    return stream.id.toString()
  }

  async verifyDID(did: string) {
    try {
      const stream = await this.ceramic.loadStream(did)
      return stream.state.isValid
    } catch (error) {
      return false
    }
  }
}