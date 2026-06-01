import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../services/firebase";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useAuth } from "../../context/AuthContext";

export function Dashboard() {
  const { user } = useAuth();

  const [products, setProducts] = useState<
    any[]
  >([]);

  async function loadProducts() {
    if (!user) return;

    const q = query(
      collection(db, "financial_products"),
      where("userId", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);

    const list: any[] = [];

    querySnapshot.forEach((docItem) => {
      list.push({
        id: docItem.id,
        ...docItem.data(),
      });
    });

    setProducts(list);
  }

  useEffect(() => {
    loadProducts();
  }, [user]);

  const totalProducts = products.length;

  const totalProfit = products.reduce(
    (acc, item) =>
      acc +
      (Number(item.salePrice || 0) -
        Number(item.productCost || 0)),
    0
  );

  const averageMargin =
    products.length > 0
      ? (
          products.reduce(
            (acc, item) =>
              acc +
              Number(item.margin || 0),
            0
          ) / products.length
        ).toFixed(1)
      : 0;

  const lowMarginProducts =
    products.filter(
      (item) => Number(item.margin) < 10
    ).length;

  const chartData = products.map((item) => ({
    name: item.productName,
    lucro:
      Number(item.salePrice || 0) -
      Number(item.productCost || 0),
  }));

  const pieData = [
    {
      name: "Margem Boa",
      value: products.filter(
        (item) => Number(item.margin) >= 20
      ).length,
    },

    {
      name: "Margem Média",
      value: products.filter(
        (item) =>
          Number(item.margin) >= 10 &&
          Number(item.margin) < 20
      ).length,
    },

    {
      name: "Margem Ruim",
      value: products.filter(
        (item) => Number(item.margin) < 10
      ).length,
    },
  ];

  const COLORS = [
    "#22c55e",
    "#eab308",
    "#ef4444",
  ];

  return (
    <div className="bg-black min-h-screen text-white p-10">

      {/* TOPO */}
      <div className="mb-10">

        <h1 className="text-5xl font-bold text-purple-500">
          Dashboard IA
        </h1>

        <p className="text-zinc-400 mt-2">
          Controle inteligente do ecommerce
        </p>

        {user && (
          <div className="mt-4 flex items-center gap-3">

            <img
              src={user.photoURL}
              alt="Foto usuário"
              className="w-12 h-12 rounded-full border-2 border-purple-500"
            />

            <div>
              <p className="font-bold text-lg">
                {user.displayName}
              </p>

              <p className="text-zinc-400 text-sm">
                {user.email}
              </p>
            </div>

          </div>
        )}

      </div>

      {/* BOTÕES */}
      <div className="flex flex-wrap gap-4 mb-10">

        <a
          href="/products"
          className="bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-xl font-bold text-white"
        >
          Produtos
        </a>

        <a
          href="/finance"
          className="bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-xl font-bold text-white"
        >
          Financeiro
        </a>

      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

          <h2 className="text-zinc-400">
            Produtos
          </h2>

          <p className="text-4xl font-bold text-purple-400 mt-3">
            {totalProducts}
          </p>

        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

          <h2 className="text-zinc-400">
            Lucro Total
          </h2>

          <p className="text-4xl font-bold text-green-400 mt-3">
            R$ {totalProfit.toFixed(2)}
          </p>

        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

          <h2 className="text-zinc-400">
            Margem Média
          </h2>

          <p className="text-4xl font-bold text-blue-400 mt-3">
            {averageMargin}%
          </p>

        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

          <h2 className="text-zinc-400">
            Produtos Ruins
          </h2>

          <p className="text-4xl font-bold text-red-400 mt-3">
            {lowMarginProducts}
          </p>

        </div>

      </div>

      {/* GRÁFICO */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-10">

        <h2 className="text-3xl font-bold text-purple-500 mb-8">
          Lucro por Produto
        </h2>

        <div className="w-full h-96">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart data={chartData}>

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="lucro"
                radius={[10, 10, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* PIZZA */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

        <h2 className="text-3xl font-bold text-green-500 mb-8">
          Saúde Financeira
        </h2>

        <div className="w-full h-96">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <PieChart>

              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={140}
                dataKey="value"
                label
              >

                {pieData.map(
                  (entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index % COLORS.length
                        ]
                      }
                    />
                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}