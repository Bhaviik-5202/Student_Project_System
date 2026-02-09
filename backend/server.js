const express = require("express");
const app = express();
const recordsRouter = require("./routes/records");

app.use(express.json());
app.use("/records", recordsRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
