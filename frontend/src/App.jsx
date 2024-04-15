import { useState, useEffect } from "react";
import axios from "axios";
import "bulma/css/bulma.min.css";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [itemStates, setItemStates] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updatedDate, setUpdatedDate] = useState("");
  const [updatedImportant, setUpdatedImportant] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api");
      const initialStates = response.data.reduce((acc, item) => {
        acc[item.id] = {
          important: item.important,
          date: item.date,
          comment: item.comment,
        };
        return acc;
      }, {});
      setItemStates(initialStates);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleModifyButtonClick = (itemId) => {
    setSelectedItem(itemId);
    setUpdatedDate(itemStates[itemId]?.date || "");
    setUpdatedImportant(itemStates[itemId]?.important || false);
    setComment(itemStates[itemId]?.comment || "");
    setModalOpen(true);
  };

  const handleModalSubmit = async () => {
    try {
      if (selectedItem) {
        const newItemStates = { ...itemStates };
        newItemStates[selectedItem] = {
          important: updatedImportant,
          date: updatedDate,
          comment: comment,
        };
        setItemStates(newItemStates);
        await axios.patch("http://localhost:3000/api", {
          id: selectedItem,
          important: updatedImportant,
          date: updatedDate,
          comment: comment,
        });
        setModalOpen(false);
        setSelectedItem(null);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleUpdateList = async () => {
    try {
      const response = await axios.patch("http://localhost:3000/api/update");
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
            <th>Fecha</th>
            <th>ID</th>
            <th>Importante</th>
            <th>Comentarios</th>
            <th>Modificar</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ id, link }) => (
            <tr key={id}>
              <td>{itemStates[id]?.date || "-"}</td>
              <td>
                <a href={link}>{id}</a>
              </td>
              <td>{itemStates[id]?.important ? "Si" : "No"}</td>
              <td>{itemStates[id]?.comment || "-"}</td>
              <td>
                <button
                  className="button is-small is-primary"
                  onClick={() => handleModifyButtonClick(id)}
                >
                  Modificar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && (
        <div className="modal is-active">
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Modificar Clase</p>
              <button
                className="delete"
                aria-label="close"
                onClick={() => setModalOpen(false)}
              ></button>
            </header>
            <section className="modal-card-body">
              <div className="field">
                <label className="label">Fecha</label>
                <div className="control">
                  <input
                    className="input"
                    type="date"
                    value={updatedDate}
                    onChange={(e) => setUpdatedDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Importante</label>
                <div className="control">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={updatedImportant}
                      onChange={(e) => setUpdatedImportant(e.target.checked)}
                    />{" "}
                    Importante
                  </label>
                </div>
              </div>
              <div className="field">
                <label className="label">Comentarios</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-success" onClick={handleModalSubmit}>
                Enviar
              </button>
              <button className="button" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
