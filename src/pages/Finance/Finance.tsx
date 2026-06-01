import { useEffect, useState } from "react";

import { ArrowLeft } from "lucide-react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../services/firebase";

import { useAuth } from "../../context/AuthContext";

export function Finance() {
  const { user } = useAuth();

  const [productName, setProductName] =
    useState("");

  const [salePrice, setSalePrice] =
    useState("");

  const [productCost, setProductCost] =
    useState("");

  const [marketplaceFee, setMarketplaceFee] =
    useState("");

  const [adsCost, setAdsCost] =
    useState("");

  const [shippingCost, setShippingCost] =
    useState("");

  const [taxPercent, setTaxPercent] =
    useState("");

  const [desiredMargin, setDesiredMargin] =
    useState("");

  const [savedProducts, setSavedProducts] =
    useState<any[]>([]);

  const [editingId, setEditingId] =
    useState("");

  const sale = Number(salePrice) || 0;

  const cost = Number(productCost) || 0;

  const fee =
    (sale * Number(marketplaceFee || 0)) /
    100;

  const ads = Number(adsCost) || 0;

  const shipping =
    Number(shippingCost) || 0;

  const tax =
    (sale * Number(taxPercent || 0)) /
    100;

  const totalCosts =
    cost + fee + ads + shipping + tax;

  const profit = sale - totalCosts;

  const margin =
    sale > 0
      ? ((profit / sale) * 100).toFixed(1)
      : 0;

  const desiredProfit =
    Number(desiredMargin || 0) / 100;

  const suggestedPrice =
    (
      (cost + ads + shipping) /
      (1 -
        Number(marketplaceFee || 0) / 100 -
        Number(taxPercent || 0) / 100 -
        desiredProfit)
    ).toFixed(2);

  async function loadFinancialProducts() {
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

    setSavedProducts(list);
  }

  async function handleSaveProduct() {
    await addDoc(
      collection(db, "financial_products"),
      {
        productName,
        salePrice,
        productCost,
        marketplaceFee,
        adsCost,
        shippingCost,
        taxPercent,
        desiredMargin,
        suggestedPrice,
        margin,
        createdAt: new Date(),
        userId: user.uid,
      }
    );

    alert("Produto financeiro salvo!");

    loadFinancialProducts();
  }

  async function handleDelete(id: string) {
    await deleteDoc(
      doc(db, "financial_products", id)
    );

    loadFinancialProducts();
  }

  async function handleUpdate(id: string) {
    await updateDoc(
      doc(db, "financial_products", id),
      {
        productName,
        salePrice,
        productCost,
        marketplaceFee,
        adsCost,
        shippingCost,
        taxPercent,
        desiredMargin,
        suggestedPrice,
        margin,
      }
    );

    alert("Produto atualizado!");

    setEditingId("");

    loadFinancialProducts();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function generateAIAnalysis() {
    if (profit <= 0) {
      return "🚨 Produto dando prejuízo.";
    }

    if (Number(margin) < 10) {
      return "⚠️ Margem muito baixa.";
    }

    if (Number(margin) < 20) {
      return "📉 Margem razoável, mas pode melhorar.";
    }

    return "✅ Produto saudável e lucrativo.";
  }

  useEffect(() => {
    loadFinancialProducts();
  }, [user]);

  return (
    <div className="bg-black min-h-screen text-white p-10">

      {/* TOPO */}
      <div className="flex items-center justify-between mb-10">

        <div>
          <h1 className="text-5xl font-bold text-purple-500">
            Financeiro IA
          </h1>

          <p className="text-zinc-400 mt-2">
            Cálculo inteligente de margem e lucro
          </p>
        </div>

        <a
          href="/dashboard"
          className="bg-purple-600 hover:bg-purple-700 transition px-5 py-3 rounded-xl font-bold flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Dashboard
        </a>

      </div>

      {/* FORMULÁRIO */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-10">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-zinc-400 mb-2 font-semibold">
              Nome do Produto:
            </p>

            <input
              type="text"
              value={productName}
              onChange={(e) =>
                setProductName(e.target.value)
              }
              className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700"
            />
          </div>

          <div>
            <p className="text-zinc-400 mb-2 font-semibold">
              Preço de Venda:
            </p>

            <input
              type="number"
              value={salePrice}
              onChange={(e) =>
                setSalePrice(e.target.value)
              }
              className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700"
            />
          </div>

          <div>
            <p className="text-zinc-400 mb-2 font-semibold">
              Custo do Produto:
            </p>

            <input
              type="number"
              value={productCost}
              onChange={(e) =>
                setProductCost(e.target.value)
              }
              className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700"
            />
          </div>

          <div>
            <p className="text-zinc-400 mb-2 font-semibold">
              Taxa Marketplace (%):
            </p>

            <input
              type="number"
              value={marketplaceFee}
              onChange={(e) =>
                setMarketplaceFee(
                  e.target.value
                )
              }
              className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700"
            />
          </div>

          <div>
            <p className="text-zinc-400 mb-2 font-semibold">
              Gasto com Ads:
            </p>

            <input
              type="number"
              value={adsCost}
              onChange={(e) =>
                setAdsCost(e.target.value)
              }
              className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700"
            />
          </div>

          <div>
            <p className="text-zinc-400 mb-2 font-semibold">
              Frete:
            </p>

            <input
              type="number"
              value={shippingCost}
              onChange={(e) =>
                setShippingCost(e.target.value)
              }
              className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700"
            />
          </div>

          <div>
            <p className="text-zinc-400 mb-2 font-semibold">
              Imposto (%):
            </p>

            <input
              type="number"
              value={taxPercent}
              onChange={(e) =>
                setTaxPercent(e.target.value)
              }
              className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700"
            />
          </div>

          <div>
            <p className="text-zinc-400 mb-2 font-semibold">
              Margem Desejada (%):
            </p>

            <input
              type="number"
              value={desiredMargin}
              onChange={(e) =>
                setDesiredMargin(
                  e.target.value
                )
              }
              className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700"
            />
          </div>

        </div>

      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-zinc-400">
            Taxa Marketplace
          </h2>

          <p className="text-3xl font-bold text-yellow-400 mt-2">
            R$ {fee.toFixed(2)}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-zinc-400">
            Imposto
          </h2>

          <p className="text-3xl font-bold text-red-400 mt-2">
            R$ {tax.toFixed(2)}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-zinc-400">
            Lucro Líquido
          </h2>

          <p className="text-3xl font-bold text-green-400 mt-2">
            R$ {profit.toFixed(2)}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-zinc-400">
            Margem Atual
          </h2>

          <p className="text-3xl font-bold text-blue-400 mt-2">
            {margin}%
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-zinc-400">
            Margem Desejada
          </h2>

          <p className="text-3xl font-bold text-purple-400 mt-2">
            {desiredMargin || 0}%
          </p>
        </div>

      </div>

      {/* PREÇO IDEAL */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-10">

        <h2 className="text-3xl font-bold text-green-500 mb-6">
          Preço Ideal de Venda
        </h2>

        <p className="text-zinc-400 mb-4">
          Valor recomendado para atingir sua margem desejada.
        </p>

        <div className="bg-black border border-green-500 rounded-2xl p-8">
          <p className="text-5xl font-bold text-green-400">
            R$ {suggestedPrice}
          </p>
        </div>

      </div>

      {/* BOTÃO */}
      <div className="mb-10">

        <button
          onClick={() => {
            if (editingId) {
              handleUpdate(editingId);
            } else {
              handleSaveProduct();
            }
          }}
          className="bg-green-600 hover:bg-green-700 transition px-8 py-4 rounded-2xl text-xl font-bold"
        >
          {editingId
            ? "Salvar Alterações"
            : "Salvar Produto"}
        </button>

      </div>

      {/* IA */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-10">

        <h2 className="text-3xl font-bold text-purple-500 mb-4">
          IA Financeira
        </h2>

        <p className="text-xl text-zinc-300 leading-8">
          {generateAIAnalysis()}
        </p>

      </div>

      {/* PRODUTOS SALVOS */}
      <div className="mt-12">

        <h2 className="text-4xl font-bold text-purple-500 mb-8">
          Produtos Financeiros Salvos
        </h2>

        <div className="grid gap-6">

          {savedProducts.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            >

              <h3 className="text-2xl font-bold text-green-400">
                {item.productName}
              </h3>

              <div className="mt-4 space-y-2 text-zinc-300">

                <p>
                  💰 Venda: R$ {item.salePrice}
                </p>

                <p>
                  📦 Custo: R$ {item.productCost}
                </p>

                <p>
                  🛒 Marketplace: {item.marketplaceFee}%
                </p>

                <p>
                  📢 Ads: R$ {item.adsCost}
                </p>

                <p>
                  🚚 Frete: R$ {item.shippingCost}
                </p>

                <p>
                  🧾 Imposto: {item.taxPercent}%
                </p>

                <p>
                  🎯 Margem Desejada: {item.desiredMargin}%
                </p>

                <p>
                  📊 Margem Atual: {item.margin}%
                </p>

                <p className="text-green-400 font-bold text-xl">
                  💵 Preço Ideal: R$ {item.suggestedPrice}
                </p>

              </div>

              <div className="flex gap-4 mt-6">

                <button
                  onClick={() => {
                    setEditingId(item.id);

                    setProductName(
                      item.productName
                    );

                    setSalePrice(item.salePrice);

                    setProductCost(
                      item.productCost
                    );

                    setMarketplaceFee(
                      item.marketplaceFee
                    );

                    setAdsCost(item.adsCost);

                    setShippingCost(
                      item.shippingCost
                    );

                    setTaxPercent(
                      item.taxPercent
                    );

                    setDesiredMargin(
                      item.desiredMargin
                    );

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-bold"
                >
                  Editar
                </button>

                <button
                  onClick={() =>
                    handleDelete(item.id)
                  }
                  className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-bold"
                >
                  Excluir
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}