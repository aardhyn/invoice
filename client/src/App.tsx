import { useEffect, useState } from "react";

type Business = { business_id: number; name: string };

export function App() {
  const [businesses, setBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/business.list")
      .then((response) => response.json())
      .then((response) => {
        setBusinesses(response.data.businesses);
      });
  }, []);

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <h1>Invoice</h1>
      <section>
        <h2>Businesses</h2>
        <ul>
          {businesses.map((business) => (
            <li key={business.business_id}>{business.name}</li>
          ))}
        </ul>
        {!pending && !businesses.length && (
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
            try {
              const url = import.meta.env.VITE_API_DOMAIN;
              if (!url) {
                throw new Error("API_DOMAIN is not defined");
              }

              setPending(true);
              setError(null);

              const formData = new FormData(event.currentTarget);

              for (const [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
              }

              const response = await fetch(`http://${url}/business.create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: formData.get("name"),
                  description: formData.get("description"),
                  location: {
                    address: formData.get("address"),
                    suburb: formData.get("suburb"),
                    city: formData.get("city"),
                  },
                  contact: {
                    name: formData.get("contact-name"),
                    cell: formData.get("cell"),
                    email: formData.get("email"),
                    location: {
                      address: formData.get("contact-address"),
                      suburb: formData.get("contact-suburb"),
                      city: formData.get("contact-city"),
                    },
                  },
                  account_number: formData.get("account-number"),
                  account_name: formData.get("account-name"),
                }),
              });

              if (response.ok) {
                const business = await response.json();
                setBusinesses((businesses) => [...businesses, business]);
              } else {
                const error = await response.json();
                throw new Error(error.message);
              }
            } catch (error) {
              if (error instanceof Error) {
                setError(error.message);
              } else {
                setError("An unknown error occurred");
              }
            } finally {
              setPending(false);
            }
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

          {error && <p>{error}</p>}

          <button disabled={pending} type="submit">
            Create
          </button>
        </form>
      </section>
    </>
  );
}
