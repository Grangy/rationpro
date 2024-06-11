export const fetchProducts = async (searchTerm = '') => {
  const response = await fetch(`http://ration.phys.su:3006/api/products?mode=main&search=${searchTerm}`);
  if (!response.ok) {
      throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const createProduct = async (product: { name: string; subname: string; categoryname: string; kcal: number; mainFats: number; mainProteins: number; mainCarb: number; mainWater: number; mainAsh: number; wasteWeightValue: number; wasteWeightDesc: string; Measures: { name: string; value: number; desc: string; }[]; }) => {
  const response = await fetch('http://ration.phys.su:3006/api/products', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
  });

  if (!response.ok) {
      throw new Error('Failed to create product');
  }
  return response.json();
};

export const fetchCategories = async () => {
  const response = await fetch('http://ration.phys.su:3006/api/products/categories');
  if (!response.ok) {
      throw new Error('Failed to fetch categories');
  }
  return response.json();
};
