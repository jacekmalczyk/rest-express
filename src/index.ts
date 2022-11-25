import express from 'express'
import logger from './middlewares/logger';
import router from "./routes/routes";
import {errorResponder} from "./middlewares/errorHandlers";

const cors = require('cors')

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api", router);

app.use(errorResponder)

app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)
