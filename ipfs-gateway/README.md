# IPFS gateway

To start the gateway
```console
docker-compose up -d
```

to add and pin a document
```console
touch your-file.txt
docker cp skibidy.txt ipfs-node:/tmp/
docker exec ipfs-node ipfs add /tmp/your-file.txt
docker exec ipfs-node ipfs pin add <CID>
docker exec ipfs-node ipfs cat <CID>
```

