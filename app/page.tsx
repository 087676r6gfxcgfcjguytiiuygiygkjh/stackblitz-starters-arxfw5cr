"use client";

import { useState } from "react";
import { supabase } from './supabaseClient';
import Header from "./components/Header";

export default function Home() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [confirmado, setConfirmado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: insertData, error } = await supabase.from("appointments").insert([
      {
        nome,
        telefone,
        email,
        date: data,
        time: hora,
      },
    ]);

    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      setConfirmado(true);
    }
  };

  return (
    <>
      <Header />

      <main className="flex min-h-screen items-center justify-center p-4 bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Agende seu horário</h1>

          {confirmado ? (
            <div className="text-center space-y-2">
              <p className="text-green-600 text-xl font-semibold">✅ Agendamento confirmado!</p>
              <p className="text-sm text-gray-500">Enviaremos um e-mail com os detalhes.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-3 text-gray-900"
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
                className="w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-3 text-gray-900"
              />
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-3 text-gray-900"
              />
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
                className="w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-3 text-gray-900"
              />
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
                className="w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-3 text-gray-900"
              />

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 px-6 rounded-lg w-full"
              >
                Confirmar Agendamento
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
