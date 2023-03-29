
import express, { Response, Request } from "express";
import { S3Client, ListObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";


const app = express();
const PORT = 3000;
const client = new S3Client({ region: "eu-north-1" });

const get_params = {
  Bucket: "dmitri-bucket",
}

// let image_buff: ArrayBuffer = new ArrayBuffer();
// let image_name = fs.createWriteStream("~/Pictures/wallpapers/patrick.jpg").write(image_buff)
// const put_params = {
//   Bucket: "dmitri-bucket",
//   Key: "asdasd.png",
//   Body: image_buff,
// }


app.get('/', (req: Request, res: Response) => {
  res.send("hello")
})

app.get('/getAll', async (req: Request, res: Response) => {
  let command = new ListObjectsCommand(get_params)
  try {
    const data = await client.send(command)
    console.log(data)
    res.send(data.Contents)
  } catch (error) {
    // TODO: error handling :/
  }
})


// TODO:
// - post data
// - create ids


// app.get('/putOne', async (req: Request, res: Response) => {
//   let command = new PutObjectCommand(put_params)
//   try {
//     const data = await client.send(command)
//     console.log(data)
//     res.send(200)
//   } catch (error) {
//     // TODO: error handling :/
//   }
// })

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
