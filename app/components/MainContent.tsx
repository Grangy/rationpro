// app/components/MainContent.tsx
import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAppleAlt, faBreadSlice, faCheese, faFire, faCircleNotch, faSearch } from "@fortawesome/free-solid-svg-icons";
import ProductAdd from "./ProductAdd";
import { fetchProducts } from "../../src/api";

interface MainContentProps {
  searchTerm: string;
  searchTriggered: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ searchTerm, searchTriggered }) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(searchTerm);
        console.log("Fetched products:", data); // Логирование полученных данных
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [searchTerm]);

  const calculateCalories = useCallback((protein: number, fat: number, carbs: number) => {
    return (protein * 4 + fat * 9 + carbs * 4).toFixed(2);
  }, []);

  if (isAdding) {
    return <ProductAdd goBack={() => setIsAdding(false)} />;
  }

  if (loading) return <div className="text-center"><FontAwesomeIcon icon={faCircleNotch} spin className="text-6xl text-green-500"/></div>;

  const productList = products;

  function onSearch(searchTerm: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <main className="flex-1 p-2 ml-0 md:ml-28 mb-12 md:mb-0">
      <div className="bg-white p-2 rounded shadow-md">
        <div className="mb-4 flex justify-between items-center">
          <button
            className="bg-green-500 text-white p-2 rounded"
            onClick={() => setIsAdding(true)}
          >
            Добавить продукт
          </button>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Поиск"
              className="w-full p-2 border rounded pl-10 text-black"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
            />
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold p-2 px-4"
              onClick={() => onSearch(searchTerm)}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {productList.map((product) => {
            const protein = product.mainProteins || 0;
            const fat = product.mainFats || 0;
            const carbs = product.mainCarb || 0;
            const calories = calculateCalories(protein, fat, carbs);

            return (
              <div
                key={product.id}
                className="bg-green-100 p-4 rounded-lg shadow-lg transform transition duration-500 ease-in-out hover:scale-105"
              >
                <h3 className="text-xl font-bold mb-2 text-black">{product.name}</h3>
                <div className="flex flex-col justify-between items-start">
                  <div className="flex items-center mb-1">
                    <FontAwesomeIcon icon={faAppleAlt} className="mr-1 text-green-500" />
                    <p className="text-sm text-black">Белки: {protein} г</p>
                  </div>
                  <div className="flex items-center mb-1">
                    <FontAwesomeIcon icon={faCheese} className="mr-1 text-green-500" />
                    <p className="text-sm text-black">Жиры: {fat} г</p>
                  </div>
                  <div className="flex items-center mb-1">
                    <FontAwesomeIcon icon={faBreadSlice} className="mr-1 text-green-500" />
                    <p className="text-sm text-black">Углеводы: {carbs} г</p>
                  </div>
                  <div className="flex items-center mb-1">
                    <FontAwesomeIcon icon={faFire} className="mr-1 text-green-500" />
                    <p className="text-sm text-black">Калории: {calories} ккал</p>
                  </div>
                </div>
                <div className="flex space-x-4 mt-4">
                  <button
                    className={`text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${activeButton === product.id.toString() ? "bg-green-700" : "bg-green-500"} text-white`}
                    onClick={() => setActiveButton(product.id.toString())}
                  >
                    Нутриенты
                  </button>
                  <button
                    className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    onClick={() => {
                      /* handle edit */
                    }}
                  >
                    Редактировать
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default MainContent;
