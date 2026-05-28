import { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../services/firebase";

interface ProductProps {
  id: string;
  name: string;
  price: string;
  category: string;
}

export function Products() {
  const [name, setName] = useState("");

  const [price, setPrice] = useState("");

  const [category, setCategory] = useState("");

  const [products, setProducts] = useState<ProductProps[]>([]);

  const [search, setSearch] = useState("");

  const [filterCategory, setFilterCategory] =
    useState("");

  const [editingId, setEditingId] = useState("");

  const [editingName, setEditingName] = useState("");

  const [editingPrice, setEditingPrice] = useState("");

  const [editingCategory, setEditingCategory] =
    useState("");

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

  const filteredProducts = products.filter(
    (product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        filterCategory === ""
          ? true
          : product.category === filterCategory;

      return matchesSearch && matchesCategory;
    }
  );

  async function handleUpdateProduct(id: string) {
    await updateDoc(doc(db, "products", id), {
      name: editingName,
      price: editingPrice,
      category: editingCategory,
    });

    setEditingId("");

    setEditingName("");

    setEditingPrice("");

    setEditingCategory("");

    loadProducts();
  }

  async function handleDeleteProduct(id: string) {
    await deleteDoc(doc(db, "products", id));

    loadProducts();
  }

  async function handleAddProduct() {
    if (!name || !price || !category) {
      alert("Preencha todos os campos");

      return;
    }

    await addDoc(collection(db, "products"), {
      name,
      price,
      category,
      createdAt: new Date(),
    });

    alert("Produto cadastrado!");

    setName("");

    setPrice("");

    setCategory("");

    loadProducts();
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white p-10">
      <h1 className="text-4xl font-bold text-purple-500 mb-10">
        Cadastro de Produtos
      </h1>

      {/* PESQUISA */}
      <div className="mb-6 max-w-xl">
        <input
          type="text"
          placeholder="Pesquisar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700"
        />
      </div>

      {/* FILTRO CATEGORIA */}
      <div className="mb-6 max-w-xl">
        <select
          value={filterCategory}
          onChange={(e) =>
            setFilterCategory(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700"
        >
          <option value="">
            Todas as categorias
          </option>

          <option value="Calçados">
            Calçados
          </option>

          <option value="Roupas">
            Roupas
          </option>

          <option value="Acessórios">
            Acessórios
          </option>
        </select>
      </div>

      {/* FORMULÁRIO */}
      <div className="bg-zinc-900 p-8 rounded-2xl max-w-xl mb-10">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome do produto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded-lg bg-zinc-800 border border-zinc-700"
          />

          <input
            type="text"
            placeholder="Categoria"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="p-3 rounded-lg bg-zinc-800 border border-zinc-700"
          />

          <input
            type="number"
            placeholder="Preço"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-3 rounded-lg bg-zinc-800 border border-zinc-700"
          />

          <button
            onClick={handleAddProduct}
            className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg font-bold"
          >
            Salvar Produto
          </button>
        </div>
      </div>

      {/* LISTA */}
      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-zinc-900 p-5 rounded-xl border border-zinc-800"
          >
            {editingId === product.id ? (
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) =>
                    setEditingName(e.target.value)
                  }
                  className="p-3 rounded-lg bg-zinc-800 border border-zinc-700"
                />

                <input
                  type="text"
                  value={editingCategory}
                  onChange={(e) =>
                    setEditingCategory(e.target.value)
                  }
                  className="p-3 rounded-lg bg-zinc-800 border border-zinc-700"
                />

                <input
                  type="number"
                  value={editingPrice}
                  onChange={(e) =>
                    setEditingPrice(e.target.value)
                  }
                  className="p-3 rounded-lg bg-zinc-800 border border-zinc-700"
                />

                <button
                  onClick={() =>
                    handleUpdateProduct(product.id)
                  }
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                >
                  Salvar Alterações
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-purple-400">
                  {product.name}
                </h2>

                <p className="text-zinc-300 mt-2">
                  R$ {product.price}
                </p>

                <p className="text-sm text-zinc-500 mt-1">
                  Categoria: {product.category}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => {
                      setEditingId(product.id);

                      setEditingName(product.name);

                      setEditingPrice(product.price);

                      setEditingCategory(
                        product.category
                      );
                    }}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteProduct(product.id)
                    }
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                  >
                    Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}