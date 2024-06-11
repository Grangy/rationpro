import React, { useState, useEffect } from 'react';
import { createProduct, fetchCategories } from '../../src/api';

interface Category {
    category: string;
    count: number;
}

interface ProductAddProps {
    goBack: () => void;
}

const ProductAdd: React.FC<ProductAddProps> = ({ goBack }) => {
    const [name, setName] = useState('');
    const [subname, setSubname] = useState('');
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [mainFats, setMainFats] = useState<string>('');
    const [mainProteins, setMainProteins] = useState<string>('');
    const [mainCarb, setMainCarb] = useState<string>('');
    const [mainWater, setMainWater] = useState<string>('');
    const [mainAsh, setMainAsh] = useState<number>(0);
    const [kcal, setKcal] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAll, setShowAll] = useState(false);
    const [loading, setLoading] = useState<boolean>(false); // Состояние для лоадера

    useEffect(() => {
        const getCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        getCategories();
    }, []);

    useEffect(() => {
        const proteins = parseFloat(mainProteins) || 0;
        const fats = parseFloat(mainFats) || 0;
        const carbs = parseFloat(mainCarb) || 0;
        setKcal(Number((carbs * 4 + fats * 9 + proteins * 4).toFixed(2)));

        const water = parseFloat(mainWater) || 0;
        const ash = 100 - (proteins + fats + carbs + water);
        setMainAsh(ash > 0 ? ash : 0);
    }, [mainCarb, mainFats, mainProteins, mainWater]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Показ лоадера перед отправкой запроса

        const selectedCategory = newCategory || category;

        const product = {
            name,
            subname,
            categoryname: selectedCategory,
            kcal,
            mainFats: parseFloat(mainFats) || 0,
            mainProteins: parseFloat(mainProteins) || 0,
            mainCarb: parseFloat(mainCarb) || 0,
            mainWater: parseFloat(mainWater) || 0,
            mainAsh,
            wasteWeightValue: 1.0,
            wasteWeightDesc: "Продукт в чистом виде",
            Measures: [{ name: 'грамм', value: 0.01, desc: "" }],
        };

        try {
            await createProduct(product);
            goBack();
        } catch (error) {
            console.error('Failed to create product:', error);
        } finally {
            setLoading(false); // Скрытие лоадера после завершения запроса
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categoriesToShow = showAll ? categories : filteredCategories;

    return (
        <div className="p-4 md:ml-28">
            <h2 className="text-2xl mb-4">Создать продукт</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Название</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Подназвание</label>
                    <input
                        type="text"
                        value={subname}
                        onChange={(e) => setSubname(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Категория</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Поиск категории или введите новую"
                            value={searchTerm || newCategory || category}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setNewCategory(e.target.value);
                                setCategory('');
                                setShowAll(false);
                            }}
                            className="w-full p-2 border rounded mb-2"
                        />
                        {searchTerm && categoriesToShow.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white border rounded shadow-lg max-h-40 overflow-auto">
                                {categoriesToShow.map((cat) => (
                                    <li
                                        key={cat.category}
                                        onClick={() => {
                                            setCategory(cat.category);
                                            setSearchTerm('');
                                            setNewCategory('');
                                            setShowAll(false);
                                        }}
                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                    >
                                        {cat.category} ({cat.count})
                                    </li>
                                ))}
                                {!showAll && (
                                    <li
                                        onClick={() => setShowAll(true)}
                                        className="p-2 cursor-pointer hover:bg-gray-200 text-center text-blue-500"
                                    >
                                        Показать все
                                    </li>
                                )}
                            </ul>
                        )}
                        {searchTerm && filteredCategories.length === 0 && (
                            <ul className="absolute z-10 w-full bg-white border rounded shadow-lg max-h-40 overflow-auto">
                                <li className="p-2 text-center">Ничего не найдено</li>
                                <li
                                    onClick={() => setShowAll(true)}
                                    className="p-2 cursor-pointer hover:bg-gray-200 text-center text-blue-500"
                                >
                                    Показать все
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Белки (г)</label>
                    <input
                        type="number"
                        value={mainProteins}
                        onChange={(e) => setMainProteins(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Жиры (г)</label>
                    <input
                        type="number"
                        value={mainFats}
                        onChange={(e) => setMainFats(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Углеводы (г)</label>
                    <input
                        type="number"
                        value={mainCarb}
                        onChange={(e) => setMainCarb(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Вода (г)</label>
                    <input
                        type="number"
                        value={mainWater}
                        onChange={(e) => setMainWater(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Зола (г)</label>
                    <input
                        type="number"
                        value={mainAsh}
                        readOnly
                        className="w-full p-2 border rounded bg-gray-100"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Калории (ккал)</label>
                    <input
                        type="number"
                        value={kcal}
                        readOnly
                        className="w-full p-2 border rounded bg-gray-100"
                    />
                </div>
                <div className="flex justify-between">
                    <button type="button" onClick={goBack} className="bg-gray-500 text-white p-2 rounded">
                        Назад
                    </button>
                    <button type="submit" className="bg-green-500 text-white p-2 rounded">
                        {loading ? 'Создание...' : 'Создать'} {/* Показ текста лоадера */}
                    </button>
                </div>
            </form>
            {loading && <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                    {/* <span className="visually-hidden">Загрузка...</span> */}
                </div>
            </div>}
        </div>
    );
};

export default ProductAdd;
