"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, Heart, Shield } from "lucide-react";

export default function Hero() {
  const features = [
    { icon: Heart, text: "Loving Care", delay: 0.6 },
    { icon: Shield, text: "Professional Service", delay: 0.8 },
    { icon: Star, text: "5-Star Rated", delay: 1.0 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-beige-50 via-olive-50 to-warm-brown-50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle geometric patterns */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(107, 76, 59, 0.1) 2px, transparent 2px)',
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-4 h-4 bg-olive-300 rounded-full opacity-30"
        />
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-40 right-20 w-6 h-6 bg-warm-brown-300 rounded-full opacity-20"
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-40 left-20 w-3 h-3 bg-beige-400 rounded-full opacity-25"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 relative"
            >
              {/* Glow effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute inset-0 bg-gradient-to-r from-olive-400 to-warm-brown-400 rounded-full blur-xl opacity-30"
                style={{ transform: 'scale(1.2)' }}
              />
              
              {/* Main logo with enhanced styling */}
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ 
                  scale: { duration: 0.3 },
                  rotate: { duration: 0.6 }
                }}
                className="relative z-10"
              >
                <Image
                  src="/logo.png"
                  alt="The Cat Nanny Logo"
                  width={180}
                  height={180}
                  className="mx-auto lg:mx-0 rounded-full shadow-2xl border-4 border-white/20 backdrop-blur-sm"
                  style={{
                    boxShadow: '0 20px 40px rgba(107, 76, 59, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                  }}
                />
              </motion.div>
              
              {/* Floating particles around logo */}
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute inset-0 pointer-events-none"
              >
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-olive-400 rounded-full opacity-60" />
                <div className="absolute top-1/4 right-0 w-1.5 h-1.5 bg-warm-brown-400 rounded-full opacity-50" />
                <div className="absolute bottom-1/4 left-0 w-1 h-1 bg-beige-400 rounded-full opacity-40" />
                <div className="absolute bottom-0 right-1/4 w-1.5 h-1.5 bg-olive-300 rounded-full opacity-70" />
              </motion.div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl lg:text-7xl font-serif font-bold text-warm-brown-800 mb-6 leading-tight"
            >
              Professional
              <span className="block text-olive-600">Cat Care</span>
              <span className="block text-3xl lg:text-4xl text-dark-gray-600 font-sans font-normal mt-4">
                in Ottawa
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl lg:text-2xl text-dark-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Loving, reliable, and stress-free in-home cat sitting. 
              Because your cats deserve more than just care — they deserve comfort.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center lg:justify-start gap-6 mb-10"
            >
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: feature.delay }}
                    className="flex items-center space-x-2 text-dark-gray-600"
                  >
                    <IconComponent size={20} className="text-olive-500" />
                    <span className="font-medium">{feature.text}</span>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/book">
                  <button className="group bg-olive-600 hover:bg-olive-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-large hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-3">
                    <span>Book Your Visit</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-olive-600 text-olive-600 hover:bg-olive-600 hover:text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  Learn More
                </button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Main Image Container */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-olive-100 to-beige-200 rounded-3xl p-8 shadow-large">
                <div className="bg-white rounded-2xl p-6 shadow-medium">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-olive-100 rounded-full flex items-center justify-center">
                      <Heart size={24} className="text-olive-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark-gray-800">Daily Updates</h3>
                      <p className="text-sm text-dark-gray-600">Photos & messages</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-olive-500 rounded-full"></div>
                      <span className="text-dark-gray-700">Feeding & fresh water</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-olive-500 rounded-full"></div>
                      <span className="text-dark-gray-700">Litter box maintenance</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-olive-500 rounded-full"></div>
                      <span className="text-dark-gray-700">Playtime & cuddles</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-olive-500 rounded-full"></div>
                      <span className="text-dark-gray-700">Medication if needed</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating testimonial */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-large"
            >
              <div className="flex items-center space-x-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-sm text-dark-gray-600 italic">
                "Amazing care for our cats! Highly recommend!"
              </p>
              <p className="text-xs text-dark-gray-500 mt-1">- Sarah M.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-olive-600 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-olive-600 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
} 