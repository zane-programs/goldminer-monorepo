import usePageTitle from "../hooks/usePageTitle";

export default function Shop() {
  // set page title
  const setPageTitle = usePageTitle();
  setPageTitle("Shop");

  return <h1>Shop</h1>;
}
