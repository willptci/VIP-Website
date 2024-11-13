import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React from 'react';

interface TourDetailsProps {
  params: {
    companyName: string;
  };
}

const TourDetailsPage: React.FC<TourDetailsProps> = ({ params }) => {
  const { companyName } = params;

  // Sample data (you would replace this with data fetched from an API or database)
  const tourData = {
    title: `${companyName} - Fishing Adventure`,
    description: "Enjoy a unique fishing experience on the crystal clear waters of Andros. Perfect for both beginners and seasoned anglers.",
    location: "Andros Island, Bahamas",
    price: 200,
    duration: "Full Day",
    availability: "Available",
    images: [
      '/public/companyExamples/Andros-1.jpg',
      '/public/companyExamples/Andros-2.jpg',
      '/public/companyExamples/Andros-3.jpg',
    ],
    reviews: [
      { reviewer: "John Doe", rating: 5, comment: "An amazing experience! Highly recommend." },
      { reviewer: "Jane Smith", rating: 4, comment: "Beautiful scenery and great guide." },
    ]
  };

  return (
    <div className="tour-details-page">
      {/* Header Image */}
      <div className="header-image">
        <Image
          src={tourData.images[0]}
          alt={tourData.title}
          layout="responsive"
          width={1000}
          height={600}
          className="main-image"
        />
      </div>

      {/* Tour Title and Location */}
      <section className="tour-header">
        <h1>{tourData.title}</h1>
        <p className="location">{tourData.location}</p>
      </section>

      {/* Description and Info */}
      <section className="tour-info">
        <h2>About This Experience</h2>
        <p>{tourData.description}</p>
        <p><strong>Duration:</strong> {tourData.duration}</p>
        <p><strong>Availability:</strong> {tourData.availability}</p>
      </section>

      {/* Image Gallery */}
      <section className="image-gallery">
        <h2>Gallery</h2>
        <div className="images">
          {tourData.images.slice(1).map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Gallery image ${index + 1}`}
              width={500}
              height={300}
              className="gallery-image"
            />
          ))}
        </div>
      </section>

      {/* Pricing and Booking */}
      <section className="pricing">
        <h2>Pricing</h2>
        <p><strong>${tourData.price}</strong> per person</p>
        <button className="book-now-button">Book Now</button>
      </section>

      {/* Reviews */}
      <section className="reviews">
        <h2>Reviews</h2>
        {tourData.reviews.map((review, index) => (
          <div key={index} className="review">
            <p><strong>{review.reviewer}</strong> - {review.rating}⭐</p>
            <p>{review.comment}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default TourDetailsPage;
