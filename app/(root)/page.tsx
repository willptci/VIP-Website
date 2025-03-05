"use client";
import { useState, useEffect } from "react";
import { fetchCompanies } from "@/lib/actions/business.actions";
import CompanyProfileBox from "@/components/ui/CompanyProfileBox";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 8; // Adjust as needed

const Home = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const isValidImage = (image: string) =>
    image && (image.startsWith("/") || image.startsWith("http"));

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const companyData = await fetchCompanies();
        setCompanies(companyData);
        setFilteredCompanies(companyData); // Initialize with all companies
      } catch (error) {
        console.error("Error loading companies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  // Handle search filtering
  useEffect(() => {
    const filtered = companies.filter((company) =>
      company.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCompanies(filtered);
    setCurrentPage(1); // Reset pagination when filtering
  }, [searchQuery, companies]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) return <p>Loading...</p>;

  return (
    <section className="flex flex-col items-center py-10 px-4">
      {/* Search Bar */}
      <Input
        type="text"
        placeholder="Search businesses..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full max-w-lg p-2 mb-6 border border-gray-300 rounded-md"
      />

      {/* Company Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-screen-xl w-full">
        {paginatedCompanies.length > 0 ? (
          paginatedCompanies.map((company) => (
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
          ))
        ) : (
          <p className="text-center col-span-full">No businesses found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
};

export default Home;