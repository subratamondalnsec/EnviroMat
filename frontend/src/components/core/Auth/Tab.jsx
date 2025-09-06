export default function Tab({ tabData, field, setField }) {
  return (
    <div className="flex bg-white/80 backdrop-blur-sm border border-green-200 p-0.5 rounded-full max-w-max shadow-lg my-4">
      {tabData.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setField(tab.type)}
          className={`${
            field === tab.type
              ? "bg-gradient-to-r from-green-300 to-emerald-400 text-gray-700 shadow-md"
              : "bg-transparent text-gray-700 hover:bg-green-50/50"
          } py-2 px-6 rounded-full transition-all duration-300 ease-in-out font-medium text-xs min-w-[80px] focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50`}
        >
          {tab?.tabName}
        </button>
      ))}
    </div>
  );
}
