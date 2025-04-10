# sol-did-cli

For usage:
```console
npm run --silent dev
```

Example of updating assertionMethod:
```console
npm run --silent dev -- --get-verification-method --path=../issuer/server/.env 

# Which gives you the id, send it through stdin, eg.
echo '["did:sol:devnet:7e3bAN1vRNL7c73awhtwJpXmun5YwhCQffieGoi8vdsb#default"]' | npm run --silent dev -- --set-assertion-method --path=../issuer/server/.env
```
