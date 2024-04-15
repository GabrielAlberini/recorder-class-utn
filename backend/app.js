import express from "express";
import cors from "cors";
import fs from "node:fs";
import dotenv from "dotenv";
dotenv.config();

const URL = process.env.URL;

const app = express();
app.use(express.json());
app.use(cors());

const readOriginalDb = async () => {
  const res = await fetch(URL, {});
  console.log(URL);
  const data = await res.json();
  return data;
};

const readMappedDb = () => {
  return JSON.parse(fs.readFileSync("./data/mappedClass.json"));
};

const writeDB = (list) => {
  fs.writeFileSync("./data/mappedClass.json", JSON.stringify(list));
};

app.patch("/api/update", async (req, res) => {
  const listOfClass = await readOriginalDb();
  const listModified = readMappedDb();

  const linksToRemove = listModified.filter(
    (item1) => !listOfClass.includes(item1.link)
  );

  // Eliminar los enlaces que no existen en listOfClass
  linksToRemove.forEach((item) => {
    const index = listModified.indexOf(item);
    if (index !== -1) {
      listModified.splice(index, 1);
    }
  });

  // Encontrar enlaces de listOfClass que no existen en listModified
  const newArray = listOfClass.filter(
    (link1) => !listModified.some((item2) => item2.link === link1)
  );

  // Agregar los enlaces que no existen en array2
  newArray.forEach((link) => {
    const id = link.split("meeting-")[1].split(".")[0]; // Extraer el ID del enlace
    listModified.push({
      id: id,
      link,
      important: false, // Otra propiedad que se desee agregar
      date: "", // Otra propiedad que se desee agregar
      comment: "",
    });
  });

  writeDB(listModified);
  res.json(listModified);
});

app.get("/api", (req, res) => {
  const list = readMappedDb();
  res.json(list);
});

app.patch("/api", (req, res) => {
  const { id, important, date, comment } = req.body;
  const list = readMappedDb();
  const classModify = list.find((c) => c.id === id);

  if (!classModify) {
    return res.status(404).json({ error: "Class not found" });
  }

  if (important !== undefined) {
    classModify.important = !!important; // Convert to boolean
  }

  if (date !== undefined) {
    classModify.date = date.length !== 0 ? date : "";
  }

  if (comment !== undefined) {
    classModify.comment = date.comment !== 0 ? comment : "";
  }

  writeDB(list);
  res.json(classModify);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto: http://localhost:${PORT}`);
});
