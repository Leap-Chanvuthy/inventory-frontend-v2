export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-4xl font-bold text-red-500">403</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
}
