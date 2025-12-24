import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/listings/ListingCard";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getListings } from "@/lib/getListings";
import { ListingType } from "@/lib/types";

export default async function Home() {
  const listings = await getListings() ?? []
  const currentUser = await getCurrentUser()
  
  if (listings.length === 0) {
    return (
      <EmptyState showReset />
    )
  }
  
  return (
    <Container>
      <div className="pt-28 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {listings.map((listing: ListingType) => {
          return (
            <ListingCard key={listing.id} data={listing} currentUser={currentUser} actionId={listing.id} />
          )
        })}
      </div>
    </Container>
  );
}
