import { useNavigate, useParams } from "@tanstack/react-router";
import { useBusinessListQuery } from "api";
import { Select } from "component";
import { useMemo } from "react";

export function BusinessRibbon() {
  const { businessKey } = useParams({ strict: false });

  const businessListQuery = useBusinessListQuery();
  const businesses = businessListQuery.data ?? [];
  const options = useMemo(() => {
    const options = businesses.map(({ name, businessId }) => ({
      label: name,
      value: businessId.toString(),
    }));
    options.push({ label: "Create Business", value: "create" });
    return options;
  }, [businesses]);

  const navigate = useNavigate();
  const handleBusinessChange = (businessKey: string) => {
    if (businessKey === "create") {
      navigate({ to: "/business/new" });
    } else {
      navigate({ to: "/business/$businessKey", params: { businessKey } });
    }
  };

  return (
    <>
      <Select value={businessKey || "create"} onValueChange={handleBusinessChange} placeholder="business" options={options} />
    </>
  );
}
