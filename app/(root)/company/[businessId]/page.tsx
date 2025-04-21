import { fetchShowcasingBusinessData, fetchShowcasingBusinessPackages } from "@/lib/actions/business.actions";
import BusinessPageClient from "@/components/client/BusinessPageClient";

export default async function BusinessPage({ params }: { params: { businessId: string } }) {
  const { businessId } = params;

  try {
    // Fetch data server-side
    const businessData = await fetchShowcasingBusinessData(businessId);
    const packages = await fetchShowcasingBusinessPackages(businessId);

    return (
      <BusinessPageClient businessData={businessData} packages={packages} businessId={businessId}/>
    );
  } catch (error) {
    console.error("Error fetching business data:", error);
    return <p>Failed to load business data.</p>;
  }
}