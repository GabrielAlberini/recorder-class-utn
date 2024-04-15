const listOfClass = [
  "https://zoom-fepp.s3.amazonaws.com/81187921423/81187921423-meeting-85006af1-3b60-4697-94e5-0d88843566e4.mp4",
  "https://zoom-fepp.s3.amazonaws.com/81187921423/81187921423-meeting-df8b645f-7e0d-4b0f-8b87-f3b3ecb421da.mp4",
  "https://zoom-fepp.s3.amazonaws.com/81187921423/81187921423-meeting-f94e019c-e307-474c-a0ad-d24ba612a80c.mp4",
  "https://zoom-fepp.s3.amazonaws.com/81187921423/81187921423-meeting-f94e019c-e307-474c-a0ad-d24ba612a744.mp4",
];

const listModified = [
  {
    id: "85006af1-3b60-4697-94e5-0d88843566e4",
    link: "https://zoom-fepp.s3.amazonaws.com/81187921423/81187921423-meeting-85006af1-3b60-4697-94e5-0d88843566e4.mp4",
    important: false,
    date: "2024-03-15",
  },
  {
    id: "df8b645f-7e0d-4b0f-8b87-f3b3ecb421da",
    link: "https://zoom-fepp.s3.amazonaws.com/81187921423/81187921423-meeting-df8b645f-7e0d-4b0f-8b87-f3b3ecb421da.mp4",
    important: true,
    date: "lalal",
  },
  {
    id: "f94e019c-e307-474c-a0ad-d24ba612a80c",
    link: "https://zoom-fepp.s3.amazonaws.com/81187921423/81187921423-meeting-f94e019c-e307-474c-a0ad-d24ba612a80c.mp4",
    important: false,
    date: null,
  },
];

// Encontrar enlaces de listOfClass que no existen en array2
const newArray = listOfClass.filter(
  (link1) => !listModified.some((item2) => item2.link === link1)
);

// Agregar los enlaces que no existen en array2
newArray.forEach((link) => {
  const id = link.split("meeting-")[1].split(".")[0]; // Extraer el ID del enlace
  listModified.push({
    id: id,
    link: link,
    important: false, // Otra propiedad que se desee agregar
    date: null, // Otra propiedad que se desee agregar
  });
});

console.log(listModified);
