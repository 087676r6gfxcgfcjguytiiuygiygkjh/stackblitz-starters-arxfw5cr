"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";
import { format } from "date-fns";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Trash2,
  Pencil,
  Save,
  X
} from "lucide-react";

import Header from "../components/Header"; // ✅ Importação do Header

export default function Painel() {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    verificarSessao();
  }, []);

  async function verificarSessao() {
    const { data, error } = await supabase.auth.getSession();
    if (!data.session) {
      router.push("/login");
    } else {
      buscarAgendamentos();
    }
  }

  async function buscarAgendamentos() {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("nome", { ascending: true });

    if (!error && data) {
      setAgendamentos(data);
    }

    setCarregando(false);
  }

  async function excluirAgendamento(id: string) {
    if (!confirm("Tem certeza que deseja excluir este agendamento?")) return;

    await supabase.from("appointments").delete().eq("id", id);
    buscarAgendamentos();
  }

  function iniciarEdicao(agendamento: any) {
    setEditandoId(agendamento.id);
    setEditData(agendamento);
  }

  async function salvarEdicao() {
    await supabase.from("appointments").update(editData).eq("id", editandoId);
    setEditandoId(null);
    buscarAgendamentos();
  }

  const agendamentosFiltrados = agendamentos.filter((a) =>
    a.nome.toLowerCase().includes(busca.toLowerCase())
  );

  if (carregando) {
    return (
      <div className="p-6 text-center text-gray-600">Carregando painel...</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Header /> {/* ✅ Inclusão do Header aqui */}

      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Painel de Agendamentos</h1>

        <input
          type="text"
          placeholder="Buscar por nome"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full p-2 border rounded-md text-gray-900"
        />

        {agendamentosFiltrados.map((item) => (
          <div
            key={item.id}
            className="bg-gray-100 text-gray-800 p-4 rounded mb-4 shadow flex justify-between items-start"
          >
            {editandoId === item.id ? (
              <div className="w-full space-y-2">
                <input
                  type="text"
                  value={editData.nome}
                  onChange={(e) =>
                    setEditData({ ...editData, nome: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  value={editData.telefone}
                  onChange={(e) =>
                    setEditData({ ...editData, telefone: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
                <input
                  type="date"
                  value={editData.data}
                  onChange={(e) =>
                    setEditData({ ...editData, data: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
                <input
                  type="time"
                  value={editData.hora}
                  onChange={(e) =>
                    setEditData({ ...editData, hora: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={salvarEdicao}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    <Save size={16} /> Salvar
                  </button>
                  <button
                    onClick={() => setEditandoId(null)}
                    className="flex items-center gap-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                  >
                    <X size={16} /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="flex items-center gap-2">
                  <User size={16} className="text-blue-600" />
                  <strong>Nome:</strong> {item.nome}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-green-600" />
                  <strong>Telefone:</strong> {item.telefone}
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-purple-600" />
                  <strong>Email:</strong> {item.email}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar size={16} className="text-pink-600" />
                  <strong>Data:</strong>{" "}
                  {item.data && !isNaN(new Date(item.data).getTime())
                    ? format(new Date(item.data), "dd/MM/yyyy")
                    : "Data inválida"}
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={16} className="text-yellow-600" />
                  <strong>Hora:</strong> {item.hora}
                </p>
              </div>
            )}

            {editandoId !== item.id && (
              <div className="flex flex-col gap-2 ml-4">
                <button
                  onClick={() => iniciarEdicao(item)}
                  className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  <Pencil size={16} /> Editar
                </button>
                <button
                  onClick={() => excluirAgendamento(item.id)}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  <Trash2 size={16} /> Excluir
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

