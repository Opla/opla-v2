import Express from "express";
import path from "path";

const app = Express();
const directory = "/public/";
app.use(Express.static(path.join(__dirname, directory)));
const PORT = process.env.PORT || 3000;
app.get("*", (request, response) => { response.sendFile(path.resolve(__dirname, "public", "index.html")); });

app.listen(PORT);
