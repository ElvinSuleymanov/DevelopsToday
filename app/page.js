'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';

const FilterPage = () => {
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2014 }, (_, i) => currentYear - i);

  useEffect(() => {
    
    const fetchMakes = async () => {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL);
      const data = await response.json();
      setMakes(data.Results || []);
    };

    fetchMakes();
  }, []);

  const handleMakeChange = (e) => {
    setSelectedMake(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const isButtonDisabled = !selectedMake || !selectedYear;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Car Dealer Application</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <label className="block mb-2 text-sm font-medium text-gray-700">Select Vehicle Make:</label>
        <select
          className="block w-full p-2 mb-4 border border-gray-300 rounded text-gray-700"
          value={selectedMake}
          onChange={handleMakeChange}
        >
          <option value="">Select Make</option>
          {makes.map((make) => (
            <option key={make.MakeId} value={make.MakeId}>
              {make.MakeName}
            </option>
          ))}
        </select>

        <label className="block mb-2 text-sm font-medium text-gray-700">Select Model Year:</label>
        <select
          className="block w-full p-2 mb-4 border border-gray-300 rounded text-gray-700"
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <Link href={`/result/${selectedMake}/${selectedYear}`}>
          <button
            className={`w-full py-2 px-4 bg-blue-500 text-white font-bold rounded ${
              isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            disabled={isButtonDisabled}
          >
            Next
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FilterPage;
