import React from "react";
import { Link } from "react-router-dom";
import { FileText, CheckCircle2, AlertCircle, Scale } from "lucide-react";
import logo from "../../../assets/logo.svg";

export default function Terms() {
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
              className="no-underline px-3 md:px-5 py-2 md:py-2.5 text-gray-600 font-medium hover:text-purple-600 transition-colors text-sm md:text-base rounded-xl hover:bg-purple-50"
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
              className="no-underline px-3 md:px-5 py-2 md:py-2.5 bg-purple-100 text-purple-700 font-semibold transition-colors text-sm md:text-base rounded-xl"
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
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-white/90">
            Last updated: December 22, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section
            className="mb-12 md:mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              Agreement to Terms
            </h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 md:p-6 rounded-r-xl mb-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <p className="text-gray-700 leading-relaxed mb-3">
                By accessing and using Tver Task, you agree to be bound by these
                Terms of Service and all applicable laws and regulations. If you
                do not agree with any part of these terms, you may not use our
                service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                These terms apply to all visitors, users, and others who access
                or use the service.
              </p>
            </div>
          </section>

          {/* Use License */}
          <section
            className="mb-12 md:mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Use License</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Permission is granted to temporarily access and use Tver Task for
              personal, non-commercial purposes. This is the grant of a license,
              not a transfer of title. Under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>
                Attempt to decompile or reverse engineer any software contained
                in the service
              </li>
              <li>
                Remove any copyright or other proprietary notations from the
                materials
              </li>
              <li>
                Transfer the materials to another person or "mirror" the
                materials on any other server
              </li>
            </ul>
          </section>

          {/* User Accounts */}
          <section
            className="mb-12 md:mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                User Accounts
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you create an account with us, you must provide accurate,
              complete, and current information. Failure to do so constitutes a
              breach of the Terms.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Safeguarding your password</li>
              <li>All activities that occur under your account</li>
              <li>Maintaining the security of your account</li>
              <li>
                Notifying us immediately of any unauthorized use of your account
              </li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section
            className="mb-12 md:mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-xl flex items-center justify-center shadow-md">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Acceptable Use Policy
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              You agree not to use Tver Task to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>
                Upload, transmit, or distribute any harmful or malicious content
              </li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Harass, abuse, or harm another person</li>
              <li>Spam or send unsolicited messages</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section
            className="mb-12 md:mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center shadow-md">
                <Scale className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Intellectual Property Rights
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              The service and its original content (excluding user-generated
              content), features, and functionality are owned by Tver Task and
              are protected by international copyright, trademark, patent, trade
              secret, and other intellectual property laws.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You retain all rights to the content you create and store in Tver
              Task. By using our service, you grant us a license to use, modify,
              and display your content solely for the purpose of providing the
              service to you.
            </p>
          </section>

          {/* Service Availability */}
          <section
            className="mb-12 md:mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.45s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-100 rounded-xl flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-cyan-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Service Availability
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              We strive to provide reliable service, but we do not guarantee
              that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>The service will be available at all times</li>
              <li>The service will be uninterrupted or error-free</li>
              <li>Defects will be corrected immediately</li>
              <li>
                The service is free of viruses or other harmful components
              </li>
            </ul>
          </section>

          {/* Termination */}
          <section
            className="mb-12 md:mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-xl flex items-center justify-center shadow-md">
                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Termination
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason, including if you breach
              the Terms.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Upon termination, your right to use the service will immediately
              cease. If you wish to terminate your account, you may simply
              discontinue using the service or contact us to delete your
              account.
            </p>
          </section>

          {/* Disclaimer */}
          <section
            className="mb-12 md:mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-xl flex items-center justify-center shadow-md">
                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Disclaimer of Warranties
              </h2>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-orange-50 rounded-xl p-5 md:p-6 border-2 border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
              <p className="text-gray-600 leading-relaxed">
                The service is provided "AS IS" and "AS AVAILABLE" without any
                warranties of any kind, whether express or implied. We do not
                warrant that the service will meet your requirements or that it
                will be suitable for your particular purpose.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section
            className="mb-12 md:mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-xl flex items-center justify-center shadow-md">
                <Scale className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Limitation of Liability
              </h2>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 md:p-6 border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-300">
              <p className="text-gray-600 leading-relaxed">
                In no event shall Tver Task, its directors, employees, or agents
                be liable for any indirect, incidental, special, consequential,
                or punitive damages, including loss of profits, data, or other
                intangible losses, resulting from your use of the service.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section
            className="mb-12 md:mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.65s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-100 rounded-xl flex items-center justify-center shadow-md">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Changes to Terms
              </h2>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-teal-50 rounded-xl p-5 md:p-6 border-2 border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all duration-300">
              <p className="text-gray-600 leading-relaxed mb-3">
                We reserve the right to modify or replace these Terms at any
                time. If a revision is material, we will provide at least 30
                days' notice prior to any new terms taking effect.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By continuing to access or use our service after revisions
                become effective, you agree to be bound by the revised terms.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section
            className="opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.75s", animationFillMode: "forwards" }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6 md:mb-8">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 md:p-8 border-2 border-purple-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
              <p className="text-gray-900 font-semibold mb-3 text-lg">
                Tver Task Support
              </p>
              <div className="space-y-2">
                <p className="text-gray-700 flex items-center gap-2">
                  <span className="font-medium">Email:</span>{" "}
                  kornvisal222@gmail.com
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <span className="font-medium">Phone:</span> 097 921 2001
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <span className="font-medium">Telegram:</span> @visalkorn22
                </p>
              </div>
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
}
