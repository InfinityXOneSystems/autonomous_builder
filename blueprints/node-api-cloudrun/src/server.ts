import express from "express";

const app = express();
app.use(express.json());

app.get("/healthz", (_req, res) => res.status(200).send("ok"));
app.get("/readyz", (_req, res) => res.status(200).send("ready"));

app.get("/api/info", (_req, res) => {
  res.json({ name: "node-api-cloudrun", status: "ok" });
});

const port = Number(process.env.PORT || 8080);
app.listen(port, () => console.log(`Listening on ${port}`));
