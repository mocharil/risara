"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database, Bell, Globe, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "What personal information does Risara collect?",
      answer: "We collect information you provide (name, email, job title, organization), automatically collected data (usage patterns, device info, IP address), and public data from news/social media sources. We never collect private social media data or sell your information."
    },
    {
      question: "How can I request deletion of my data?",
      answer: "Contact us at arilindra21@gmail.com to request account deletion. We will process your request within 30 days and delete or anonymize your personal information within 90 days, unless legally required to retain it."
    },
    {
      question: "Does Risara sell my personal information?",
      answer: "No. We do not sell or rent your personal information to third parties. We only share data with your consent, with service providers who help operate the platform, or when required by law."
    },
    {
      question: "How is my data protected?",
      answer: "We use industry-standard security measures including TLS/SSL encryption for data in transit, encryption for sensitive data at rest, role-based access controls, and 24/7 security monitoring. However, no internet transmission is 100% secure."
    },
    {
      question: "Can I access my personal data?",
      answer: "Yes. You have the right to request a copy of the personal information we hold about you. Contact us at arilindra21@gmail.com to exercise this right, and we'll respond within 30 days."
    },
    {
      question: "How long do you keep my data?",
      answer: "We retain your data as long as necessary to provide services, comply with legal obligations, resolve disputes, and enforce agreements. After account deletion, data is removed or anonymized within 90 days unless legally required to retain it."
    },
    {
      question: "What cookies does Risara use?",
      answer: "We use essential cookies (required for functionality), performance cookies (to analyze usage), and functional cookies (to remember preferences). You can control cookies through your browser settings, but disabling them may affect platform functionality."
    },
    {
      question: "Is my data transferred internationally?",
      answer: "Your information may be transferred to and processed in countries outside Indonesia with different data protection laws. We ensure appropriate safeguards are in place to protect your information during international transfers."
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
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
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
                <Shield className="h-6 w-6 text-[#E86A33]" />
                1. Introduction
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Risara ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy
                  explains how we collect, use, disclose, and safeguard your information when you use our
                  AI-powered city intelligence platform.
                </p>
                <p>
                  This policy applies to all users who access or use the Risara platform, including government
                  officials, policy makers, analysts, and citizens.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Quick Summary:</strong> We collect data to provide you with real-time insights
                    and analytics. We do not sell your personal information to third parties.
                  </p>
                </div>
              </div>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="h-6 w-6 text-[#E86A33]" />
                2. Information We Collect
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="font-semibold text-gray-700">2.1 Personal Information You Provide</p>
                <p>When you register or use our platform, we may collect:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Account Information:</strong> Name, email address, password, job title, organization</li>
                  <li><strong>Profile Information:</strong> Department, role, areas of interest</li>
                  <li><strong>Communication Data:</strong> Messages, feedback, support requests</li>
                  <li><strong>Payment Information:</strong> Billing details (if applicable)</li>
                </ul>

                <p className="font-semibold text-gray-700 mt-4">2.2 Automatically Collected Information</p>
                <p>When you use our platform, we automatically collect:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Usage Data:</strong> Pages visited, features used, time spent, click patterns</li>
                  <li><strong>Device Information:</strong> IP address, browser type, device type, operating system</li>
                  <li><strong>Location Data:</strong> General location based on IP address</li>
                  <li><strong>Cookies & Similar Technologies:</strong> Session data, preferences, analytics</li>
                </ul>

                <p className="font-semibold text-gray-700 mt-4">2.3 Public Data We Aggregate</p>
                <p>
                  Risara aggregates publicly available data from various sources including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>News media websites and RSS feeds</li>
                  <li>Social media platforms (TikTok, Facebook, Instagram)</li>
                  <li>Government open data portals</li>
                  <li>Public forums and community platforms</li>
                </ul>
                <p className="text-sm italic">
                  Note: This public data is processed using AI to generate insights and analytics.
                  We do not collect private or personal social media data.
                </p>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-[#E86A33]" />
                3. How We Use Your Information
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>We use the collected information to:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Platform Operations</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Provide and maintain the service</li>
                      <li>Process your requests</li>
                      <li>Authenticate users</li>
                      <li>Manage your account</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Improvements</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Improve platform features</li>
                      <li>Develop new services</li>
                      <li>Analyze usage patterns</li>
                      <li>Fix technical issues</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Communications</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Send service updates</li>
                      <li>Respond to inquiries</li>
                      <li>Provide technical support</li>
                      <li>Send newsletters (with consent)</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Security & Legal</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Prevent fraud and abuse</li>
                      <li>Ensure platform security</li>
                      <li>Comply with legal obligations</li>
                      <li>Enforce our terms</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="h-6 w-6 text-[#E86A33]" />
                4. How We Share Your Information
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We do not sell or rent your personal information to third parties. We may share your
                  information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>With Your Consent:</strong> When you explicitly authorize us to share information
                  </li>
                  <li>
                    <strong>Service Providers:</strong> Third-party vendors who help us operate the platform
                    (hosting, analytics, email services)
                  </li>
                  <li>
                    <strong>Government Agencies:</strong> When required by law or to comply with legal processes
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets
                  </li>
                  <li>
                    <strong>Security & Legal:</strong> To protect rights, property, or safety of Risara, users,
                    or the public
                  </li>
                </ul>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <strong>Data Minimization:</strong> We only share the minimum necessary information
                    required for the specific purpose.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6 text-[#E86A33]" />
                5. Data Security
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We implement industry-standard security measures to protect your information:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Encryption</h4>
                    <p className="text-sm">
                      Data in transit is encrypted using TLS/SSL protocols. Sensitive data at rest is encrypted.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Access Control</h4>
                    <p className="text-sm">
                      Role-based access controls ensure only authorized personnel can access your data.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Monitoring</h4>
                    <p className="text-sm">
                      24/7 security monitoring and regular security audits to detect and prevent breaches.
                    </p>
                  </div>
                </div>
                <p className="text-sm italic">
                  Note: While we strive to protect your information, no method of transmission over the
                  internet is 100% secure. You should also take steps to protect your account credentials.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Your Privacy Rights
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>You have the following rights regarding your personal information:</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#E86A33] mt-2 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-700">Access:</strong> Request a copy of the personal
                      information we hold about you
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#E86A33] mt-2 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-700">Correction:</strong> Request correction of inaccurate
                      or incomplete information
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#E86A33] mt-2 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-700">Deletion:</strong> Request deletion of your personal
                      information (subject to legal obligations)
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#E86A33] mt-2 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-700">Data Portability:</strong> Request transfer of your
                      data to another service
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#E86A33] mt-2 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-700">Opt-Out:</strong> Opt-out of marketing communications
                      at any time
                    </div>
                  </div>
                </div>
                <p>
                  To exercise these rights, please contact us at: <strong>arilindra21@gmail.com</strong>
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Cookies and Tracking Technologies
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Keep you signed in</li>
                  <li>Remember your preferences</li>
                  <li>Understand how you use the platform</li>
                  <li>Improve user experience</li>
                  <li>Analyze platform performance</li>
                </ul>
                <p className="font-semibold text-gray-700">Types of Cookies We Use:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
                  <li><strong>Performance Cookies:</strong> Help us analyze platform usage</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences</li>
                </ul>
                <p>
                  You can control cookies through your browser settings. However, disabling cookies may
                  affect platform functionality.
                </p>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Data Retention
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We retain your personal information for as long as necessary to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide our services to you</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes</li>
                  <li>Enforce our agreements</li>
                </ul>
                <p>
                  When your account is deleted, we will delete or anonymize your personal information
                  within 90 days, unless required by law to retain it longer.
                </p>
              </div>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Children's Privacy
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Risara is not intended for use by individuals under the age of 18. We do not knowingly
                  collect personal information from children. If you believe we have collected information
                  from a child, please contact us immediately.
                </p>
              </div>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. International Data Transfers
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Your information may be transferred to and processed in countries other than Indonesia.
                  These countries may have different data protection laws. We ensure appropriate safeguards
                  are in place to protect your information.
                </p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="h-6 w-6 text-[#E86A33]" />
                11. Changes to This Privacy Policy
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material
                  changes by:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Posting the new policy on this page</li>
                  <li>Updating the "Last Updated" date</li>
                  <li>Sending you an email notification (for significant changes)</li>
                </ul>
                <p>
                  Your continued use of the platform after changes become effective constitutes acceptance
                  of the updated policy.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Contact Us
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  If you have questions or concerns about this Privacy Policy or our data practices,
                  please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6 space-y-2">
                  <p><strong>Email:</strong> arilindra21@gmail.com</p>
                  <p><strong>Data Protection Officer:</strong> Aril Indra Permana</p>
                  <p><strong>Website:</strong> risara.ai</p>
                  <p><strong>Address:</strong> Jakarta, Indonesia</p>
                </div>
                <p className="text-sm italic">
                  We will respond to your inquiry within 30 days.
                </p>
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
                Find quick answers to common questions about your privacy and data protection
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
                  Contact our Data Protection Officer for personalized assistance
                </p>
                <Link href="mailto:arilindra21@gmail.com">
                  <Button className="bg-gradient-to-r from-[#E86A33] to-[#1E40AF] hover:opacity-90 text-white">
                    Contact Privacy Team
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-8 bg-gradient-to-r from-[#E86A33] to-[#1E40AF] rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Your Privacy Matters</h3>
            <p className="mb-6 opacity-90">
              We're committed to protecting your data and maintaining transparency
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/login">
                <Button size="lg" className="bg-white text-[#E86A33] hover:bg-gray-100 font-semibold">
                  Continue to Platform
                </Button>
              </Link>
              <Link href="/terms">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View Terms & Conditions
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
