"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Do you stay overnight?",
    answer: "No, I do not stay overnight. I will come to your home and stay for as long as needed to care for your cat. ",
    category: "Services"
  },

  {
    question: "What if my cat is shy or hides?",
    answer: "That's totally okay! I move at their pace and use non-intrusive approaches to ensure they feel safe and respected. Many cats are initially shy, and I have plenty of experience helping them feel comfortable. I'll always respect their boundaries and let them come to me.",
    category: "Care"
  },
  {
    question: "How far in advance should I book?",
    answer: "I recommend booking at least 1–2 weeks in advance to ensure availability, especially around holidays and peak travel seasons. However, I do my best to accommodate last-minute requests when possible.",
    category: "Booking"
  },
  {
    question: "Do you charge extra for multiple cats?",
    answer: "There is no additional charge for up to 2 cats. Additional cats may have a small fee depending on the level of care needed. I'll always discuss pricing transparently during our consultation.",
    category: "Pricing"
  },
  {
    question: "What areas do you serve in Ottawa?",
    answer: "I serve most areas in Ottawa and the surrounding communities. During our initial consultation, I'll confirm if your location is within my service area and discuss any travel considerations.",
    category: "Service Area"
  },
  {
    question: "Do you provide updates during visits?",
    answer: "Yes! I provide daily updates with photos and detailed reports about your cat's well-being, activities, and any observations. You'll receive these updates via your preferred method (text, email, or app).",
    category: "Communication"
  },
  {
    question: "What happens in case of an emergency?",
    answer: "I have emergency protocols in place and will immediately contact you and your veterinarian if needed. I'm trained in basic pet first aid and will always prioritize your cat's safety and well-being.",
    category: "Safety"
  }
];

const categories = ["All", "Services", "Safety", "Care", "Booking", "Pricing", "Service Area", "Communication"];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFaqs = selectedCategory === "All" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <section id="faq" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.02 }}
          transition={{ duration: 1 }}
          className="absolute top-10 right-10 w-48 h-48 bg-olive-300 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.02 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-10 left-10 w-32 h-32 bg-warm-brown-300 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <HelpCircle size={32} className="text-olive-600" />
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-warm-brown-800">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-xl text-dark-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our cat sitting services in Ottawa.
          </p>
          <div className="w-24 h-1 bg-olive-500 mx-auto rounded-full mt-6"></div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-olive-600 text-white shadow-medium'
                  : 'bg-beige-100 text-dark-gray-600 hover:bg-beige-200'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <motion.button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full bg-gradient-to-r from-beige-50 to-olive-50 hover:from-beige-100 hover:to-olive-100 p-6 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 border border-beige-200 hover:border-olive-200"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-left text-lg font-semibold text-warm-brown-700 group-hover:text-warm-brown-800 transition-colors pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown size={24} className="text-olive-600" />
                  </motion.div>
                </div>
              </motion.button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white p-6 rounded-b-2xl shadow-soft border-t-0 border border-beige-200">
                      <p className="text-dark-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                      <div className="mt-4">
                        <span className="inline-block bg-olive-100 text-olive-700 px-3 py-1 rounded-full text-sm font-medium">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-olive-50 to-beige-50 rounded-3xl p-8 lg:p-12 shadow-soft">
            <h3 className="text-2xl lg:text-3xl font-serif font-semibold text-warm-brown-700 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-lg text-dark-gray-600 mb-8 max-w-2xl mx-auto">
              I'm here to help! Feel free to reach out with any questions about our services or to discuss your cat's specific needs.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-olive-600 hover:bg-olive-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-medium hover:shadow-large transition-all duration-300 transform hover:-translate-y-1"
            >
              Contact Me
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
  