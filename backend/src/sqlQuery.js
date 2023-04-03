import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

export interface fileRecord {
  ID: string,
  s3Name: string
}

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_USER
})

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
