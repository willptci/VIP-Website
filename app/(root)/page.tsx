"use client"
import React, { useEffect, useState } from 'react';
import CompanyProfileBox from '@/components/ui/CompanyProfileBox';
import bonefishing_1 from '/public/companyExamples/Andros-1.jpg';
import bonefishing_2 from '/public/companyExamples/Andros-2.jpg';
import bonefishing_3 from '/public/companyExamples/Andros-3.jpg';
import bonefishing_4 from '/public/companyExamples/Andros-4.jpg';
import bonefishing_5 from '/public/companyExamples/Andros-5.jpg';
import bonefishing_6 from '/public/companyExamples/Andros-6.jpg';
import bonefishing_7 from '/public/companyExamples/Andros-7.jpg';
import { createAdminClient } from '@/lib/appwrite';

interface CompanyDocument {
  $id: string;
  businessName: string;
}

const Home = () => {
  const [companies, setCompanies] = useState<CompanyDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
  const BUSINESS_COLLECTION_ID = process.env.APPWRITE_BUSINESS_COLLECTION_ID;

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!DATABASE_ID || !BUSINESS_COLLECTION_ID) {
        console.error('Missing environment variables');
        setLoading(false);
        return;
      }

      try {
        const { database } = await createAdminClient();
        const response = await database.listDocuments(DATABASE_ID!, BUSINESS_COLLECTION_ID!);

        const formattedCompanies: CompanyDocument[] = response.documents.map((doc) => ({
          $id: doc.$id,
          businessName: doc.businessName ?? 'Unknown',
        }));

        setCompanies(formattedCompanies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <section className="home">
      <div className="home-companies">
        {/* Static CompanyProfileBox items */}
        <CompanyProfileBox
          category="Fishing"
          businessProduct="Fishing Day Trips"
          businessName="Melly's Adventures"
          available="available"
          image={bonefishing_1.src}
        />
        <CompanyProfileBox category="Fishing" businessProduct="Fishing Day Trips" businessName="Ocean Tours" available="available" image={bonefishing_2.src} />
        <CompanyProfileBox category="Fishing" businessProduct="Fishing Day Trips" businessName="Ocean Odyssey" available="sold out" image={bonefishing_3.src} />
        <CompanyProfileBox category="Fishing" businessProduct="Fishing Day Trips" businessName="Bonefish Bonanza" available="sold out" image={bonefishing_4.src} />
        <CompanyProfileBox category="Fishing" businessProduct="Fishing Day Trips" businessName="Andros Excursions" available="available" image={bonefishing_5.src} />
        <CompanyProfileBox category="Fishing" businessProduct="Fishing Day Trips" businessName="Bait & Tackle Tours" available="available" image={bonefishing_6.src} />
        <CompanyProfileBox category="Fishing" businessProduct="Fishing Day Trips" businessName="Waterway Wonders Fishing" available="available" image={bonefishing_7.src} />

        {/* Dynamically rendered CompanyProfileBox items with only businessName dynamically set */}
        {companies.map((company) => (
          <CompanyProfileBox
            key={company.$id}
            category="Fishing" // Default value
            businessProduct="Fishing Day Trips" // Default value
            businessName={company.businessName} // Dynamic value
            available="available" // Default value
            image={bonefishing_1.src} // Default image
          />
        ))}
      </div>
    </section>
  );
};

export default Home;
