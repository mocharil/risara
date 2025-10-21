"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Scale, Shield, AlertCircle, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "What happens if I violate the Terms & Conditions?",
      answer: "If you violate our Terms & Conditions, we may suspend or terminate your account immediately without prior notice. Depending on the severity, we may also take legal action if necessary. We encourage all users to read and follow our terms carefully."
    },
    {
      question: "Can I use Risara for commercial purposes?",
      answer: "Risara is primarily designed for government and public administration use in Jakarta. For commercial use cases, please contact us at arilindra21@gmail.com to discuss licensing and partnership opportunities."
    },
    {
      question: "How do I delete my account and data?",
      answer: "You can request account deletion by contacting our support team at arilindra21@gmail.com. We will process your request within 30 days and delete all personal information unless required by law to retain it longer."
    },
    {
      question: "Are the AI-generated insights legally binding?",
      answer: "No. AI-generated insights are provided as guidance tools only and are not legally binding. Users should verify information and exercise professional judgment before taking any action based on platform data."
    },
    {
      question: "Can I share my account with others?",
      answer: "No. Each account is for individual use only. You are responsible for maintaining the security of your account credentials and for all activities that occur under your account. Sharing accounts violates our Terms & Conditions."
    },
    {
      question: "What data sources does Risara use?",
      answer: "Risara aggregates data from publicly available sources including news media, social media platforms (TikTok, Facebook, Instagram), government open data portals, and public forums. All data is processed using AI and machine learning technologies."
    },
    {
      question: "How often are the Terms & Conditions updated?",
      answer: "We may update our Terms & Conditions at any time. When we make material changes, we will notify users by posting the new terms on this page and updating the 'Last Updated' date. Your continued use after changes constitutes acceptance."
    },
    {
      question: "Who can I contact for legal questions?",
      answer: "For legal questions or concerns about our Terms & Conditions, please contact us at arilindra21@gmail.com. We will respond to your inquiry within 30 business days."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAFA] to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-4 flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-3">
            <img src="/risara.png" alt="Risara Logo" className="h-10 w-auto" />
          </Link>
          <div className="flex flex-1 items-center justify-end">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative py-16 bg-gradient-to-br from-[#FFF5F1] to-white">
        <div className="w-full px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#E86A33] to-[#1E40AF] mb-6">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms & Conditions
            </h1>
            <p className="text-lg text-gray-600">
              Please read these terms and conditions carefully before using Risara platform
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last Updated: January 12, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-8">

            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-[#E86A33]" />
                1. Introduction
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Welcome to Risara ("Platform", "Service", "we", "us", or "our"). By accessing or using our
                  AI-powered city intelligence platform, you agree to be bound by these Terms and Conditions
                  ("Terms"). If you disagree with any part of these terms, you may not access the service.
                </p>
                <p>
                  Risara provides real-time monitoring, AI-driven analytics, and citizen engagement tools
                  specifically designed for Jakarta's governance and public administration.
                </p>
              </div>
            </section>

            {/* Acceptance of Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-[#E86A33]" />
                2. Acceptance of Terms
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  By creating an account, accessing, or using any part of the Risara platform, you acknowledge
                  that you have read, understood, and agree to be bound by these Terms, as well as our Privacy
                  Policy.
                </p>
                <p>
                  These Terms apply to all users of the platform, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Government officials and public administrators</li>
                  <li>Policy makers and analysts</li>
                  <li>Authorized personnel with platform access</li>
                  <li>Citizens using public-facing features</li>
                </ul>
              </div>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. User Accounts and Registration
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="font-semibold text-gray-700">3.1 Account Creation</p>
                <p>
                  To access certain features of the platform, you must register for an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>

                <p className="font-semibold text-gray-700 mt-4">3.2 Account Responsibilities</p>
                <p>
                  You are responsible for all activities that occur under your account. We reserve the right
                  to suspend or terminate accounts that violate these Terms.
                </p>
              </div>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Acceptable Use Policy
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>You agree NOT to use the platform to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon intellectual property rights</li>
                  <li>Transmit harmful code (viruses, malware, etc.)</li>
                  <li>Attempt to gain unauthorized access to the platform</li>
                  <li>Interfere with or disrupt the service</li>
                  <li>Collect or harvest data without authorization</li>
                  <li>Impersonate any person or entity</li>
                  <li>Use the platform for any illegal or unauthorized purpose</li>
                </ul>
              </div>
            </section>

            {/* Data and Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Data Collection and Privacy
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our collection and use of personal information is governed by our Privacy Policy.
                  By using Risara, you consent to such processing and warrant that all data provided is accurate.
                </p>
                <p className="font-semibold text-gray-700">5.1 Data Sources</p>
                <p>
                  Risara aggregates data from publicly available sources including news media and social media platforms.
                  We process this data using AI and machine learning to generate insights.
                </p>
                <p className="font-semibold text-gray-700">5.2 Data Security</p>
                <p>
                  We implement industry-standard security measures to protect your data. However, no method of
                  transmission over the internet is 100% secure.
                </p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Intellectual Property Rights
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  The platform, including its original content, features, and functionality, is owned by Risara
                  and is protected by international copyright, trademark, and other intellectual property laws.
                </p>
                <p>
                  You may not copy, modify, distribute, sell, or lease any part of our services without
                  explicit written permission.
                </p>
              </div>
            </section>

            {/* Service Availability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Service Availability and Modifications
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We strive to maintain 99.9% uptime but do not guarantee that the platform will be
                  available at all times. We may:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Modify or discontinue features without notice</li>
                  <li>Perform scheduled maintenance</li>
                  <li>Suspend service for updates or improvements</li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Limitation of Liability
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  To the maximum extent permitted by law, Risara shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages resulting from:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use or inability to use the service</li>
                  <li>Unauthorized access to your data</li>
                  <li>Errors or omissions in content</li>
                  <li>Actions taken based on platform insights</li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      <strong>Important:</strong> AI-generated insights are provided as guidance tools only.
                      Users should verify information and exercise professional judgment before taking action
                      based on platform data.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Termination
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We may terminate or suspend your account and access to the platform immediately, without
                  prior notice, for conduct that we believe violates these Terms or is harmful to other users,
                  us, or third parties, or for any other reason.
                </p>
                <p>
                  Upon termination, your right to use the platform will immediately cease. All provisions
                  that should survive termination shall survive.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Governing Law and Jurisdiction
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the
                  Republic of Indonesia, without regard to its conflict of law provisions.
                </p>
                <p>
                  Any disputes arising from these Terms or the use of the platform shall be subject to
                  the exclusive jurisdiction of the courts in Jakarta, Indonesia.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Changes to Terms
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of any
                  material changes by posting the new Terms on this page and updating the "Last Updated" date.
                </p>
                <p>
                  Your continued use of the platform after changes become effective constitutes your
                  acceptance of the revised Terms.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Contact Information
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  If you have any questions about these Terms, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6 space-y-2">
                  <p><strong>Email:</strong> arilindra21@gmail.com</p>
                  <p><strong>Website:</strong> risara.ai</p>
                  <p><strong>Address:</strong> Jakarta, Indonesia</p>
                </div>
              </div>
            </section>

          </div>

          {/* FAQ Section */}
          <div className="mt-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm border overflow-hidden">
            {/* FAQ Header */}
            <div className="bg-gradient-to-r from-[#E86A33] to-[#1E40AF] p-8 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
              </div>
              <p className="text-white/90">
                Find quick answers to common questions about our Terms & Conditions
              </p>
            </div>

            {/* FAQ Items */}
            <div className="p-8">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="group border border-gray-200 rounded-xl overflow-hidden hover:border-[#E86A33] transition-all duration-300 hover:shadow-md"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900 pr-8 group-hover:text-[#E86A33] transition-colors">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                          openFaq === index ? 'rotate-180 text-[#E86A33]' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openFaq === index ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <div className="p-6 pt-0 text-gray-600 bg-gray-50 border-t border-gray-100">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Still have questions? */}
              <div className="mt-8 text-center p-6 bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl border border-orange-100">
                <p className="text-gray-700 mb-3">
                  <strong>Still have questions?</strong> We're here to help!
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Contact our support team for personalized assistance
                </p>
                <Link href="mailto:arilindra21@gmail.com">
                  <Button className="bg-gradient-to-r from-[#E86A33] to-[#1E40AF] hover:opacity-90 text-white">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-8 bg-gradient-to-r from-[#E86A33] to-[#1E40AF] rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Ready to Get Started?</h3>
            <p className="mb-6 opacity-90">
              By using Risara, you agree to these terms and conditions
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/login">
                <Button size="lg" className="bg-white text-[#E86A33] hover:bg-gray-100 font-semibold">
                  Accept & Continue to Platform
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white py-6">
        <div className="w-full px-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>© 2025 Risara. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-[#E86A33]">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#E86A33]">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
