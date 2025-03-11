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

Our public gateway (CID to this README, earlier version)
```console
http://20.93.117.199:8080/ipfs/QmVoPdencj5vS79zetgiDcUsTbktTdrQWoHL9V1N87oLCU
```

ssh into vm, Fredriks laptop
```console
ssh -i ~/.ssh/ipfs.pem azureuser@20.93.117.199
```