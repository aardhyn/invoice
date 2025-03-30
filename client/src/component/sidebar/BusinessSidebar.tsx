import { styled } from "panda/jsx";
import { ContactIcon, FileTextIcon, HammerIcon, PackageIcon } from "lucide-react";
import { ButtonLink, Placeholder } from "component";

const DEFAULT_SIDEBAR_WIDTH = 256;

export function BusinessSidebar({ businessKey }: { businessKey: string }) {
  const params = { businessKey };

  return (
    <Root>
      <Placeholder />
      <List>
        <ListItem>
          <NavLink to="/business/$businessKey/invoice" params={params} variant="plain" leadingIcon={<FileTextIcon />}>
            Invoices
          </NavLink>
        </ListItem>
        <ListItem>
          <NavLink to="/business/$businessKey/client" params={params} variant="plain" leadingIcon={<ContactIcon />}>
            Clients
          </NavLink>
        </ListItem>
        <ListItem>
          <NavLink to="/business/$businessKey/service" params={params} variant="plain" leadingIcon={<HammerIcon />}>
            Services
          </NavLink>
        </ListItem>
        <ListItem>
          <NavLink to="/business/$businessKey/product" params={params} variant="plain" leadingIcon={<PackageIcon />}>
            Products
          </NavLink>
        </ListItem>
      </List>
      <List>
        <NavLink to="/admin" variant="plain" leadingIcon={<HammerIcon />}>
          Admin
        </NavLink>
      </List>
    </Root>
  );
}

// fixme: use radix Navigation Menu...
const List = styled("ul", { base: {} });
const ListItem = styled("li", { base: {} });
const NavLink = styled(ButtonLink, {
  base: {
    w: "100%",
    justifyContent: "flex-start",
    px: "sm !important",
    fontWeight: 400,
    "&[data-status='active']": { bg: "highlight" },
  },
});

const Root = styled("aside", {
  base: {
    w: DEFAULT_SIDEBAR_WIDTH,
    maxW: DEFAULT_SIDEBAR_WIDTH,
    d: "grid",
    gridTemplateRows: "auto 1fr auto",
    bg: "background",
    borderRight: "neutral",
    p: "xs",
  },
});
