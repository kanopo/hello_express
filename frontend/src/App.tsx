import { ChangeEvent, useState } from 'react'

function App() {
  const [file, setFile] = useState<File>();

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

  return (
    <div>
      <form>
        <input type="file" name="file" onChange={changeFile} />
        <button onClick={sendFile}>Submit file</button>
      </form>
    </div>
  )
}

export default App
