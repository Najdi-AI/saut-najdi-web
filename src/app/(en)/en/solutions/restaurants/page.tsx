import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { RestaurantsPage } from "@/components/pages/RestaurantsPage";

export const metadata = metaFor("en", "solutions/restaurants");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="solutions/restaurants" />
      <RestaurantsPage locale="en" />
    </>
  );
}
