import { getListings } from "@/lib/getListings";
import HomeClient from "./HomeClient";


export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams
  const listings = await getListings(params) ?? []
  
  return (
    <HomeClient listings={listings} />
  );
}
