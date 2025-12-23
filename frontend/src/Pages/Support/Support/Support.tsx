import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  Send,
  Clock,
  HelpCircle,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import logo from "../../../assets/logo.svg";

const Support: React.FC = () => {
  const contactCards = [
    {
      icon: Phone,
      title: "Phone Support",
      value: "097 921 2001",
      description: "Call us for immediate assistance",
      href: "tel:0979212001",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: Send,
      title: "Telegram",
      value: "@visalkorn22",
      description: "Chat with us on Telegram",
      href: "https://t.me/visalkorn22",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Mail,
      title: "Email Support",
      value: "kornvisal222@gmail.com",
      description: "Send us an email anytime",
      href: "mailto:kornvisal222@gmail.com",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        'Go to the login page and click on "Forgot Password". Enter your email address, and we\'ll send you instructions to reset your password.',
    },
    {
      question: "How does the XP system work?",
      answer:
        "You earn XP by completing tasks, maintaining streaks, and finishing quests. Your XP level reflects your productivity and helps you track your progress over time.",
    },
    {
      question: "Can I sync Tver Task across multiple devices?",
      answer:
        "Yes! Your account is cloud-synced, so you can access your tasks, quests, and progress from any device by logging in with your credentials.",
    },
    {
      question: "How do I create a quest?",
      answer:
        "Navigate to the Quests page and click the 'Create Quest' button. Fill in the quest details, set your goals, and start tracking your progress.",
    },
    {
      question: "What are badges and how do I earn them?",
      answer:
        "Badges are achievements you unlock by completing specific milestones, such as maintaining long streaks, completing multiple quests, or reaching XP levels.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We use industry-standard encryption to protect your data. Please review our Privacy Policy for detailed information about how we handle your data.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Tver Task" className="h-10 md:h-14" />
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              to="/support"
              className="no-underline px-3 md:px-5 py-2 md:py-2.5 bg-purple-100 text-purple-700 font-semibold transition-colors text-sm md:text-base rounded-xl"
            >
              Support
            </Link>
            <Link
              to="/privacy"
              className="no-underline px-3 md:px-5 py-2 md:py-2.5 text-gray-600 font-medium hover:text-purple-600 transition-colors text-sm md:text-base rounded-xl hover:bg-purple-50"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="no-underline px-3 md:px-5 py-2 md:py-2.5 text-gray-600 font-medium hover:text-purple-600 transition-colors text-sm md:text-base rounded-xl hover:bg-purple-50"
            >
              Terms
            </Link>
            <Link
              to="/"
              className="no-underline px-4 md:px-6 py-2 md:py-2.5 text-gray-900 font-semibold hover:text-purple-600 transition-colors text-sm md:text-base rounded-xl ml-2"
            >
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div
            className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-6 animate-bounce"
            style={{ animationDuration: "2s" }}
          >
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Support Center
          </h1>
          <p className="text-lg text-white/90">
            We're here to help! Reach out through any channel below.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="prose prose-lg max-w-none">
          {/* Contact Section */}
          <section
            className="mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 text-center">
              Get in Touch
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8 md:mb-10 text-center max-w-2xl mx-auto">
              Choose your preferred way to contact our support team. We're
              available to assist you with any questions or concerns.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {contactCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <a
                    key={index}
                    href={card.href}
                    target={card.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      card.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group bg-white border-2 border-gray-100 rounded-2xl p-6 md:p-7 hover:border-purple-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 opacity-0 animate-fadeIn"
                    style={{
                      animationDelay: `${index * 0.1 + 0.2}s`,
                      animationFillMode: "forwards",
                    }}
                  >
                    <div
                      className={`${card.bgColor} w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-4 md:mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md`}
                    >
                      <Icon className={`w-7 h-7 ${card.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-purple-600 font-medium mb-2 text-sm break-all">
                      {card.value}
                    </p>
                    <p className="text-gray-600 text-sm">{card.description}</p>
                  </a>
                );
              })}
            </div>
          </section>

          {/* Support Hours */}
          <section
            className="mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-md">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Support Hours
              </h2>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 md:p-8 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
              <p className="text-gray-700 mb-4">
                Our support team is available to assist you:
              </p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-900 font-semibold">
                  Monday - Friday: 9:00 AM - 6:00 PM (GMT+7)
                </span>
              </div>
              <p className="text-gray-600 text-sm ml-5">
                Weekend support: Email and Telegram responses within 24 hours
              </p>
            </div>
          </section>

          {/* FAQ Section */}
          <section
            className="mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center shadow-md">
                <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-4 md:space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-5 md:p-6 border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 opacity-0 animate-fadeIn"
                  style={{
                    animationDelay: `${index * 0.1 + 0.7}s`,
                    animationFillMode: "forwards",
                  }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Additional Help */}
          <section
            className="opacity-0 animate-fadeIn"
            style={{ animationDelay: "1.3s", animationFillMode: "forwards" }}
          >
            <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Still Need Help?
              </h2>
              <p className="text-white/95 mb-8 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                Can't find what you're looking for? Our support team is ready to
                assist you with any questions.
              </p>
              <a
                href="mailto:kornvisal222@gmail.com"
                className="inline-block bg-[#F9C80E] text-purple-900 font-bold px-8 md:px-10 py-3.5 md:py-4 rounded-xl hover:bg-[#e0b50d] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 text-base md:text-lg"
              >
                Contact Support Team
              </a>
            </div>
          </section>
        </div>
      </div>

      {/* Simple Footer */}
      <div className="text-center py-8 text-sm text-gray-500 border-t border-gray-100">
        © 2025 Tver Task. All rights reserved.
      </div>
    </div>
  );
};

export default Support;
