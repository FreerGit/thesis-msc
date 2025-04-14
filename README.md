# Thesis - Decentralized Identifiers (DIDs)
Lorum ipsum etc

## ./scripts
Simple jobs such as submitting a DID document to solana devnet and updating it, see [README.md](./scripts/README.md)


## Current DIDs
issuer sol: did:sol:devnet:7e3bAN1vRNL7c73awhtwJpXmun5YwhCQffieGoi8vdsb
issuer eth: did:ethr:sepolia:0x9Cf4710D6D53f8E6B579e9EF766eE8E39E03E96F

wallet: did:sol:devnet:E13rUS8is8BU2J7KYnnti4rrmZ6hFCKW6JF9F33QCKhT

## Considerations / Future work / TODOs
**Issue:** 
A issuer may use many variations of suites (Ed25519-2018, Ed25519-2020, jws-2020, x25519-2019, and so on..), currently we use one suite over the entire architecture. How should one handle N suites?

**Issue:**
Currently the Issuer uses the same keypair for the Solana account (DID) and for the signature itself for VCs. They should ideally be seperate, both for generality but also for the ability to do key rotations and key revocation.


## Remarks for Thesis
what key signature type do we use now for ethr, EcdsaSecp256k1RecoveryMethod2020, JwtProof2020, what else?

Write about JWTs

Write about sepolia

Change from did:sol to did:ethr, explain why.

bring up that did:sol sucks ass, all the problems we have faced with did methods

write about the ethereum blockchain

Zero knowledge proofs / Selective disclosure (EU wallet has this)

## TODOs

[x] Issuer did created -> did:ethr:sepolia:0x9Cf4710D6D53f8E6B579e9EF766eE8E39E03E96F
[x] Integrate issuer did into issuer server
[x] recieve a issued VC into wallet
[ ] create a VP from said VC
