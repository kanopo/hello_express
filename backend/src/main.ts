
import express, { Response, Request } from "express";
import { S3Client, ListObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import multer from "multer";
import cors from "cors"

import { fileRecord, insertRecord } from "./sqlQuery.js"


// this keep file to upload in memory and then send it in post req to s3
const upload = multer({ storage: multer.memoryStorage() })

upload.single("file")

const app = express();

app.use(cors())
const PORT = 3000;
const client = new S3Client({ region: "eu-north-1" });


const generateAB = () => {
  let dbIndex = crypto.randomUUID();
  let objectName = crypto.randomUUID();

  return [dbIndex, objectName]
}



app.get('/', (req: Request, res: Response) => {
  res.send("hello")
})

app.get('/listItems', async (req: Request, res: Response) => {
  const listParams = {
    Bucket: "dmitri-bucket",
  }
  let command = new ListObjectsCommand(listParams)
  try {
    const data = await client.send(command)
    console.log(data)
    res.send(data.Contents)
  } catch (error) {
    // TODO: error handling :/
  }
})

app.post('/item', upload.single("file"), async (req: Request, res: Response) => {

  let mimeType = req.file.mimetype;
  let buffer = req.file.buffer;
  // let originalName = req.file.originalname;

  let [dbIndex, objectName] = generateAB();
  const uploadParams = {
    Bucket: "dmitri-bucket",
    Body: buffer,
    Key: objectName,
    ContentType: mimeType

  }


  let fileRecord: fileRecord = {
    ID: dbIndex,
    s3Name: objectName
  }

  insertRecord(fileRecord)

  // TODO:
  // - ( ) connect to rds
  // - (x) create new user
  // - (x) create new table with main index Index and s3Name columns


  // console.log(uploadParams)
  // console.log("index", dbIndex)

  // const response = await client.send(new PutObjectCommand(uploadParams))
  //
  // console.log(response)
  //
  // res.sendStatus(response.$metadata.httpStatusCode)
  res.sendStatus(200)
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
