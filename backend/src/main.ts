import express, { Response, Request } from "express";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import crypto from "crypto";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import { createPool } from "mysql2/promise";

dotenv.config();

interface fileRecord {
  ID: string,
  s3Name: string
}

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_USER
})

const insertRecord = async (fileRecord: fileRecord) => {

  const [results] = await pool.query(`INSERT INTO node_app.files (ID, s3Name) VALUES (?, ?)`, [fileRecord.ID, fileRecord.s3Name])

  return results;


}

const getIDs = async () => {

  const [rows] = await pool.query("SELECT ID FROM node_app.files;")
  return rows;



}

const getS3NameFromID = async (id: string) => {

  const [rows] = await pool.query(`SELECT s3Name FROM node_app.files WHERE ID = ?`, [id])
  return rows


}


// this keep file to upload in memory and then send it in post req to s3
const upload = multer({ storage: multer.memoryStorage() });

upload.single("file");

const app = express();

const corsOptions = {
  origin: `${process.env.WEBSITE_URL}`
}
app.use(cors(corsOptions));
const PORT = process.env.PORT;
const client = new S3Client({ region: "eu-north-1" });

const generateAB = () => {
  let dbIndex = crypto.randomUUID();
  let objectName = crypto.randomUUID();

  return [dbIndex, objectName];
};

app.get("/listItems", async (req: Request, res: Response) => {
  let ids = await getIDs();
  res.send(ids);
});

app.get("/getS3NameFromID/:id", async (req: Request, res: Response) => {
  let id = req.params.id;
  let rows = await getS3NameFromID(id);

  const getParams = {
    Bucket: "dmitri-bucket",
    Key: rows[0].s3Name,
  };

  try {
    const response: any = await client.send(new GetObjectCommand(getParams));

    let buffer = Buffer.concat(await response.Body.toArray());

    res.send(buffer);

    // res.sendStatus(response.$metadata.httpStatusCode)
  } catch (err) {
    console.log(err);
  }
});

app.get("/getS3Item/:objectName", async (req: Request, res: Response) => {
  const getParams = {
    Bucket: "dmitri-bucket",
    Key: req.params.objectName,
  };

  try {
    const response: any = await client.send(new GetObjectCommand(getParams));

    let buffer = Buffer.concat(await response.Body.toArray());

    res.send(buffer);

    // res.sendStatus(response.$metadata.httpStatusCode)
  } catch (err) {
    console.log(err);
  }
});

app.post(
  "/item",
  upload.single("file"),
  async (req: any, res: Response) => {
    let mimeType = req.file.mimetype;
    let buffer = req.file.buffer;
    // let originalName = req.file.originalname;

    let [dbIndex, objectName] = generateAB();
    const uploadParams = {
      Bucket: "dmitri-bucket",
      Body: buffer,
      Key: objectName,
      ContentType: mimeType,
    };

    let fileRecord: fileRecord = {
      ID: dbIndex,
      s3Name: objectName,
    };

    let results = await insertRecord(fileRecord);

    const response = await client.send(new PutObjectCommand(uploadParams));

    res.sendStatus(response.$metadata.httpStatusCode);
  }
);


app.listen(PORT, () => {
  console.log("Starting server");
  console.log(`Listening on port ${PORT}`);
});
