'use client';

import PlanCategories from '@/components/PlanCategories';

export default function TemplatePlansPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Internet Plans
            </h1>
            <p className="text-xl text-gray-600">
              Choose from our range of flexible internet plans
            </p>
          </div>
        </div>
      </div>
      <PlanCategories />
    </div>
  );
}