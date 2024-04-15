import { useState, useEffect } from "react";
import axios from "axios";
import "bulma/css/bulma.min.css";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [dateValues, setDateValues] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api");
      const initialStates = response.data.reduce(
        (acc, item) => {
          acc.checked[item.id] = item.important;
          acc.dates[item.id] = item.date;
          return acc;
        },
        { checked: {}, dates: {} }
      );
      setCheckedItems(initialStates.checked);
      setDateValues(initialStates.dates);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCheckedChange = async (itemId) => {
    try {
      const newImportantState = !checkedItems[itemId];
      setCheckedItems((prev) => ({ ...prev, [itemId]: newImportantState }));
      console.log(newImportantState);
      await axios.patch("http://localhost:3000/api", {
        id: itemId,
        important: newImportantState,
      });
    } catch (error) {
      console.error("Error updating important state:", error);
    }
  };

  const handleDateChange = async (itemId, newDate) => {
    try {
      setDateValues((prev) => ({ ...prev, [itemId]: newDate }));
      await axios.patch("http://localhost:3000/api", {
        id: itemId,
        date: newDate,
      });
    } catch (error) {
      console.error("Error updating date:", error);
    }
  };

  const handleUpdateList = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/update");
      setData(response.data);
    } catch (error) {
      console.error("Error updating date:", error);
    }
  };

  return (
    <div className="container is-paddingless p-4">
      <div className="title-button-container pb-6">
        <h1 className="title is-6 m-0">
          Lista de Clases - Diplomatura Fullstack - Lunes y miércoles 19 a 22
        </h1>
        <button
          className="button is-primary is-light"
          onClick={handleUpdateList}
        >
          Actualizar lista
        </button>
      </div>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>Link</th>
            <th style={{ width: "20%" }}>Link válido</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ id, link }) => (
            <tr key={id}>
              <td>
                <a href={link}>{link}</a>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={checkedItems[id]}
                  onChange={() => handleCheckedChange(id)}
                  className="checkbox"
                />
              </td>
              <td>
                <input
                  type="date"
                  value={dateValues[id]}
                  onChange={(e) => handleDateChange(id, e.target.value)}
                  className="date-input"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
