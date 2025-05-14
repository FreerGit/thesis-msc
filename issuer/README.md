# Issuer

The [server](/issuer/server/) has the back-end of the issuer, to run it, a `.env` fiel has to be placed in its directory with:
```console
WALLET_PRIVATE_KEY=0x718...
WALLET_PUBLIC_KEY=0x02b.....
```

Where both the private and public key are a Ethereum keypair, which can be created with the [ethers](https://www.npmjs.com/package/ethers) library.

To run the back-end and front-end, see the associated package.json for run commands.