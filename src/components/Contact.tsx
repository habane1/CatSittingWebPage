"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function Contact() {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  // Prevent hydration mismatch by only rendering form after client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("Sending...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("Failed to send. Please try again.");
      }
    } catch {
      setStatus("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "(613) 859-6723",
      description: "Call or text anytime"
    },
    {
      icon: Mail,
      title: "Email",
      details: "catnannyottawa@gmail.com",
      description: "I'll respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Service Area",
      details: "Ottawa & Surrounding Areas",
      description: "In-home cat sitting services"
    }
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-beige-50 to-olive-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.02 }}
          transition={{ duration: 1 }}
          className="absolute top-20 left-10 w-40 h-40 bg-warm-brown-300 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.02 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-olive-300 rounded-full blur-3xl"
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
            Get In Touch
          </h2>
          <p className="text-xl text-dark-gray-600 max-w-3xl mx-auto">
            Ready to give your cat the care they deserve? Let's discuss your needs and create a personalized care plan.
          </p>
          <div className="w-24 h-1 bg-olive-500 mx-auto rounded-full mt-6"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-large">
              <h3 className="text-2xl font-serif font-semibold text-warm-brown-800 mb-8">
                Send Me a Message
              </h3>
              
              {isClient ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 border-2 border-beige-200 rounded-2xl focus:border-olive-500 focus:outline-none transition-colors duration-300 bg-transparent peer"
                    placeholder=" "
                  />
                  <label className="absolute left-4 top-4 text-dark-gray-400 transition-all duration-300 peer-focus:text-olive-600 peer-focus:scale-90 peer-focus:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:-translate-y-6">
                    Your Name *
                  </label>
                </div>

                {/* Email Field */}
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 border-2 border-beige-200 rounded-2xl focus:border-olive-500 focus:outline-none transition-colors duration-300 bg-transparent peer"
                    placeholder=" "
                  />
                  <label className="absolute left-4 top-4 text-dark-gray-400 transition-all duration-300 peer-focus:text-olive-600 peer-focus:scale-90 peer-focus:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:-translate-y-6">
                    Email Address *
                  </label>
                </div>

                {/* Phone Field */}
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-beige-200 rounded-2xl focus:border-olive-500 focus:outline-none transition-colors duration-300 bg-transparent peer"
                    placeholder=" "
                  />
                  <label className="absolute left-4 top-4 text-dark-gray-400 transition-all duration-300 peer-focus:text-olive-600 peer-focus:scale-90 peer-focus:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:-translate-y-6">
                    Phone Number (Optional)
                  </label>
                </div>

                {/* Message Field */}
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-4 border-2 border-beige-200 rounded-2xl focus:border-olive-500 focus:outline-none transition-colors duration-300 bg-transparent peer resize-none"
                    placeholder=" "
                  />
                  <label className="absolute left-4 top-4 text-dark-gray-400 transition-all duration-300 peer-focus:text-olive-600 peer-focus:scale-90 peer-focus:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-90 peer-[:not(:placeholder-shown)]:-translate-y-6">
                    Your Message *
                  </label>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-olive-600 hover:bg-olive-700 disabled:bg-olive-400 text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-medium hover:shadow-large transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>

                {/* Status Message */}
                {status && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center space-x-3 p-4 rounded-2xl ${
                      status.includes("successfully") 
                        ? "bg-green-50 text-green-700 border border-green-200" 
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {status.includes("successfully") ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <AlertCircle size={20} className="text-red-600" />
                    )}
                    <span className="text-sm font-medium">{status}</span>
                  </motion.div>
                )}
              </form>
              ) : (
                <div className="space-y-6">
                  <div className="h-16 bg-gray-100 rounded-2xl animate-pulse"></div>
                  <div className="h-16 bg-gray-100 rounded-2xl animate-pulse"></div>
                  <div className="h-16 bg-gray-100 rounded-2xl animate-pulse"></div>
                  <div className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
                  <div className="h-16 bg-gray-100 rounded-2xl animate-pulse"></div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Contact Info Cards */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border border-beige-200 hover:border-olive-200">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-olive-100 rounded-xl flex items-center justify-center group-hover:bg-olive-200 transition-colors duration-300">
                          <info.icon size={24} className="text-olive-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-warm-brown-700 mb-1 group-hover:text-warm-brown-800 transition-colors">
                          {info.title}
                        </h4>
                        <p className="text-lg font-medium text-dark-gray-800 mb-1">
                          {info.details}
                        </p>
                        <p className="text-sm text-dark-gray-500">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-olive-600 to-warm-brown-600 rounded-3xl p-8 text-white shadow-large"
            >
              <h4 className="text-xl font-serif font-semibold mb-4">
                Why Choose The Cat Nanny?
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Years of experience with cats of all personalities</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Daily updates with photos and detailed reports</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Flexible scheduling to meet your needs</span>
                </li>
              </ul>
            </motion.div>

            {/* Response Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <p className="text-dark-gray-600">
                  <span className="font-semibold text-olive-600">Quick Response:</span> I typically respond to all inquiries within 2-4 hours during business hours.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}