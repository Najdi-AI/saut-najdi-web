import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { RestaurantsPage } from "@/components/pages/RestaurantsPage";

export const metadata = metaFor("ar", "solutions/restaurants");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="solutions/restaurants" />
      <RestaurantsPage locale="ar" />
    </>
  );
}
