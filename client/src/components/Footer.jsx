import React from 'react';

const Footer = () => {
  return (
    <footer class="bg-gray-900 text-white py-8 mt-8">
  <div class="container mx-auto flex flex-col md:flex-row justify-between items-center">
    {/* <!-- Left side: Company information --> */}
    <div class="mb-6 md:mb-0">
      <h5 class="text-lg font-bold">Courier Management System</h5>
      <p class="text-sm mt-2">
        Reliable and efficient courier services at your fingertips. 
        Delivering your parcels safely and on time.
      </p>
    </div>

    {/* <!-- Center: Navigation Links --> */}
    <div class="mb-6 md:mb-0 flex space-x-8">
      <a href="/about" class="text-sm hover:text-gray-400">About Us</a>
      <a href="/services" class="text-sm hover:text-gray-400">Services</a>
      <a href="/contact" class="text-sm hover:text-gray-400">Contact</a>
      <a href="/privacy-policy" class="text-sm hover:text-gray-400">Privacy Policy</a>
    </div>

    {/* <!-- Right side: Social Media Links --> */}
    <div class="flex space-x-6">
      <a href="#" class="p-2 bg-gray-800 rounded-full hover:text-gray-400 hover:bg-gray-700">
        <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
          {/* <!-- Facebook Icon --> */}
          <path d="M24 12a12 12 0 1 0-13.8 11.9V14.7h-2.5v-2.7h2.5v-2c0-2.5 1.5-3.8 3.7-3.8 1.1 0 2 .1 2.3.1v2.6h-1.6c-1.2 0-1.5.6-1.5 1.4v1.7h2.8l-.4 2.7h-2.4V24A12 12 0 0 0 24 12" />
        </svg>
      </a>
      <a href="#" class="p-2 bg-gray-800 rounded-full hover:text-gray-400 hover:bg-gray-700">
        <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
          {/* <!-- Twitter Icon --> */}
          <path d="M23.3 5.6c-.8.4-1.7.6-2.6.8a4.6 4.6 0 0 0 2-2.6 9.2 9.2 0 0 1-2.9 1.1 4.6 4.6 0 0 0-7.8 4.2 13.1 13.1 0 0 1-9.5-4.8 4.5 4.5 0 0 0 1.4 6 4.6 4.6 0 0 1-2.1-.6v.1a4.6 4.6 0 0 0 3.7 4.5 4.7 4.7 0 0 1-2.1.1 4.6 4.6 0 0 0 4.3 3.2A9.3 9.3 0 0 1 2 19.4 13.1 13.1 0 0 0 7.6 21c8.4 0 13-7 13-13.1v-.6a9.3 9.3 0 0 0 2.3-2.3" />
        </svg>
      </a>
      <a href="#" class="p-2 bg-gray-800 rounded-full hover:text-gray-400 hover:bg-gray-700">
        <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
          {/* <!-- Instagram Icon --> */}
          <path d="M12 2.2a9.8 9.8 0 0 0-9.8 9.8A9.8 9.8 0 0 0 12 21.8a9.8 9.8 0 0 0 9.8-9.8A9.8 9.8 0 0 0 12 2.2m6.6 4.4a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2M12 5.4a6.6 6.6 0 0 1 6.6 6.6A6.6 6.6 0 0 1 12 18.6a6.6 6.6 0 0 1-6.6-6.6A6.6 6.6 0 0 1 12 5.4m0 2.2a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8z" />
        </svg>
      </a>
    </div>
  </div>
  <div class="text-center text-sm text-gray-400 mt-4">
    &copy; 2024 Courier Management System. All rights reserved.
  </div>
</footer>

  );
};

export default Footer;
