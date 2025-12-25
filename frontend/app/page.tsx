import { getListings } from "@/lib/getListings";
import HomeClient from "./HomeClient";


export default async function Home() {
  const listings = await getListings() ?? []
  
  return (
    <HomeClient listings={listings} />
  );
}
