import { Suspense } from 'react';

export async function generateStaticParams() {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL);
    const makesData = await response.json();

    const paths = [];
    const currentYear = new Date().getFullYear();
    const startYear = 2000; 

    makesData.Results.forEach(make => {
        for (let year = startYear; year <= currentYear; year++) {
            paths.push({
                params: {
                    makeId: make.MakeId.toString(),
                    year: year.toString(),
                }
            });
        }
    });

    return paths;
}

const ResultPage = async ({ params }) => {
  const { makeId, year } = await params;
  let models = [];

  try {
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
    );
    const data = await response.json();
    models = data.Results || [];
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Vehicle Models</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl mb-4 text-gray-700">Models for Make ID: {makeId} in {year}:</h2>
        <Suspense fallback={<div>Loading...</div>}>
          {models.length > 0 ? (
            <ul className="list-disc list-inside">
              {models.map((model, index) => (
                <li key={index} className="text-gray-700">
                  {model.Model_Name} (ID: {model.Model_ID})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No models found for this selection.</p>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default ResultPage;
