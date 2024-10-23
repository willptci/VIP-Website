import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';

// Mock Data - In real-world, you will fetch from API
const mockData = { 
  id: '1',
  title: 'Bonefish Bonanza',
  description: `The operation is limited to six boats per week, something the owners believe will ensure quality fishing for many years to come. 
  The average bonefish in these waters runs two- to four pounds, and anglers will find themselves casting at larger fish on a regular basis. You can also expect to spend the week wading pristine flats that seem endless, with no other anglers in sight.`,
};

  imageUrl: 
  price: 75,
  rating: 4.8,
  guide: {
    name: 'John Doe',
    bio: 'Expert sailor with 10 years of experience.',
  },
};

const ListingDetails = () => {
  const { id } = useRouter().query; // Get the listing ID from URL
  const listing = mockData; // Replace this with actual fetched data

  return (
    <div className="container mx-auto p-4">
      {/* Display the image */}
      <Image
        src={listing.imageUrl}
        alt={listing.title}
        width={800}
        height={450}
        className="rounded-lg"
      />

      {/* Listing Title */}
      <h1 className="text-4xl font-bold mt-4">{listing.title}</h1>

      {/* Price and Rating */}
      <div className="flex justify-between items-center mt-2">
        <span className="text-lg font-semibold">${listing.price} per person</span>
        <span className="text-lg">Rating: {listing.rating} / 5</span>
      </div>

      {/* Description */}
      <p className="text-gray-700 mt-4">{listing.description}</p>

      {/* Guide Information */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Meet Your Guide</h2>
        <p className="font-medium mt-1">{listing.guide.name}</p>
        <p className="text-gray-600 mt-1">{listing.guide.bio}</p>
      </div>
    </div>
  );
};

export default ListingDetails;


