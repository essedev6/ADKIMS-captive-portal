'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PlanCategory {
  type: string;
  title: string;
  description: string;
  isActive: boolean;
}

export default function PlanCategories() {
  const [categories, setCategories] = useState<PlanCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plan-pages`);
        if (!response.ok) {
          throw new Error('Failed to fetch plan categories');
        }
        const data = await response.json();
        setCategories(data.filter((cat: PlanCategory) => cat.isActive));
      } catch (err) {
        console.error('Error fetching plan categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Choose Your Plan Category
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Select the type of internet plan that best suits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <Link
              key={category.type}
              href={`/template-plans/${category.type}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600">{category.description}</p>
                <div className="mt-4 text-blue-600 group-hover:text-blue-700">
                  View Plans →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}