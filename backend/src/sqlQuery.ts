import mysql from "mysql2";

export interface fileRecord {
  ID: string,
  s3Name: string
}

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "node",
  password: "password"
}).promise()

export const insertRecord = async (fileRecord: fileRecord) => {

  const [results] = await pool.query(`INSERT INTO node_app.files (ID, s3Name) VALUES (?, ?)`, [fileRecord.ID, fileRecord.s3Name])

  return results;


}

export const getIDs = async () => {

  const [rows] = await pool.query("SELECT ID FROM node_app.files;")
  return rows;



}

export const getS3NameFromID = async (id: string) => {

  const [rows] = await pool.query(`SELECT s3Name FROM node_app.files WHERE ID = ?`, [id])
  return rows


}
