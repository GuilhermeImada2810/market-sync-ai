import { FcGoogle } from "react-icons/fc";

import { useAuth } from "../../context/AuthContext";

import { useNavigate } from "react-router-dom";

export function Login() {
  const { signInWithGoogle } = useAuth();

  const navigate = useNavigate();

  async function handleLogin() {
    await signInWithGoogle();

    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-zinc-900 p-10 rounded-2xl border border-zinc-800 w-full max-w-md">
        <h1 className="text-4xl font-bold text-purple-500 mb-4 text-center">
          Market Sync AI
        </h1>

        <p className="text-zinc-400 text-center mb-8">
          Entre com sua conta Google
        </p>

        <button
          onClick={handleLogin}
          className="w-full bg-white text-black font-semibold py-3 rounded-xl flex items-center justify-center gap-3 hover:opacity-90 transition"
        >
          <FcGoogle size={24} />

          Entrar com Google
        </button>
      </div>
    </div>
  );
}