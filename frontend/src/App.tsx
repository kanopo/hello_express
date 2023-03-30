import { ChangeEvent, useEffect, useState } from 'react'

function App() {
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState<File>();
  const [s3File, setS3File] = useState();
  const [listFiles, setListFiles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/listItems", {
      method: "GET"
    })
      .then((res) => res.json())
      .then((data) => {
        setListFiles(data)
      })
      .then(() => updateIdList())
      .catch((err) => console.error(err));


  }, [])

  const sendFile = (event) => {
    event.preventDefault();

    if (!file) {
      return
    } else {


      const data = new FormData();
      data.append(
        "file",
        file

      );


      fetch("http://localhost:3000/item", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
    }
  }

  const changeFile = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }



  const getImage = (event) => {

    event.preventDefault();
    let buffer = fetch(`http://localhost:3000/getS3NameFromID/${fileName}`, {
      method: "GET",
    }).then((responce) => {
      if (!responce.ok) {
        console.log("err")
      }
      return responce
    })
      .then((responce) => {
        return responce.blob()
      })
      .then((blob) => {
        setS3File(URL.createObjectURL(blob))
      })
  }

  return (
    <div>
      <form>
        <input type="file" name="file" onChange={changeFile} />
        <button onClick={sendFile}>Submit file</button>
      </form>


      <ul>
        {listFiles.map((item) => (
        <li>{item.ID}</li>
        ))}
      </ul>

      <form>
        <input type="text" name="fileName" onChange={(event) => setFileName(event.target.value)} />
        <button onClick={getImage}>Get image</button>
      </form>



      <img id="imageFromS3" src={s3File} width="500" height="500" />
    </div>
  )
}

export default App
