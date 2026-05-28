import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  LayoutDashboard,
  Package,
  DollarSign,
  BarChart3,
} from "lucide-react";

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

import { db } from "../../services/firebase";

interface ProductProps {
  id: string;
  name: string;
  price: string;
  category: string;
}

export function Dashboard() {
  const [products, setProducts] = useState<ProductProps[]>([]);

  async function loadProducts() {
    const querySnapshot = await getDocs(
      collection(db, "products")
    );

    const productsList: ProductProps[] = [];

    querySnapshot.forEach((docItem) => {
      productsList.push({
        id: docItem.id,
        name: docItem.data().name,
        price: docItem.data().price,
        category:
          docItem.data().category || "Sem categoria",
      });
    });

    setProducts(productsList);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const totalProducts = products.length;

  const totalRevenue = products.reduce(
    (acc, product) =>
      acc + Number(product.price),
    0
  );

  const chartData = products.map((product) => ({
    name: product.name,
    price: Number(product.price),
  }));

  // MÉTRICAS POR CATEGORIA
  const categoriesMap: Record<string, number> = {};

  products.forEach((product) => {
    if (categoriesMap[product.category]) {
      categoriesMap[product.category] += 1;
    } else {
      categoriesMap[product.category] = 1;
    }
  });

  const categoryData = Object.keys(categoriesMap).map(
    (category) => ({
      name: category,
      total: categoriesMap[category],
    })
  );

  const COLORS = [
    "#a855f7",
    "#3b82f6",
    "#22c55e",
    "#f97316",
    "#ef4444",
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6">
        <h1 className="text-2xl font-bold text-purple-500 mb-10">
          Market Sync AI
        </h1>

        <nav className="flex flex-col gap-4">
          <a
            href="/dashboard"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800 transition"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </a>

          <a
            href="/products"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800 transition"
          >
            <Package size={20} />
            Produtos
          </a>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-10">
        <h2 className="text-4xl font-bold text-purple-500 mb-10">
          Dashboard Inteligente
        </h2>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <Package className="text-purple-500" />

              <h3 className="text-zinc-400">
                Produtos
              </h3>
            </div>

            <p className="text-4xl font-bold text-purple-500">
              {totalProducts}
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="text-green-500" />

              <h3 className="text-zinc-400">
                Receita Total
              </h3>
            </div>

            <p className="text-4xl font-bold text-green-500">
              R$ {totalRevenue}
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="text-blue-500" />

              <h3 className="text-zinc-400">
                Categorias
              </h3>
            </div>

            <p className="text-4xl font-bold text-blue-500">
              {categoryData.length}
            </p>
          </div>
        </div>

        {/* GRÁFICOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* GRÁFICO PRODUTOS */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <h3 className="text-2xl font-bold mb-6">
              Produtos e preços
            </h3>

            <div className="w-full h-96">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar dataKey="price" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GRÁFICO CATEGORIAS */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <h3 className="text-2xl font-bold mb-6">
              Produtos por categoria
            </h3>

            <div className="w-full h-96">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="total"
                    nameKey="name"
                    outerRadius={120}
                    label
                  >
                    {categoryData.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
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
      </main>
    </div>
  );
}