import React from "react";
import { Phone, Mail, Send } from "lucide-react";

const Support: React.FC = () => {
  const supportCards = [
    {
      icon: Phone,
      title: "Phone Number",
      value: "097 921 2001",
      href: "tel:097921200",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Send,
      title: "Telegram",
      value: "@visalkorn22",
      href: "https://t.me/visalkorn22",
      color: "from-sky-500 to-blue-500",
      bgColor: "bg-sky-50",
      iconColor: "text-sky-600",
    },
    {
      icon: Mail,
      title: "Email",
      value: "kornvisal222@gmail.com",
      href: "mailto:kornvisal222@gmail.com",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    // CHANGE: Removed 'bg-[#f5f5f0]' so it fits your global theme
    <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Support</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            If you need help, feel free to contact us through the following
            channels.
          </p>
        </div>

        {/* Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <a
                key={index}
                href={card.href}
                className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                ></div>

                {/* Icon Container */}
                <div
                  className={`relative ${card.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-8 h-8 ${card.iconColor}`} />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {card.title}
                  </h3>
                  <p className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300 break-all">
                    {card.value}
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </a>
            );
          })}
        </div>

        {/* Additional Help Section */}
        <div className="mt-16 text-center bg-white rounded-2xl p-8 shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Need Immediate Assistance?
          </h2>
          <p className="text-gray-600 mb-6">
            Our support team typically responds within 24 hours on all channels.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Available Now
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
