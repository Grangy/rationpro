"use client"
import React, { useState } from 'react';
import { useGetAllDishProductsQuery } from "../../src/graphql";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const DishList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, error } = useGetAllDishProductsQuery();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const replaceNutrientName = (name: string) => {
    return name === 'Кальций' ? 'Калории' : name;
  };

  if (loading) return <div className='text-center'><FontAwesomeIcon icon={faCircleNotch} spin className="text-6xl text-green-500 md:ml-28"/></div>;
  if (error) return <p>Error loading dishes: {error.message}</p>;

  const filteredDishes = data?.dishes.filter(dish =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="flex-1 p-2 ml-0 md:ml-28 mb-12 md:mb-0">
      <input
        type="text"
        placeholder="Поиск блюд..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full p-2 border rounded mb-4 text-black"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDishes.map((dish) => {
          return (
            <div key={dish.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-xl mb-2 text-black">{dish.name}</h3>
              <p className="text-gray-600">{dish.description}</p>
              <ul className="mb-4">
                {dish.dishProducts.map((dp) => (
                  <li key={dp.productId} className='text-black'>
                    {dp.product.name} - {dp.amount}g (Cooking factor: {dp.cookCoeff})
                  </li>
                ))}
              </ul>
              {dish.dishNutrients.map((nutrient) => (
                <p key={nutrient.nutrientId} className="text-black">
                  {replaceNutrientName(nutrient.nutrient.name)}: {nutrient.amount.toFixed(2)}
                </p>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DishList;
