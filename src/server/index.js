/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the GPL v2.0+ license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Express from "express";
import path from "path";

const app = Express();
const directory = "/public/";
app.use(Express.static(path.join(__dirname, directory)));
const PORT = process.env.PORT || 3000;
app.get("*", (request, response) => { response.sendFile(path.resolve(__dirname, "public", "index.html")); });

app.listen(PORT);
