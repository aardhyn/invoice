import { CodeIcon, ComponentIcon } from "lucide-react";
import { styled } from "panda/jsx";
import { ButtonLink, Placeholder } from "component";

const DEFAULT_SIDEBAR_WIDTH = 256;

export function AdminSidebar() {
  return (
    <Root>
      <Placeholder />
      <List>
        <ListItem>
          <NavLink to="/admin/developer" variant="plain" leadingIcon={<CodeIcon />}>
            Developer
          </NavLink>
        </ListItem>
        <ListItem>
          <NavLink to="/admin/library" variant="plain" leadingIcon={<ComponentIcon />}>
            Library
          </NavLink>
        </ListItem>
      </List>
      <Placeholder />
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
    transition: "background-color 200ms, fontWeight 100ms",
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
