import React from 'react';
import Image from 'next/image';

const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-center text-custom-8">
      <h1 className="text-5xl font-bold mb-8">About Our Organization</h1>

      {/* Mission Section */}
      <section className="mb-12 bg-gray-100 rounded-md p-14">
        <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <p className="text-xl leading-relaxed md:w-1/2">
            We are a non-profit organization dedicated to the preservation and rejuvenation of natural resources around the globe. Our mission is to empower local communities and businesses to sustainably and responsibly leverage these invaluable resources. Currently, we operate in the Bahamas, the United States, and India.
          </p>
          <Image 
            src="/images/turtle.jpg" 
            alt="Nature" 
            width={500} 
            height={300} 
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Eco-Tourism Hub Section */}
      <section className="mb-12 bg-gray-100 rounded-md p-14">
        <h2 className="text-3xl font-semibold mb-4">Eco-Tourism Hub</h2>
        <div className="flex flex-col md:flex-row-reverse items-center gap-6">
          <p className="text-xl leading-relaxed md:w-1/2">
            Our website serves as a hub for eco-tourists, nature lovers, and culture enthusiasts, offering information and resources for those who wish to explore the beauty of our planet while making a positive impact.
          </p>
          <Image 
            src="/images/snorkel.jpg" 
            alt="Eco-Tourism" 
            width={500} 
            height={300} 
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Empowering Local Communities Section */}
      <section className="mb-12 bg-gray-100 rounded-md p-14">
        <h2 className="text-3xl font-semibold mb-4">Empowering Local Communities</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <p className="text-xl leading-relaxed md:w-1/2">
            Through our tourism initiatives, we aim to provide local residents with sustainable livelihoods, all while promoting environmental consciousness. We strive to educate tourists about the importance of preserving our natural heritage, ensuring that future generations can enjoy the wonders of nature.
          </p>
          <Image 
            src="/images/local.jpg" 
            alt="Community" 
            width={500} 
            height={300} 
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-custom-7 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-4">Join Us in Our Mission</h2>
        <p className="text-lg">
          Together, we can create meaningful change that benefits both local communities and the environment. Explore our site to learn how you can get involved!
        </p>
      </section>
    </div>
  );
};

export default About;