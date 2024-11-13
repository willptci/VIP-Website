// app/tours/[companyName]/page.tsx
"use client"
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

interface TourDetailsProps {
  params: {
    companyName: string;
  };
}

// Sample tour data for demonstration purposes
const tourData = {
  title: "Fishing Adventure",
  description: "Enjoy a unique fishing experience on the crystal clear waters of Andros. Perfect for both beginners and seasoned anglers.",
  location: "Andros Island, Bahamas",
  price: 200,
  duration: "Full Day",
  availability: "Available",
  images: [
    '/companyExamples/Andros-1.jpg',
    '/companyExamples/Andros-2.jpg',
    '/companyExamples/Andros-3.jpg',
    '/companyExamples/Andros-4.jpg',
    '/companyExamples/Andros-5.jpg',
  ],
  reviews: [
    { reviewer: "John Doe", rating: 5, comment: "An amazing experience! Highly recommend." },
    { reviewer: "Jane Smith", rating: 4, comment: "Beautiful scenery and great guide." },
  ]
};

const TourDetailsPage: React.FC<TourDetailsProps> = ({ params }) => {
  const { companyName } = params;

  return (
    <TourDetailsContainer>
      {/* Header Image */}
      <HeaderImage>
        <Image
          src={tourData.images[0]}
          alt={tourData.title}
          layout="responsive"
          width={800}
          height={400}
        />
      </HeaderImage>

      {/* Tour Title and Location */}
      <TourHeader>
        <h1>{tourData.title}</h1>
        <p className="location">{tourData.location}</p>
      </TourHeader>

      {/* Description and Info */}
      <TourInfo>
        <h2>About This Experience</h2>
        <p>{tourData.description}</p>
        <p><strong>Duration:</strong> {tourData.duration}</p>
        <p><strong>Availability:</strong> {tourData.availability}</p>
      </TourInfo>

      {/* Image Gallery */}
      <ImageGallery>
        <h2>Gallery</h2>
        <div className="images">
          {tourData.images.slice(1).map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Gallery image ${index + 1}`}
              width={300}
              height={200}
              className="gallery-image"
            />
          ))}
        </div>
      </ImageGallery>

      {/* Pricing and Booking */}
      <PricingSection>
        <h2>Pricing</h2>
        <p><strong>${tourData.price}</strong> per person</p>
        <BookNowButton>Book Now</BookNowButton>
      </PricingSection>

      {/* Reviews */}
      <ReviewsSection>
        <h2>Reviews</h2>
        {tourData.reviews.map((review, index) => (
          <Review key={index}>
            <p><strong>{review.reviewer}</strong> - {review.rating}⭐</p>
            <p>{review.comment}</p>
          </Review>
        ))}
      </ReviewsSection>
    </TourDetailsContainer>
  );
};

export default TourDetailsPage;

// Styled Components Definitions
const TourDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const HeaderImage = styled.div`
  width: 80%; /* Make header image smaller */
  margin: 0 auto; /* Center it */
  border-radius: 8px;
  overflow: hidden;
`;

const TourHeader = styled.section`
  margin: 20px 0;
  
  h1 {
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
  }

  .location {
    color: #888;
    font-size: 1rem;
    text-align: center;
  }
`;

const TourInfo = styled.section`
  margin-bottom: 20px;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  p {
    margin: 5px 0;
  }
`;

const ImageGallery = styled.section`
  margin-bottom: 20px;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  .images {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 10px;
  }

  .gallery-image {
    border-radius: 8px;
    object-fit: cover;
  }
`;

const PricingSection = styled.section`
  margin-bottom: 20px;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  p {
    font-size: 1.25rem;
    margin: 5px 0;
  }
`;

const BookNowButton = styled.button`
  background-color: #AFE1AF;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ReviewsSection = styled.section`
  margin-bottom: 20px;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
`;

const Review = styled.div`
  margin-bottom: 10px;

  p {
    margin: 5px 0;
  }
`;
