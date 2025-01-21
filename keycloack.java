// First, we create a custom Keycloak authentication provider for DIDs

package org.example.keycloak.did;

import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.Authenticator;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

public class DIDAuthenticator implements Authenticator {
    private final CeramicClient ceramicClient;

    public DIDAuthenticator(KeycloakSession session) {
        // Initialize Ceramic client
        this.ceramicClient = new CeramicClient("http://localhost:7007");
    }

    @Override
    public void authenticate(AuthenticationFlowContext context) {
        // Get DID from the authentication request
        String did = context.getHttpRequest().getDecodedFormParameters()
            .getFirst("did");
        
        // Verify DID signature
        if (verifyDIDSignature(did)) {
            // Check if user exists in Keycloak
            UserModel user = findOrCreateUser(context.getSession(), 
                                           context.getRealm(), 
                                           did);
            
            // Associate user with their organization (tenant)
            String orgId = getOrganizationFromDID(did);
            user.setSingleAttribute("organizationId", orgId);
            
            context.setUser(user);
            context.success();
        } else {
            context.failure(AuthenticationFlowError.INVALID_CREDENTIALS);
        }
    }

    private boolean verifyDIDSignature(String did) {
        // Verify DID signature using Ceramic
        try {
            // Get DID document from Ceramic
            StreamID streamId = StreamID.fromString(did);
            Stream stream = ceramicClient.loadStream(streamId);
            
            // Verify signature
            return ceramicClient.verifySignature(stream);
        } catch (Exception e) {
            return false;
        }
    }

    private String getOrganizationFromDID(String did) {
        // Fetch organization info from Ceramic DID document
        try {
            StreamID streamId = StreamID.fromString(did);
            Stream stream = ceramicClient.loadStream(streamId);
            Map<String, Object> content = stream.getContent();
            return (String) content.get("organizationId");
        } catch (Exception e) {
            return null;
        }
    }
}