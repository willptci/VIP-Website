import React from 'react';
import './About.scss'; // Import your custom styles if needed

const About: React.FC = () => {
  return (
    <div className="about">
      <h1>About Us</h1>
      <p>
        Welcome to our tourist website dedicated to the beautiful Bahamas! Our mission is to provide travelers with comprehensive information, tips, and resources to help them explore and enjoy everything this stunning destination has to offer.
      </p>
      <p>
        From pristine beaches and vibrant coral reefs to rich culture and delicious cuisine, the Bahamas is a paradise waiting to be discovered. Our team of passionate locals and travel enthusiasts is here to guide you through your journey, ensuring you make the most of your visit.
      </p>
      <h2>Our Vision</h2>
      <p>
        We believe that travel is about creating unforgettable memories and connecting with new cultures. Our vision is to inspire travelers to experience the unique beauty of the Bahamas while promoting sustainable tourism practices that benefit both visitors and locals.
      </p>
      <h2>What We Offer</h2>
      <ul>
        <li>Travel guides and tips</li>
        <li>Local attractions and activities</li>
        <li>Cultural insights and experiences</li>
        <li>Recommendations for dining and accommodation</li>
        <li>Travel itineraries and planning assistance</li>
      </ul>
      <h2>Connect with Us</h2>
      <p>
        We love hearing from fellow travelers! If you have any questions, suggestions, or would like to share your experiences, please feel free to reach out to us through our contact page.
      </p>
    </div>
  );
};

export default About;
