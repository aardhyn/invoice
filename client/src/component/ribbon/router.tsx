import { useMatch } from "@tanstack/react-router";
import { BusinessRibbon } from "./BusinessRibbon";
import { Placeholder } from "component";

export function RibbonRouter() {
  const isBusiness = useMatch({ from: "/business/$businessKey", shouldThrow: false });
  const isNewBusiness = useMatch({ from: "/business/new", shouldThrow: false });

  if (isBusiness || isNewBusiness) return <BusinessRibbon />;
  return <Placeholder />;
}
