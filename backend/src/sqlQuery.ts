import mysql from "mysql";

export interface fileRecord {
  ID: string,
  s3Name: string
}

export const insertRecord = (fileRecord: fileRecord) => {
  // INSERT INTO node_app.files (ID, s3Name) VALUES ("ciao", "asdasd");
  let query = `INSERT INTO node_app.files (ID, s3Name) VALUES ("${fileRecord.ID}", "${fileRecord.s3Name}");`

  let connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "node",
    password: "password"
  });

  connection.connect((error) => {
    if (error) throw error;
    console.log("connected")

    connection.query(query, (error, result) => {
      if (error) throw error;

      console.log("Result: ", result);
    })

  })


}

export const getIDs = () => {
// SELECT ID FROM files;

}

export const getS3NameFromID = () => {
// SELECT ID FROM files WHERE ID = "6cd10cb6-68a7-4a9b-bbef-dca7a98b52e4";

}
