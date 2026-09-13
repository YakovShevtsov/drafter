import express from "express";

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Draft helper backend is alive!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
