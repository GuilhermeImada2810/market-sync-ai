import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export function Login() {
  const { loginGoogle } = useAuth();

  const navigate = useNavigate();

  async function handleLogin() {
    await loginGoogle();

    navigate("/dashboard");
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="bg-zinc-900 p-10 rounded-2xl shadow-xl text-center">
        <h1 className="text-3xl text-purple-500 font-bold mb-6">
          Market Sync AI
        </h1>

        <button
          onClick={handleLogin}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl text-white font-semibold transition"
        >
          Entrar com Google
        </button>
      </div>
    </div>
  );
}