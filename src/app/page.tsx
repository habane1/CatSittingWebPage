"use client";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import FAQ from "../components/FAQ";
import Contact from "../components/Contact";
import { motion } from "framer-motion";
import { Heart, Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";

export default function Home() {
  return (
    <main className="bg-beige-50 text-dark-gray-800 min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Sections */}
      <About />
      <Services />
      <FAQ />
      <Contact />

      {/* Footer */}
      <footer className="bg-gradient-to-r from-warm-brown-800 to-warm-brown-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.05 }}
            transition={{ duration: 1 }}
            className="absolute top-10 right-10 w-32 h-32 bg-olive-300 rounded-full blur-2xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.05 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute bottom-10 left-10 w-24 h-24 bg-beige-300 rounded-full blur-2xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-olive-100 rounded-full flex items-center justify-center">
                  <Heart size={24} className="text-olive-600" />
                </div>
                <h3 className="text-2xl font-serif font-bold">The Cat Nanny</h3>
              </div>
              <p className="text-beige-200 mb-6 max-w-md leading-relaxed">
                Professional, loving, and reliable in-home cat sitting services in Ottawa. 
                Your cats deserve the best care, and that's exactly what we provide.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-olive-600 hover:bg-olive-700 rounded-full flex items-center justify-center transition-colors duration-300"
                >
                  <Facebook size={20} />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-olive-600 hover:bg-olive-700 rounded-full flex items-center justify-center transition-colors duration-300"
                >
                  <Instagram size={20} />
                </motion.a>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <motion.a
                    href="#about"
                    whileHover={{ x: 5 }}
                    className="text-beige-200 hover:text-white transition-colors duration-300"
                  >
                    About Us
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#services"
                    whileHover={{ x: 5 }}
                    className="text-beige-200 hover:text-white transition-colors duration-300"
                  >
                    Our Services
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#faq"
                    whileHover={{ x: 5 }}
                    className="text-beige-200 hover:text-white transition-colors duration-300"
                  >
                    FAQ
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="#contact"
                    whileHover={{ x: 5 }}
                    className="text-beige-200 hover:text-white transition-colors duration-300"
                  >
                    Contact
                  </motion.a>
                </li>
                <li>
                  <motion.a
                    href="/book"
                    whileHover={{ x: 5 }}
                    className="text-beige-200 hover:text-white transition-colors duration-300"
                  >
                    Book Now
                  </motion.a>
                </li>
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone size={18} className="text-olive-400" />
                  <span className="text-beige-200">(613) 859-6723</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail size={18} className="text-olive-400" />
                  <span className="text-beige-200">catnannyottawa@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin size={18} className="text-olive-400" />
                  <span className="text-beige-200">Ottawa, ON</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="border-t border-warm-brown-700 mt-12 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-beige-300 text-sm">
                © {new Date().getFullYear()} The Cat Nanny — All Rights Reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-beige-300 hover:text-white text-sm transition-colors duration-300">
                  Privacy Policy
                </a>
                <a href="#" className="text-beige-300 hover:text-white text-sm transition-colors duration-300">
                  Terms of Service
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </main>
  );
}
