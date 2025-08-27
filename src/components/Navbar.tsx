"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const navItems = [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <Image
              src="/logo.png"
              alt="The Cat Nanny Logo"
              width={48}
              height={48}
              className="rounded-full shadow-soft"
            />
            <Link href="/" className="text-2xl font-serif font-bold text-warm-brown-600">
              The Cat Nanny
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.href}
                whileHover={{ y: -2 }}
                onClick={() => scrollToSection(item.label.toLowerCase())}
                className="text-dark-gray-600 hover:text-olive-600 font-medium transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-olive-500 transition-all duration-300 group-hover:w-full"></span>
              </motion.button>
            ))}
            
            {/* Contact Info */}
            <div className="flex items-center space-x-4 ml-8">
              <motion.a
                href="tel:+1234567890"
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-2 text-dark-gray-600 hover:text-olive-600 transition-colors"
              >
                <Phone size={16} />
                <span className="text-sm font-medium">(613) 859-6723</span>
              </motion.a>
            </div>

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/book">
                <button className="bg-olive-600 hover:bg-olive-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-medium hover:shadow-large transition-all duration-300 transform hover:-translate-y-1">
                  Book Now
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 rounded-lg hover:bg-beige-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} className="text-warm-brown-600" /> : <Menu size={24} className="text-warm-brown-600" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/98 backdrop-blur-md border-t border-beige-200"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.label.toLowerCase())}
                  className="block w-full text-left text-lg font-medium text-dark-gray-600 hover:text-olive-600 py-3 transition-colors"
                >
                  {item.label}
                </motion.button>
              ))}
              
              <div className="pt-4 border-t border-beige-200">
                <motion.a
                  href="tel:+1234567890"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center space-x-3 text-dark-gray-600 hover:text-olive-600 py-3 transition-colors"
                >
                  <Phone size={20} />
                  <span className="font-medium">(613) 859-6723</span>
                </motion.a>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="pt-4"
                >
                  <Link href="/book">
                    <button className="w-full bg-olive-600 hover:bg-olive-700 text-white py-3 px-6 rounded-2xl font-semibold shadow-medium transition-all duration-300">
                      Book Now
                    </button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
