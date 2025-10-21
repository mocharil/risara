"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Card } from "@/components/ui/card";
import { HelpCircle, ChevronDown } from 'lucide-react';

import ProductShowcase from './product-showcase';
import AboutSection from './about-section';
import HeroSection from './hero-section'

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Apa itu Risara?",
      answer: "Risara adalah platform AI-powered city intelligence yang dirancang khusus untuk Jakarta. Platform ini menyediakan real-time monitoring, AI-driven analytics, dan citizen engagement tools untuk mendukung pemerintahan dan administrasi publik yang lebih efektif."
    },
    {
      question: "Siapa yang dapat menggunakan Risara?",
      answer: "Risara dirancang untuk pejabat pemerintah, pembuat kebijakan, analis, dan personel yang berwenang dengan akses platform. Platform ini juga menyediakan fitur publik untuk keterlibatan warga dalam governance."
    },
    {
      question: "Data apa saja yang dianalisis oleh Risara?",
      answer: "Risara mengumpulkan dan menganalisis data dari berbagai sumber publik termasuk media berita, platform media sosial (TikTok, Facebook, Instagram), portal data terbuka pemerintah, dan forum publik. Semua data diproses menggunakan AI untuk menghasilkan insights yang actionable."
    },
    {
      question: "Bagaimana AI membantu dalam platform Risara?",
      answer: "AI kami menganalisis data real-time untuk mengidentifikasi tren, sentiment publik, root cause analysis dari isu-isu kota, dan memberikan rekomendasi berbasis data. Teknologi machine learning kami terus belajar untuk memberikan insights yang lebih akurat setiap harinya."
    },
    {
      question: "Apakah Risara gratis untuk digunakan?",
      answer: "Risara adalah platform yang dirancang khusus untuk kebutuhan governance Jakarta. Untuk informasi mengenai akses dan pricing, silakan hubungi kami di arilindra21@gmail.com untuk membahas kebutuhan organisasi Anda."
    },
    {
      question: "Seberapa akurat AI insights dari Risara?",
      answer: "AI insights kami dihasilkan menggunakan teknologi machine learning terkini dengan akurasi tinggi. Namun, kami selalu merekomendasikan pengguna untuk memverifikasi informasi dan menggunakan professional judgment sebelum mengambil keputusan berdasarkan data platform."
    },
    {
      question: "Bagaimana cara memulai menggunakan Risara?",
      answer: "Untuk mulai menggunakan Risara, klik tombol 'Get Started' di halaman ini untuk membuat akun. Setelah registrasi, Anda dapat mengakses dashboard dan berbagai fitur analytics yang tersedia. Tim kami siap membantu onboarding process Anda."
    },
    {
      question: "Apakah data saya aman di Risara?",
      answer: "Keamanan data adalah prioritas utama kami. Risara menggunakan enkripsi TLS/SSL untuk data in transit, kontrol akses berbasis role, dan monitoring keamanan 24/7. Kami mematuhi standar keamanan industri dan regulasi perlindungan data Indonesia."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-4 flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Link href="/" className="mr-6 flex items-center space-x-3">
              <img
                src="/risara.png"
                alt="Risara Logo"
                className="h-10 w-auto"
              />
            </Link>
            <NavigationMenu className="hidden md:block">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <button
                    onClick={() => {
                      const element = document.getElementById('hero-section');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={navigationMenuTriggerStyle() + " cursor-pointer"}
                  >
                    Home
                  </button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <button
                    onClick={() => {
                      const element = document.getElementById('about-section');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={navigationMenuTriggerStyle() + " cursor-pointer"}
                  >
                    About
                  </button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <button
                    onClick={() => {
                      const element = document.getElementById('product-showcase');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={navigationMenuTriggerStyle() + " cursor-pointer"}
                  >
                    Features
                  </button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <button
                    onClick={() => {
                      const element = document.getElementById('faq-section');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={navigationMenuTriggerStyle() + " cursor-pointer"}
                  >
                    FAQ
                  </button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost">
                  Login
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-[#E86A33] hover:bg-[#D15A2B] text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div id="hero-section">
        <HeroSection/>
      </div>

      <div id="about-section">
        <AboutSection />
      </div>

      <div id="product-showcase">
        <ProductShowcase />
      </div>

      {/* FAQ Section */}
      <section id="faq-section" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* FAQ Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#E86A33] to-[#1E40AF] mb-6">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan umum seputar Risara dan bagaimana platform kami dapat membantu governance Jakarta
            </p>
          </div>

          {/* FAQ Grid */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="group border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-[#E86A33] transition-all duration-300 hover:shadow-lg bg-white"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-lg md:text-xl text-gray-900 pr-8 group-hover:text-[#E86A33] transition-colors">
                      {faq.question}
                    </span>
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#E86A33] flex items-center justify-center transition-all duration-300">
                      <ChevronDown
                        className={`h-5 w-5 text-gray-600 group-hover:text-white transition-all duration-300 ${
                          openFaq === index ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === index ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="p-6 md:p-8 pt-0 text-gray-600 leading-relaxed bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Box */}
            <div className="mt-12 p-8 bg-gradient-to-br from-[#FFF5F1] to-white rounded-2xl border-2 border-[#E86A33]/20 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Masih ada pertanyaan?
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Tim kami siap membantu Anda memahami lebih lanjut tentang Risara dan bagaimana platform kami dapat mendukung kebutuhan governance Anda
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="mailto:arilindra21@gmail.com">
                  <Button size="lg" className="bg-gradient-to-r from-[#E86A33] to-[#1E40AF] hover:opacity-90 text-white">
                    Hubungi Kami
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="border-2 border-[#E86A33] text-[#E86A33] hover:bg-[#E86A33] hover:text-white">
                    Coba Platform
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Inspired by EDBROAD Design */}
      <footer className="bg-[#0A0A0A] text-white">
        {/* Main Footer Content */}
        <div className="w-full px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              {/* Left Section - Brand */}
              <div className="md:col-span-5">
                <div className="mb-6">
                  <img
                    src="/risara.png"
                    alt="Risara Logo"
                    className="h-12 w-auto mb-4 brightness-0 invert"
                  />
                  <p className="text-gray-400 text-base leading-relaxed max-w-md">
                    Expand your governance horizons, immerse yourself in real-time insights,
                    and gain world-class intelligence that transcends boundaries
                  </p>
                </div>

                {/* Copyright */}
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-8">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>2025 All Rights Reserved. Designed by Aril Indra Permana</span>
                </div>
              </div>

              {/* Right Section - Links in Columns */}
              <div className="md:col-span-7">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {/* Privacy & Policies */}
                  <div>
                    <h4 className="font-semibold text-white mb-4 text-sm">Privacy & Policies</h4>
                    <ul className="space-y-3">
                      <li>
                        <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                          Terms & Conditions
                        </Link>
                      </li>
                      <li>
                        <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                          Privacy Policy
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Company */}
                  <div>
                    <h4 className="font-semibold text-white mb-4 text-sm">Company</h4>
                    <ul className="space-y-3">
                      <li>
                        <a href="#about-section" className="text-gray-400 hover:text-white transition-colors text-sm">
                          About Us
                        </a>
                      </li>
                      <li>
                        <a href="https://github.com/Mocharil" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">
                          Careers
                        </a>
                      </li>
                      <li>
                        <a href="#faq-section" onClick={(e) => {
                          e.preventDefault();
                          const element = document.getElementById('faq-section');
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }} className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">
                          FAQs
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Services */}
                  <div>
                    <h4 className="font-semibold text-white mb-4 text-sm">Services</h4>
                    <ul className="space-y-3">
                      <li>
                        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link href="/analytics" className="text-gray-400 hover:text-white transition-colors text-sm">
                          Analytics
                        </Link>
                      </li>
                      <li>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                          AI Insights
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Social Media */}
        <div className="border-t border-gray-800">
          <div className="w-full px-6 py-6">
            <div className="max-w-7xl mx-auto flex justify-center md:justify-end">
              <div className="flex items-center gap-4">
                <a
                  href="https://www.instagram.com/moch_ariel/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors group"
                >
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>

                <a
                  href="https://www.linkedin.com/in/moch-aril-indra-permana-52887b138/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors group"
                >
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>

                <a
                  href="https://wa.me/6282118454945"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors group"
                >
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>

                <a
                  href="https://github.com/Mocharil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors group"
                >
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};



const NewsCard = ({ 
  category, 
  title, 
  description, 
  date 
}: {
  category: string;
  title: string;
  description: string;
  date: string;
}) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-2 mb-3">
        <span className="bg-[#FFF1EC] text-[#E86A33] text-sm px-3 py-1 rounded-full">
          {category}
        </span>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  );
};

const TrendingTopic = ({ 
  number, 
  topic, 
  count 
}: {
  number: string;
  topic: string;
  count: string;
}) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center space-x-3">
        <span className="text-gray-500">#{number}</span>
        <span className="font-medium">{topic}</span>
      </div>
      <span className="text-sm text-gray-500">{count}</span>
    </div>
  );
};

export default LandingPage;