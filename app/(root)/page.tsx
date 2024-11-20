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
import { fetchCompanies } from '@/lib/actions/user.actions';

const Home = () => {
  const [companies, setCompanies] = useState<CompanyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const isValidImage = (image: string) => image && (image.startsWith("/") || image.startsWith("http"));

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const companyData = await fetchCompanies();
        setCompanies(companyData);
        console.log("company image", companies[0].image);
      } catch (error) {
        console.error("Error loading companies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
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
          firstName='Jonathon'
          lastName='Cox'
          image={bonefishing_1.src}
        />
        <CompanyProfileBox category="Fishing" businessProduct="Fishing Day Trips" businessName="Ocean Tours" firstName="Shawn" lastName="Gardiner" image={bonefishing_2.src} />
        <CompanyProfileBox category="Fishing" businessProduct="Fishing Day Trips" businessName="Ocean Odyssey" firstName="Daunte" lastName="Taylor"  image={bonefishing_3.src} />
        <CompanyProfileBox category="Fishing" businessProduct="Fishing Day Trips" businessName="Bonefish Bonanza" firstName="Brenten" lastName="Handfield"  image={bonefishing_4.src} />
        <CompanyProfileBox category="Fishing" businessProduct="Fishing Day Trips" businessName="Andros Excursions" firstName="Donny" lastName="Williams"  image={bonefishing_5.src} />
        <CompanyProfileBox category="Fishing" businessProduct="Fishing Day Trips" businessName="Bait & Tackle Tours" firstName="Will" lastName="Parrish"  image={bonefishing_6.src} />
        <CompanyProfileBox category="Fishing" businessProduct="Fishing Day Trips" businessName="Waterway Wonders Fishing" firstName="Marley" lastName="Hess"  image={bonefishing_7.src} />

        {/* Dynamically rendered CompanyProfileBox items with only businessName dynamically set */}
        {companies.map((company) => (
          <CompanyProfileBox
            key={company.$id}
            category="Fishing" // Default value
            businessProduct="Fishing Day Trips" // Default value
            businessName={company.companyName} // Dynamic value
            firstName={company.firstName}
            lastName={company.lastName}
            image={isValidImage(company.image) ? company.image : bonefishing_1.src} // Default image
          />
        ))}
      </div>
    </section>
  );
};

export default Home;
