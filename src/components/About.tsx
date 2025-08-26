"use client";

import { motion } from "framer-motion";
import { Heart, Home, Clock, Award } from "lucide-react";

export default function About() {
  const highlights = [
    {
      icon: Heart,
      title: "Passionate Care",
      description: "Years of experience caring for cats of all personalities and needs."
    },
    {
      icon: Home,
      title: "In-Home Service",
      description: "Cats stay in their familiar environment, reducing stress and anxiety."
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Available for daily visits and emergency care."
    },
    {
      icon: Award,
      title: "Professional Standards",
      description: "Fully insured, bonded, and committed to exceptional service."
    }
  ];

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.02 }}
          transition={{ duration: 1 }}
          className="absolute top-20 right-10 w-64 h-64 bg-olive-300 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.02 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-20 left-10 w-48 h-48 bg-warm-brown-300 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-warm-brown-800 mb-6">
            About The Cat Nanny
          </h2>
          <div className="w-24 h-1 bg-olive-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-2xl lg:text-3xl font-serif font-semibold text-warm-brown-700"
              >
                Dedicated Cat Care Professional
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="text-lg text-dark-gray-600 leading-relaxed"
              >
                Hi, my name is Lorissa and I'm a dedicated cat lover based in Ottawa with years of experience
                caring for cats of all personalities. Whether your feline friend is playful,
                shy, senior, or needs a little extra attention, I provide safe, calm,
                and loving care while you're away.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="text-lg text-dark-gray-600 leading-relaxed"
              >
                My philosophy is simple: cats are happiest at home. That's why I come to you —
                to keep their routines intact, stress levels low, and tails happily flicking.
                Your cats deserve more than just care — they deserve comfort, attention, and love.
              </motion.p>
            </div>
          </motion.div>

          {/* Right Column - Highlights Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-beige-50 to-olive-50 p-6 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border border-beige-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-olive-100 rounded-xl flex items-center justify-center group-hover:bg-olive-200 transition-colors duration-300">
                        <highlight.icon size={24} className="text-olive-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-warm-brown-700 mb-2 group-hover:text-warm-brown-800 transition-colors">
                        {highlight.title}
                      </h4>
                      <p className="text-sm text-dark-gray-600 leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-olive-50 to-beige-50 rounded-3xl p-8 lg:p-12 shadow-soft">
            <h3 className="text-2xl lg:text-3xl font-serif font-semibold text-warm-brown-700 mb-4">
              Ready to Give Your Cat the Care They Deserve?
            </h3>
            <p className="text-lg text-dark-gray-600 mb-8 max-w-2xl mx-auto">
              Let's discuss your cat's needs and create a personalized care plan that keeps them happy and healthy while you're away.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-olive-600 hover:bg-olive-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-medium hover:shadow-large transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
  