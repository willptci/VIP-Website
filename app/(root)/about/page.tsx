import React from 'react';
import './About.scss';

const About: React.FC = () => {
  return (
    <div className="about">
      <h1>About Our Organization</h1>

      <section className="mission-section">
        <h2>Our Mission</h2>
        <div className="content">
          <p>
            We are a non-profit organization dedicated to the preservation and rejuvenation of natural resources around the globe. Our mission is to empower local communities and businesses to sustainably and responsibly leverage these invaluable resources. Currently, we operate in the Bahamas, the United States, and India.
          </p>
          <img src="/images/turtle.jpg" alt="Nature" className="mission-image" />
        </div>
      </section>

      <section className="hub-section">
        <h2>Eco-Tourism Hub</h2>
        <div className="content">
          <p>
            Our website serves as a hub for eco-tourists, nature lovers, and culture enthusiasts, offering information and resources for those who wish to explore the beauty of our planet while making a positive impact.
          </p>
          <img src="/images/snorkel.jpg" alt="Eco-Tourism" className="hub-image" />
        </div>
      </section>

      <section className="tourism-section">
        <h2>Empowering Local Communities</h2>
        <div className="content">
          <p>
            Through our tourism initiatives, we aim to provide local residents with sustainable livelihoods, all while promoting environmental consciousness. We strive to educate tourists about the importance of preserving our natural heritage, ensuring that future generations can enjoy the wonders of nature.
          </p>
          <img src="/images/local.jpg" alt="Community" className="tourism-image" />
        </div>
      </section>

      <section className="call-to-action-section">
        <h2>Join Us in Our Mission</h2>
        <p>
          Together, we can create meaningful change that benefits both local communities and the environment. Explore our site to learn how you can get involved!
        </p>
      </section>
    </div>
  );
};

export default About;