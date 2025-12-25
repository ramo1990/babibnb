'use client'

import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/listings/ListingCard";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { ListingType, CurrentUserType } from "@/lib/types";
import { useEffect, useState } from "react";


interface Props { 
  listings: ListingType[] 
}

export default function HomeClient({listings}: Props) {
  const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null)
  
  useEffect(() => {
    getCurrentUser().then(setCurrentUser)
  }, [])
  
  if (listings.length === 0) {
    return (
      <EmptyState showReset />
    )
  }
  
  return (
    <Container>
      <div className="pt-28 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {listings.map((listing: ListingType) => (
          <ListingCard key={listing.id} data={listing} currentUser={currentUser} actionId={listing.id} />
        ))}
      </div>
    </Container>
  );
}
