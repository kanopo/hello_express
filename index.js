import express from "express"
import secrets from "secrets"
import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3"

const app = express()
const port = 3000


var bucketParams = {
  Bucket: 'dmitri-bucket',
};

let command = new ListObjectsCommand(bucketParams)
console.log(command)

app.get('/', (req, res) => {
  res.send(process.env.ACCESS_KEY)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
