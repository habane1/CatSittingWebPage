"use client";

import { motion } from "framer-motion";
import { Check, Clock, Star, Shield, Heart, Car } from "lucide-react";
import { useRouter } from "next/navigation";

const services = [
  {
    title: "Standard Visit",
    duration: "30 minutes",
    price: "$25",
    per: "per visit",
    icon: Clock,
    features: [
      "Feeding & fresh water",
      "Litter box scooping",
      "Playtime & cuddles",
      "Daily updates with photos",
      "Basic health monitoring",
      "Mail collection"
    ],
    popular: false,
    color: "olive"
  },
  {
    title: "Extended Visit",
    duration: "45 minutes",
    price: "$35",
    per: "per visit",
    icon: Heart,
    features: [
      "Everything in Standard Visit",
      "Extended playtime",
      "Brushing & grooming",
      "Medication administration",
      "Plant watering",
      "Detailed daily reports"
    ],
    popular: true,
    color: "warm-brown"
  },
  {
    title: "Vet Appointment",
    duration: "Transport & Care",
    price: "$75",
    per: "per visit",
    icon: Car,
    features: [
      "Transport to vet appointments",
      "Companionship during visit",
      "Transport back home",
      "Medication pickup if needed",
      "Detailed visit report",
      "Emergency contact updates"
    ],
    popular: false,
    color: "olive"
  }
];

export default function Services() {
  const router = useRouter();

  const handleBookService = (serviceTitle: string) => {
    // Navigate to booking page with service pre-selected
    router.push(`/book?service=${encodeURIComponent(serviceTitle)}`);
  };

  return (
    <section id="services" className="py-24 bg-gradient-to-br from-beige-50 to-olive-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.03 }}
          transition={{ duration: 1 }}
          className="absolute top-10 left-1/4 w-32 h-32 bg-warm-brown-300 rounded-full blur-2xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.03 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-10 right-1/4 w-40 h-40 bg-olive-300 rounded-full blur-2xl"
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
            Our Services
          </h2>
          <p className="text-xl text-dark-gray-600 max-w-3xl mx-auto">
            Comprehensive cat care services designed to keep your feline friends happy, healthy, and comfortable in their own home.
          </p>
          <div className="w-24 h-1 bg-olive-500 mx-auto rounded-full mt-6"></div>
        </motion.div>

        {/* Main Services */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              <div className={`relative bg-white rounded-3xl p-8 shadow-soft hover:shadow-large transition-all duration-300 border-2 ${
                service.popular 
                  ? 'border-warm-brown-300 shadow-medium' 
                  : 'border-transparent hover:border-olive-200'
              }`}>
                {/* Popular Badge */}
                {service.popular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  >
                    <div className="bg-warm-brown-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-medium">
                      Most Popular
                    </div>
                  </motion.div>
                )}

                {/* Service Icon */}
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                    service.color === 'olive' ? 'bg-olive-100' : 'bg-warm-brown-100'
                  } group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon size={32} className={`${
                      service.color === 'olive' ? 'text-olive-600' : 'text-warm-brown-600'
                    }`} />
                  </div>
                  <h3 className="text-2xl font-serif font-semibold text-warm-brown-800 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-dark-gray-500 font-medium">{service.duration}</p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-4xl font-bold text-warm-brown-700">{service.price}</span>
                    <span className="text-dark-gray-500">{service.per}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + featureIndex * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-3"
                    >
                      <Check size={20} className="text-olive-500 mt-0.5 flex-shrink-0" />
                      <span className="text-dark-gray-600">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBookService(service.title)}
                  className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 ${
                    service.popular
                      ? 'bg-warm-brown-600 hover:bg-warm-brown-700 text-white shadow-medium hover:shadow-large'
                      : 'bg-olive-600 hover:bg-olive-700 text-white shadow-soft hover:shadow-medium'
                  }`}
                >
                  Book This Service
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-olive-600 to-warm-brown-600 rounded-3xl p-8 lg:p-12 text-white shadow-large">
            <h3 className="text-2xl lg:text-3xl font-serif font-semibold mb-4">
              Not Sure Which Service is Right?
            </h3>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Let's discuss your cat's specific needs and create a personalized care plan that's perfect for your situation.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-olive-600 hover:bg-beige-50 px-8 py-4 rounded-2xl font-semibold text-lg shadow-medium hover:shadow-large transition-all duration-300 transform hover:-translate-y-1"
            >
              Get a Free Consultation
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
  