import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import axios from "axios";
import UserService from "../services/UserService";

export function newUserLoader() {
  return { user: null };
}

export async function userLoader({ params }) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${process.env.REACT_APP_SERVER_URL}/users/${params.userId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return { user: response.data };
}

function UserEdit() {
  const { user } = useLoaderData();
  const isNew = user === null;
  const navigate = useNavigate();

  const [name, setName] = useState(isNew ? "" : user.name);
  const [email, setEmail] = useState(isNew ? "" : user.email);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isNew) {
        await UserService.create({ name, email });
      } else {
        await UserService.update(user.id, { name, email });
      }
      navigate("/users");
    } catch {
      setError("Erro ao salvar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>{isNew ? "Novo Usuário" : "Editar Usuário"}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </button>
          <button type="button" onClick={() => navigate("/users")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserEdit;
