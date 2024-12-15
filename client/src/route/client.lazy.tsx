import { createLazyFileRoute } from "@tanstack/react-router";
import { useClientListQuery, useClientCreateMutation } from "api";

export const Route = createLazyFileRoute("/client")({
  component: Page,
});

function Page() {
  const { data: clientList, isSuccess } = useClientListQuery();
  const {
    mutate: createClient,
    isError,
    error,
    isPending,
  } = useClientCreateMutation();

  return (
    <>
      <section>
        <h2>Clients</h2>
        <ul>
          {clientList?.data?.map((client) => (
            <li key={client.client_id}>{client.name}</li>
          ))}
        </ul>
        {isSuccess && !clientList?.data?.length && (
          <p>
            <em>No clients found</em>
          </p>
        )}
      </section>
      <section>
        <h2>Create Client</h2>
        <form
          method="POST"
          onSubmit={async (event) => {
            event?.preventDefault();
            const formData = new FormData(event.currentTarget);

            createClient({
              name: formData.get("name") as string,
              description: formData.get("description") as string,
              contact: {
                name: formData.get("name") as string, // taken from name... but, todo: do we need a client::name if we have client::contact::name?
                cell: formData.get("cell") as string,
                email: formData.get("email") as string,
                location: {
                  address: formData.get("contact-address") as string,
                  suburb: formData.get("contact-suburb") as string,
                  city: formData.get("contact-city") as string,
                },
              },
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
            <legend>Contact</legend>
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

          {isError && <p>{JSON.stringify(error)}</p>}

          <button disabled={isPending} type="submit">
            Create
          </button>
        </form>
      </section>
    </>
  );
}
