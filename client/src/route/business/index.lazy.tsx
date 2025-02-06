import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useBusinessListQuery, useBusinessCreateMutation } from "api";

export const Route = createLazyFileRoute("/business/")({
  component: Page,
});

function Page() {
  const { data: businessList, isSuccess } = useBusinessListQuery();
  const {
    mutate: createBusiness,
    isError,
    error,
    isPending,
  } = useBusinessCreateMutation();

  return (
    <>
      <section>
        <h2>Businesses</h2>
        <ul>
          {businessList?.data?.map(({ name, business_id }) => {
            const businessKey = business_id.toString();
            return (
              <li key={businessKey}>
                <Link to="/business/$businessKey" params={{ businessKey }}>
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
        {isSuccess && !businessList?.data?.length && (
          <p>
            <em>No businesses found</em>
          </p>
        )}
      </section>
      <section>
        <h2>Create Business</h2>
        <form
          method="POST"
          onSubmit={async (event) => {
            event?.preventDefault();
            const formData = new FormData(event.currentTarget);

            createBusiness({
              name: formData.get("name") as string,
              description: formData.get("description") as string,
              location: {
                address: formData.get("address") as string,
                suburb: formData.get("suburb") as string,
                city: formData.get("city") as string,
              },
              contact: {
                name: formData.get("contact-name") as string,
                cell: formData.get("cell") as string,
                email: formData.get("email") as string,
                location: {
                  address: formData.get("contact-address") as string,
                  suburb: formData.get("contact-suburb") as string,
                  city: formData.get("contact-city") as string,
                },
              },
              account_number: formData.get("account-number") as string,
              account_name: formData.get("account-name") as string,
            });
          }}
        >
          <label>
            Name
            <input type="text" name="name" required />
          </label>
          <br />
          <label>
            Description
            <textarea name="description" />
          </label>

          <fieldset>
            <legend>Address</legend>
            <label>
              Street
              <input type="text" name="address" required />
            </label>
            <br />
            <label>
              Suburb
              <input type="text" name="suburb" />
            </label>
            <br />
            <label>
              City
              <input type="text" name="city" required />
            </label>
          </fieldset>

          <fieldset>
            <legend>Contact</legend>
            <label>
              Client
              <input type="text" name="contact-name" required />
            </label>
            <br />
            <label>
              Cellphone
              <input type="tel" name="cell" id="phone" required />
            </label>
            <br />
            <label>
              Email
              <input type="email" name="email" id="email" required />
            </label>

            <fieldset>
              <legend>Address</legend>
              <label>
                Street
                <input type="text" name="contact-address" required />
              </label>
              <br />
              <label>
                Suburb
                <input type="text" name="contact-suburb" />
              </label>
              <br />
              <label>
                City
                <input type="text" name="contact-city" required />
              </label>
            </fieldset>
          </fieldset>

          <fieldset>
            <legend>Payment</legend>
            <label>
              Account Name
              <input type="text" name="account-name" required />
            </label>
            <br />
            <label>
              Account Number
              <input type="text" name="account-number" required />
            </label>
          </fieldset>

          {isError && <p>{JSON.stringify(error)}</p>}

          <button disabled={isPending} type="submit">
            Create
          </button>
        </form>
      </section>
    </>
  );
}
