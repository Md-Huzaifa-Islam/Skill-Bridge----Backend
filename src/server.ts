import app from "./app";
import { config } from "./config/config";

const port = config.port;

app.listen(port, () => {
  console.log(`skill bridge app listening on port ${port}`);
});
