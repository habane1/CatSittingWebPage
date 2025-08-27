"use client";
import { useState, useEffect, Suspense } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Users, User, FileText, MessageSquare, CheckCircle, X, Cat, AlertTriangle, AlertCircle, Phone, ArrowLeft, MapPin } from "lucide-react";

function BookingFormContent() {
  const [dates, setDates] = useState<Date[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [catCount, setCatCount] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  
  // Validation states
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  const searchParams = useSearchParams();

  // Service pricing configuration
  const servicePricing = {
    "Standard Visit": { basePrice: 25, duration: "30 minutes" },
    "Extended Visit": { basePrice: 35, duration: "45 minutes" },
    "Vet Appointment": { basePrice: 75, duration: "Transport & Care" }
  };

  // Calculate total price including cat count
  const calculatePrice = () => {
    if (!selectedService || !servicePricing[selectedService as keyof typeof servicePricing]) return 0;
    const basePrice = servicePricing[selectedService as keyof typeof servicePricing].basePrice;
    const additionalCats = Math.max(0, catCount - 2);
    const additionalCost = additionalCats * 5;
    return basePrice + additionalCost;
  };

  const totalPrice = calculatePrice();
  const additionalCats = Math.max(0, catCount - 2);
  const additionalCost = additionalCats * 5;

  // Prevent hydration mismatch by only rendering form after client-side hydration
  useEffect(() => {
    setIsClient(true);
    
    // Get service from URL parameter
    const serviceFromUrl = searchParams.get('service');
    if (serviceFromUrl) {
      setSelectedService(serviceFromUrl);
    }
  }, [searchParams]);

  const services = [
    "Standard Visit",
    "Extended Visit", 
    "Vet Appointment"
  ];

  // Validation function
  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!name.trim()) {
      errors.name = "Please enter your name";
    }

    if (!email.trim()) {
      errors.email = "Please enter your email address";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!phone.trim()) {
      errors.phone = "Please enter your phone number";
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!address.trim()) {
      errors.address = "Please enter your address";
    }

    if (!selectedService) {
      errors.service = "Please select a service";
    }

    if (dates.length === 0) {
      errors.dates = "Please select at least one date";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Clear validation error when user starts typing
  const clearValidationError = (field: string) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          instructions,
          dates: dates.map((d) => d.toISOString().split("T")[0]),
          notes,
          service: selectedService,
          catCount,
          totalPrice,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        setErrorMessage("Server error. Please try again later.");
        setShowErrorModal(true);
        return;
      }

      if (!res.ok) {
        setErrorMessage(data?.error || "Failed to submit booking");
        setShowErrorModal(true);
        return;
      }

      // Store booking details for success modal
      setBookingDetails({
        name,
        email,
        phone,
        service: selectedService,
        catCount,
        totalPrice,
        dates: dates.map((d) => d.toISOString().split("T")[0]),
        instructions,
        notes
      });

      // Show success modal
      setShowSuccessModal(true);

      // Reset form and validation
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setInstructions("");
      setDates([]);
      setNotes("");
      setSelectedService("");
      setCatCount(1);
      setValidationErrors({});
    } catch (err) {
      console.error("Error creating booking:", err);
      setErrorMessage("Something went wrong. Please try again.");
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  // 📌 Helpers
  function selectWeek() {
    const today = new Date();
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      week.push(d);
    }
    setDates(week);
    clearValidationError('dates');
  }

  function selectMonth() {
    const today = new Date();
    const month: Date[] = [];
    const year = today.getFullYear();
    const monthIndex = today.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    for (let i = today.getDate(); i <= daysInMonth; i++) {
      month.push(new Date(year, monthIndex, i));
    }
    setDates(month);
    clearValidationError('dates');
  }

  function clearDates() {
    setDates([]);
  }

  if (!isClient) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-gradient-to-br from-olive-100 to-warm-brown-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Calendar size={32} className="text-olive-600" />
        </div>
        <p className="text-xl text-dark-gray-600">Loading booking form...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 to-olive-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            {/* Back to Home Button - Top Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="absolute top-4 right-4 sm:top-8 sm:right-8"
            >
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-dark-gray-600 hover:text-dark-gray-800 bg-white/80 hover:bg-white shadow-soft hover:shadow-medium transition-all duration-300 backdrop-blur-sm"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-olive-100 to-warm-brown-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Calendar size={32} className="text-olive-600" />
            </motion.div>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-warm-brown-800 mb-4">
              Book Your Cat Sitting
            </h1>
            <p className="text-xl text-dark-gray-600 max-w-2xl mx-auto">
              Let&apos;s create a personalized care plan for your feline friends. Fill out the form below and we&apos;ll get back to you within 24 hours.
            </p>
            <div className="w-24 h-1 bg-olive-500 mx-auto rounded-full mt-6"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-3xl p-8 shadow-soft"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-olive-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-olive-600" />
                </div>
                <h2 className="text-2xl font-serif font-semibold text-warm-brown-800">Personal Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-dark-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      clearValidationError('name');
                    }}
                    required
                    className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-300 bg-beige-50 ${
                      validationErrors.name ? 'border-red-300 focus:ring-red-500' : 'border-beige-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  <AnimatePresence>
                    {validationErrors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm mt-1 flex items-center"
                      >
                        <AlertCircle size={14} className="mr-1" />
                        {validationErrors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearValidationError('email');
                    }}
                    required
                    className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-300 bg-beige-50 ${
                      validationErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-beige-300'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  <AnimatePresence>
                    {validationErrors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm mt-1 flex items-center"
                      >
                        <AlertCircle size={14} className="mr-1" />
                        {validationErrors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-dark-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        clearValidationError('phone');
                      }}
                      required
                      className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-300 bg-beige-50 ${
                        validationErrors.phone ? 'border-red-300 focus:ring-red-500' : 'border-beige-300'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <AnimatePresence>
                    {validationErrors.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm mt-1 flex items-center"
                      >
                        <AlertCircle size={14} className="mr-1" />
                        {validationErrors.phone}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark-gray-700 mb-2">
                    Home Address *
                  </label>
                  <div className="relative">
                    <MapPin size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-gray-400" />
                    <input
                      type="text"
                      placeholder="123 Main St, Unit #, Ottawa, ON"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        clearValidationError('address');
                      }}
                      required
                      className={`w-full pl-12 pr-4 py-3 border rounded-2xl focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-300 bg-beige-50 ${
                        validationErrors.address ? 'border-red-300 focus:ring-red-500' : 'border-beige-300'
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {validationErrors.address && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm mt-1 flex items-center"
                      >
                        <AlertCircle size={14} className="mr-1" />
                        {validationErrors.address}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Service Selection Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-3xl p-8 shadow-soft"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-warm-brown-100 rounded-full flex items-center justify-center">
                  <Clock size={20} className="text-warm-brown-600" />
                </div>
                <h2 className="text-2xl font-serif font-semibold text-warm-brown-800">Service Details</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-dark-gray-700 mb-2">
                    Service Type *
                  </label>
                  <select 
                    value={selectedService} 
                    onChange={(e) => {
                      setSelectedService(e.target.value);
                      clearValidationError('service');
                    }}
                    required
                    className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-300 bg-beige-50 ${
                      validationErrors.service ? 'border-red-300 focus:ring-red-500' : 'border-beige-300'
                    }`}
                  >
                    <option value="">Select a service...</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service} - ${servicePricing[service as keyof typeof servicePricing]?.basePrice}
                      </option>
                    ))}
                  </select>
                  <AnimatePresence>
                    {validationErrors.service && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm mt-1 flex items-center"
                      >
                        <AlertCircle size={14} className="mr-1" />
                        {validationErrors.service}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark-gray-700 mb-2">
                    Number of Cats *
                  </label>
                  <div className="relative">
                    <Users size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-gray-400" />
                    <select
                      value={catCount}
                      onChange={(e) => setCatCount(Number(e.target.value))}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-beige-300 rounded-2xl focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-300 bg-beige-50"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'cat' : 'cats'}
                        </option>
                      ))}
                    </select>
                  </div>
                  {additionalCats > 0 && (
                    <p className="text-sm text-olive-600 mt-2">
                      +${additionalCost} for {additionalCats} additional cat{additionalCats > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>

              {/* Price Display */}
              {selectedService && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 bg-gradient-to-r from-olive-50 to-warm-brown-50 rounded-2xl p-6 border border-olive-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-warm-brown-800 mb-1">
                        {selectedService}
                      </h3>
                      <p className="text-dark-gray-600">
                        {servicePricing[selectedService as keyof typeof servicePricing]?.duration} • {catCount} cat{catCount > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-warm-brown-700">
                        ${totalPrice}
                      </div>
                      <div className="text-sm text-dark-gray-500">per visit</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Date Selection Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-3xl p-8 shadow-soft"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-olive-100 rounded-full flex items-center justify-center">
                  <Calendar size={20} className="text-olive-600" />
                </div>
                <h2 className="text-2xl font-serif font-semibold text-warm-brown-800">Select Dates</h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <DayPicker
                    mode="multiple"
                    selected={dates}
                    onSelect={(newDates) => {
                      setDates(newDates || []);
                      clearValidationError('dates');
                    }}
                    fromDate={new Date()}
                    className="border border-beige-300 rounded-2xl p-4 bg-beige-50"
                  />

                  {/* Quick Select Buttons */}
                  <div className="mt-6 space-y-3">
                    <button
                      type="button"
                      onClick={selectWeek}
                      className="w-full py-3 px-4 bg-olive-100 hover:bg-olive-200 text-olive-700 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      📆 Select This Week
                    </button>
                    <button
                      type="button"
                      onClick={selectMonth}
                      className="w-full py-3 px-4 bg-warm-brown-100 hover:bg-warm-brown-200 text-warm-brown-700 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      🗓 Select Rest of Month
                    </button>
                    <button
                      type="button"
                      onClick={clearDates}
                      className="w-full py-3 px-4 bg-beige-200 hover:bg-beige-300 text-dark-gray-700 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      🔄 Clear All Dates
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-warm-brown-800 mb-4">Selected Dates</h3>
                  {dates.length === 0 ? (
                    <div className="text-center py-8 text-dark-gray-500">
                      <Calendar size={48} className="mx-auto mb-4 text-beige-400" />
                      <p>No dates selected yet</p>
                      <p className="text-sm">Click on the calendar to select your preferred dates</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {dates.map((d) => (
                        <motion.div
                          key={d.toISOString()}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-3 bg-beige-50 rounded-xl border border-beige-200"
                        >
                          <span className="text-dark-gray-700 font-medium">
                            {d.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                          <button
                            type="button"
                            onClick={() => setDates(dates.filter((day) => day.getTime() !== d.getTime()))}
                            className="text-red-500 hover:text-red-700 transition-colors duration-300"
                          >
                            ❌
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Date validation error */}
              <AnimatePresence>
                {validationErrors.dates && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <p className="text-red-600 text-sm flex items-center">
                      <AlertCircle size={16} className="mr-2" />
                      {validationErrors.dates}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Additional Information Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-3xl p-8 shadow-soft"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-warm-brown-100 rounded-full flex items-center justify-center">
                  <FileText size={20} className="text-warm-brown-600" />
                </div>
                <h2 className="text-2xl font-serif font-semibold text-warm-brown-800">Additional Information</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-dark-gray-700 mb-2">
                    Entrance Instructions
                  </label>
                  <textarea
                    placeholder="e.g., side door code, buzzer #, key location, building access instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-beige-300 rounded-2xl focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-300 bg-beige-50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dark-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    placeholder="Anything else we should know about your cat(s), special care instructions, medical conditions, etc."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-beige-300 rounded-2xl focus:ring-2 focus:ring-olive-500 focus:border-transparent transition-all duration-300 bg-beige-50 resize-none"
                  />
                </div>
              </div>
            </motion.div>

            {/* Submit and Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-center space-y-4"
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  isSubmitting
                    ? 'bg-dark-gray-300 text-dark-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-olive-600 to-warm-brown-600 hover:from-olive-700 hover:to-warm-brown-700 text-white shadow-medium hover:shadow-large'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <MessageSquare size={20} />
                    <span>Send Booking Request</span>
                  </div>
                )}
              </button>
              
              {/* Back to Home Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => window.location.href = '/'}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium text-dark-gray-600 hover:text-dark-gray-800 bg-beige-100 hover:bg-beige-200 transition-all duration-300 transform hover:scale-105"
                >
                  <ArrowLeft size={18} />
                  <span>Back to Home</span>
                </button>
              </div>
            </motion.div>
          </form>
        </motion.div>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowSuccessModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Success Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", damping: 15, stiffness: 300 }}
                    className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle size={48} className="text-green-600" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-3xl font-serif font-bold text-warm-brown-800 mb-3">
                      Booking Request Sent! 🎉
                    </h2>
                    <p className="text-lg text-dark-gray-600">
                      Thank you for choosing our cat sitting services!
                    </p>
                  </motion.div>
                </div>

                {/* Booking Summary */}
                {bookingDetails && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-olive-50 to-warm-brown-50 rounded-2xl p-6 mb-6 border border-olive-200"
                  >
                    <h3 className="text-xl font-semibold text-warm-brown-800 mb-4 flex items-center">
                      <Cat size={20} className="mr-2" />
                      Booking Summary
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-dark-gray-600">Service:</span>
                        <span className="ml-2 font-medium text-dark-gray-800">{bookingDetails.service}</span>
                      </div>
                      <div>
                        <span className="text-dark-gray-600">Cats:</span>
                        <span className="ml-2 font-medium text-dark-gray-800">{bookingDetails.catCount}</span>
                      </div>
                      <div>
                        <span className="text-dark-gray-600">Total Price:</span>
                        <span className="ml-2 font-medium text-olive-600">${bookingDetails.totalPrice}</span>
                      </div>
                      <div>
                        <span className="text-dark-gray-600">Dates:</span>
                        <span className="ml-2 font-medium text-dark-gray-800">{bookingDetails.dates.length}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Next Steps */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-200"
                >
                  <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                    <Clock size={18} className="mr-2" />
                    What Happens Next?
                  </h3>
                  <div className="space-y-2 text-blue-700 text-sm">
                    <p>✅ We&apos;ll review your request within 24 hours</p>
                    <p>📧 You&apos;ll receive a confirmation email with next steps</p>
                    <p>🐱 We&apos;ll contact you to discuss your cat&apos;s specific needs</p>
                    <p>💳 Payment details will be provided upon approval</p>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="flex-1 bg-gradient-to-r from-olive-600 to-warm-brown-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-olive-700 hover:to-warm-brown-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Continue Browsing
                  </button>
                  <button
                    onClick={() => {
                      setShowSuccessModal(false);
                      window.location.href = '/';
                    }}
                    className="flex-1 bg-beige-100 text-dark-gray-700 py-3 px-6 rounded-2xl font-semibold hover:bg-beige-200 transition-all duration-300"
                  >
                    Return Home
                  </button>
                </motion.div>

                {/* Close Button */}
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 }}
                  onClick={() => setShowSuccessModal(false)}
                  className="absolute top-4 right-4 p-2 text-dark-gray-400 hover:text-dark-gray-600 hover:bg-beige-100 rounded-full transition-all duration-300"
                >
                  <X size={20} />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Modal */}
        <AnimatePresence>
          {showErrorModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowErrorModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Error Header */}
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", damping: 15, stiffness: 300 }}
                    className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <AlertTriangle size={40} className="text-red-600" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-2xl font-serif font-bold text-dark-gray-800 mb-2">
                      Oops! Something went wrong
                    </h2>
                    <p className="text-dark-gray-600">
                      {errorMessage}
                    </p>
                  </motion.div>
                </div>

                {/* Helpful Information */}
                {errorMessage.includes("past dates") && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-orange-50 rounded-2xl p-4 mb-6 border border-orange-200"
                  >
                    <h3 className="text-sm font-semibold text-orange-800 mb-2 flex items-center">
                      <AlertCircle size={16} className="mr-2" />
                      Date Selection Help
                    </h3>
                    <div className="space-y-1 text-orange-700 text-sm">
                      <p>• Please select dates from today onwards</p>
                      <p>• Use the &quot;Select This Week&quot; button for quick selection</p>
                      <p>• You can clear and reselect dates if needed</p>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col gap-3"
                >
                  <button
                    onClick={() => setShowErrorModal(false)}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-2xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Got it, I&apos;ll fix it
                  </button>
                  {errorMessage.includes("past dates") && (
                    <button
                      onClick={() => {
                        setShowErrorModal(false);
                        clearDates();
                      }}
                      className="w-full bg-beige-100 text-dark-gray-700 py-3 px-6 rounded-2xl font-semibold hover:bg-beige-200 transition-all duration-300"
                    >
                      Clear All Dates
                    </button>
                  )}
                </motion.div>

                {/* Close Button */}
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => setShowErrorModal(false)}
                  className="absolute top-4 right-4 p-2 text-dark-gray-400 hover:text-dark-gray-600 hover:bg-beige-100 rounded-full transition-all duration-300"
                >
                  <X size={20} />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function BookingForm() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-beige-50 to-olive-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-olive-100 to-warm-brown-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Calendar size={32} className="text-olive-600" />
          </div>
          <p className="text-xl text-dark-gray-600">Loading booking form...</p>
        </div>
      </div>
    }>
      <BookingFormContent />
    </Suspense>
  );
}
