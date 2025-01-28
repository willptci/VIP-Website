"use client"
import { useState, useEffect } from "react";
import { fetchCompanies } from "@/lib/actions/business.actions";
import CompanyProfileBox from "@/components/ui/CompanyProfileBox";

const Home = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isValidImage = (image: string) =>
    image && (image.startsWith("/") || image.startsWith("http"));

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const companyData = await fetchCompanies();
        setCompanies(companyData);
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
    <section className="flex justify-center py-10 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-screen-xl w-full">
        {companies.map((company) => (
          <CompanyProfileBox
            key={company.$id}
            businessId={company.$id}
            businessProduct="Fishing Day Trips"
            businessName={company.companyName || "Unknown Business"}
            firstName={company.firstName || "Unknown"}
            lastName={company.lastName || "Unknown"}
            image={
              isValidImage(company.photos?.[0])
                ? company.photos[0]
                : "/default-image.jpg"
            }
          />
        ))}
      </div>
    </section>
  );
};

export default Home;
