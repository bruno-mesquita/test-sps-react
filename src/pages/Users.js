import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import { useAuth } from "../context/AuthContext";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    UserService.list()
      .then((res) => setUsers(res.data))
      .catch(() => setError("Falha ao carregar usuários."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja excluir este usuário?")) return;
    try {
      await UserService.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Erro ao excluir usuário.");
    }
  };

  return (
    <div>
      <h1>Usuários</h1>
      <div>
        <button onClick={() => navigate("/users/new")}>Novo Usuário</button>
        <button onClick={signOut}>Sair</button>
      </div>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} — {user.email}
            {" "}
            <Link to={`/users/${user.id}`}>Editar</Link>
            {" "}
            <button onClick={() => handleDelete(user.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
