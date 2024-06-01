'use client';
import { useEffect, useState } from "react";
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('all');

  useEffect(() => {
    fetch('/api/categories').then(res => {
      res.json().then(categories => setCategories(categories))
    });
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => setMenuItems(menuItems));
    });
  }, []);

  const handleCategoryChange = (event) => {
    setCurrentCategory(event.target.value);
  };

  const filteredMenuItems = currentCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === currentCategory);

  const currentCategoryName = currentCategory === 'all' 
    ? 'My Menu' 
    : categories.find(c => c._id === currentCategory)?.name;

  return (
    <section className="mt-8">
      <div>
        <label>Select Category: </label>
        <select value={currentCategory} onChange={handleCategoryChange}>
          <option value="all">All</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>
      {filteredMenuItems.length > 0 && (
        <div>
          <div className="text-center">
            <SectionHeaders mainHeader={currentCategoryName} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-6 mb-12">
            {filteredMenuItems.map(item => (
              <MenuItem key={item._id} {...item} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}