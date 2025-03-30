import { createFileRoute, redirect } from "@tanstack/react-router";

const BUSINESS_KEY = "1"; // todo: read from session cookie?

export const Route = createFileRoute("/")({
  loader() {
    throw redirect({ to: "/business/$businessKey", params: { businessKey: BUSINESS_KEY } });
  },
});
