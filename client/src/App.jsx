import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const api = axios.create({
    baseURL: "http://localhost:3000/",
    timeout: 1000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // nombre, motivo, estado
  const [nombrePaciente, setNombre] = useState("");
  const [motivo, setMotivo] = useState("");
  const [estado, setEstado] = useState("");
  const [citas, setCitas] = useState([]);
  const [citaId, setCitaId] = useState();

  const cargarCitas = async () => {
    try {
      const citasApi = (await api.get("/cita")).data;
      setCitas(citasApi);
    } catch (error) {}
  };

  useEffect(() => {
    cargarCitas();
  }, [citas]);

  const guadarCita = async (e) => {
    if (citaId) {
      await api.patch(`/cita/${citaId}`, { nombrePaciente, motivo, estado });
    } else {
      await api
        .post("/cita", {
          nombrePaciente: nombrePaciente,
          motivo: motivo,
        })
        .then((response) => console.log(response));
    }
    setNombre("");
    setEstado("");
    setMotivo("");
    setCitaId();
  };

  const borrarCita = async (id) => {
    await api.delete(`/cita/${id}`);
  };

  const cargarCita = async (id) => {
    const cita = (await api.get(`/cita/${id}`)).data;
    setNombre(cita.nombrePaciente);
    setEstado(cita.estado);
    setMotivo(cita.motivo);
    setCitaId(id);
  };

  return (
    <>
      <label>Nombre: </label>
      <input
        placeholder="Nombre"
        value={nombrePaciente}
        onChange={(e) => setNombre(e.target.value)}
      />
      <br />
      <label>Motivo: </label>
      <input
        placeholder="Motivo"
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
      />
      <br />

      <label>Estado: </label>
      <select
        name="estado"
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
      >
        <option value="">Elija una opcion</option>
        <option value="espera">Espera</option>
        <option value="admitido">Admitido</option>
        <option value="finalizado">Finalizado</option>
        <option value="cancelado">Cancelado</option>
      </select>

      <input type="submit" value="Guardar" onClick={(e) => guadarCita(e)} />

      <table>
        <thead>
          <tr>
            <th>Nombre Paciente</th>
            <th>Estado</th>
            <th>Motivo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita) => (
            <tr key={cita.id}>
              <td>{cita.nombrePaciente}</td>
              <td>{cita.estado}</td>
              <td>{cita.motivo}</td>
              <td>
                <input
                  type="button"
                  value="editar"
                  onClick={() => cargarCita(cita.id)}
                />
                <input
                  type="button"
                  value="eliminar"
                  onClick={() => borrarCita(cita.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
