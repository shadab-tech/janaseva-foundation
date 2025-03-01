export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-600">Test Page</h1>
      <p className="mt-4 text-gray-600">
        This is a simple test page to verify Tailwind CSS is working.
      </p>
      <div className="mt-8 p-4 bg-red-100 rounded-lg">
        <p className="text-red-800">
          If you can see this box in red and the text styled properly, Tailwind CSS is working!
        </p>
      </div>
    </div>
  );
}
