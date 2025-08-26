import React from "react";

const news = [
  {
    id: 1,
    name: "Ali Valiyev",
    message: "Assalomu alaykum, doktor. A...",
  },
  {
    id: 2,
    name: "Karim Anvarov",
    message: "Yaxshimisiz, keyingi uchrash...",
  },
];

const DashboardUserLastMessage = () => {
  return (
    <div className="w-full max-w-full bg-white rounded-xl p-6 border border-gray-200 shadow-md ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Soʻnggi xabarlar
        </h2>
        <a
          href="#"
          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
        >
          Barchasi
        </a>
      </div>

      <ul className="divide-y divide-gray-200">
        {news.map((item) => (
          <li key={item.id} className="py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-lg">
                {item.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                <p className="text-sm text-gray-500 truncate">{item.message}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardUserLastMessage;
