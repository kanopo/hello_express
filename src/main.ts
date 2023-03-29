
import express, {Response, Request} from "express";


const app = express();
const PORT = 3000;


app.get('', (req: Request, res: Response) => {
  res.send("hello")
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
