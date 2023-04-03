import { ChangeEvent, useEffect, useState } from 'react'

function App() {
  // const API_URL = "https://nodebackend.dmitri.sandbox.soluzionifutura.it";
  const API_URL = "http://localhost:3000";
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState<File>();
  const [s3File, setS3File] = useState(String);
  const [listFiles, setListFiles] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/listItems`, {
      method: "GET"
    })
      .then((res) => res.json())
      .then((data) => {
        setListFiles(data)
      })
      // .then(() => updateIdList())
      .catch((err) => console.error(err));


  }, [])

  const sendFile = (event: any) => {
    event.preventDefault();

    if (!file) {
      return
    } else {


      const data = new FormData();
      data.append(
        "file",
        file

      );


      fetch(`${API_URL}/item`, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
    }
  }

  const changeFile = (event: any) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }



  const getImage = (event: any) => {

    event.preventDefault();
    let buffer = fetch(`${API_URL}/getS3NameFromID/${fileName}`, {
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
        {listFiles.map((item: any) => (
          <li>{item.ID}</li>
        ))}
      </ul>

      <form>
        <input type="text" name="fileName" onChange={(event: any) => setFileName(event.target.value)} />
        <button onClick={getImage}>Get image</button>
      </form>



      <img id="imageFromS3" src={s3File} width="500" height="500" />
    </div>
  )
}

export default App
