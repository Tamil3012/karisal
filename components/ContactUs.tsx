'use client';

import { useState, FormEvent } from 'react';
import TargetCursor from './TargetCursor';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call - Replace with your actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form submitted:', formData);
      
      setSubmitStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        number: '',
        message: ''
      });
      
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Custom cursor only for this page */}
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor={true}
        parallaxOn={true}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 cursor-target">
              Get In Touch
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl cursor-target">
              We'd love to hear from you. Send us a message!
            </p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-12 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name Field */}
              <div className="cursor-target">
                <label htmlFor="name" className="block text-gray-300 text-sm font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all cursor-target"
                  placeholder="John Doe"
                />
              </div>

              {/* Email Field */}
              <div className="cursor-target">
                <label htmlFor="email" className="block text-gray-300 text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all cursor-target"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="mb-6 cursor-target">
              <label htmlFor="number" className="block text-gray-300 text-sm font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all cursor-target"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Message Field */}
            <div className="mb-6 cursor-target">
              <label htmlFor="message" className="block text-gray-300 text-sm font-semibold mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all resize-none cursor-target"
                placeholder="Tell us about your project..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-white text-black font-bold text-lg rounded-lg hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-target transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-center cursor-target">
                Message sent successfully! We'll get back to you soon.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-center cursor-target">
                Something went wrong. Please try again.
              </div>
            )}
          </form>

          {/* Additional Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="cursor-target p-6 bg-gray-800/30 rounded-lg border border-gray-700">
              <h3 className="text-white font-semibold mb-2">Email</h3>
              <p className="text-gray-400">hello@example.com</p>
            </div>
            <div className="cursor-target p-6 bg-gray-800/30 rounded-lg border border-gray-700">
              <h3 className="text-white font-semibold mb-2">Phone</h3>
              <p className="text-gray-400">+1 (555) 123-4567</p>
            </div>
            <div className="cursor-target p-6 bg-gray-800/30 rounded-lg border border-gray-700">
              <h3 className="text-white font-semibold mb-2">Location</h3>
              <p className="text-gray-400">San Francisco, CA</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
