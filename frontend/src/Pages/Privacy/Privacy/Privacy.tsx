import React from "react";
import { Link } from "react-router-dom";
import { Shield, CheckCircle2, Lock, Eye, Database, Mail } from "lucide-react";
import logo from "../../../assets/logo.svg";

export default function Privacy() {
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
              className="no-underline px-3 md:px-5 py-2 md:py-2.5 bg-purple-100 text-purple-700 font-semibold transition-colors text-sm md:text-base rounded-xl"
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
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
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
              Introduction
            </h2>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-5 md:p-6 rounded-r-xl mb-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <p className="text-gray-700 leading-relaxed mb-3">
                At Tver Task, we take your privacy seriously. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our task management application.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Please read this privacy policy carefully. If you do not agree
                with the terms of this privacy policy, please do not access the
                application.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section
            className="mb-12 md:mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center shadow-md">
                <Database className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Information We Collect
              </h2>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">
              Personal Information
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may collect personal information that you provide to us such
              as:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              <li>Name and email address</li>
              <li>Account credentials (username and password)</li>
              <li>Profile information and avatar</li>
              <li>Task and goal data you create</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-3">Usage Data</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We automatically collect certain information when you use our
              application:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Device information and IP address</li>
              <li>Browser type and version</li>
              <li>Usage patterns and preferences</li>
              <li>Task completion statistics</li>
              <li>Time spent on the application</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section
            className="mb-12 md:mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                How We Use Your Information
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Provide, operate, and maintain our application</li>
              <li>Improve and personalize your experience</li>
              <li>Communicate with you about updates and features</li>
              <li>Process your tasks and track your progress</li>
              <li>Send you notifications and reminders</li>
              <li>Analyze usage patterns to improve our service</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>
          </section>

          {/* Data Security */}
          <section
            className="mb-12 md:mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-xl flex items-center justify-center shadow-md">
                <Lock className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Data Security
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              We implement appropriate technical and organizational security
              measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure data storage infrastructure</li>
              <li>Regular backups and disaster recovery plans</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section
            className="mb-12 md:mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-md">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Data Sharing and Disclosure
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              We do not sell your personal information. We may share your
              information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>With service providers who assist in our operations</li>
              <li>In connection with a business transfer or merger</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section
            className="mb-12 md:mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 rounded-xl flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Your Privacy Rights
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Export your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          {/* Cookies */}
          <section
            className="mb-12 md:mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-xl flex items-center justify-center shadow-md">
                <Database className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Cookies and Tracking
              </h2>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-orange-50 rounded-xl p-5 md:p-6 border-2 border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
              <p className="text-gray-600 leading-relaxed">
                We use cookies and similar tracking technologies to track
                activity on our application and store certain information. You
                can configure your browser to refuse cookies or alert you when
                cookies are being sent.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section
            className="mb-12 md:mb-16 opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center shadow-md">
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Contact Us
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6 md:mb-8">
              If you have questions or concerns about this Privacy Policy,
              please contact us at:
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

          {/* Updates */}
          <section
            className="opacity-0 animate-fadeIn"
            style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-100 rounded-xl flex items-center justify-center shadow-md">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Changes to This Policy
              </h2>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-teal-50 rounded-xl p-5 md:p-6 border-2 border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all duration-300">
              <p className="text-gray-600 leading-relaxed">
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date. You are advised
                to review this Privacy Policy periodically for any changes.
              </p>
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
