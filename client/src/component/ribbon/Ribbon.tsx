import { useMatch } from "@tanstack/react-router";
import { styled } from "panda/jsx";
import { ButtonLink, Text, H1 } from "component";
import { RibbonRouter } from "./router";

const BUSINESS_KEY = "1"; // fixme: user account will have a business key/default business key

export function Ribbon() {
  const isSignIn = useMatch({ from: "/sign-in", shouldThrow: false });
  const isSignUp = useMatch({ from: "/sign-up", shouldThrow: false });

  if (isSignIn || isSignUp) return null; // no ribbon on sign-in/sign-up

  return (
    <RibbonRoot>
      <Home />
      <Version />
      <RibbonRouter />
      <Profile />
    </RibbonRoot>
  );
}
const RibbonRoot = styled("section", {
  base: {
    bg: "background",
    p: "xs",
    d: "grid",
    gridTemplateColumns: "auto auto 1fr auto",
    alignItems: "center",
    g: "sm",
    borderBottom: "neutral",
  },
});

function Home() {
  const params = { businessKey: BUSINESS_KEY };
  return (
    <ButtonLink to="/business/$businessKey" params={params} variant="plain" color="tonal" style={{ paddingInline: 10 }}>
      <H1 scale="3" weight="4" style={{ cursor: "inherit" }}>
        Inv.
      </H1>
    </ButtonLink>
  );
}

function Version() {
  const versionString = `v${__APP_VERSION__}`;
  return (
    <Text scale="-1" color="2" css={{ mt: 4, pr: "sm" }}>
      {versionString}
    </Text>
  );
}

function Profile() {
  return (
    <ProfileRoot>
      <Avatar>CS</Avatar>
    </ProfileRoot>
  );
}
const ProfileRoot = styled("div", {
  base: {
    d: "flex",
    g: "sm",
    alignItems: "center",
  },
});
const Avatar = styled("div", {
  base: {
    h: 34,
    ar: 1,
    r: "lg",
    d: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "light",
    userSelect: "none",
    bg: "linear-gradient(135deg, #0000FF 0%, #FF00FF 100%)",
  },
});
