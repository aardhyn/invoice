import { InvoiceGet, LineItem, Location } from "api";
import { Contact } from "api";

export type ExportableInvoice = InvoiceGet;

import "./style.css";
import { dateFromTimestamp } from "../../common/temporal";

export function InvoicePreview({ invoice }: { invoice: ExportableInvoice }) {
  return (
    <div className="page column">
      <div className="card">
        <h1>{invoice.name}</h1>
        <p>{invoice.description}</p>
      </div>
      <div className="row">
        <div className="card">
          <h2>From</h2>
          <div className="row">
            <article>
              <h3>{invoice.business.name}</h3>
              <LocationPreview location={invoice.business.location} />
            </article>
            <article>
              <ContactPreview contact={invoice.business.contact} />
            </article>
          </div>
        </div>
        <div className="card">
          <h2>Tax</h2>
          <article>
            <p>
              <b>Nō</b> {invoice.invoice_id}
            </p>
            <p>
              <b>Sent</b> null
            </p>
            <p>
              <b>Due</b> {dateFromTimestamp(invoice.due_date)}
            </p>
            <p>
              <b>Reference</b> {invoice.reference}
            </p>
          </article>
        </div>
        <div className="card">
          <h2>To</h2>
          <article>
            <ContactPreview contact={invoice.client.contact} />
          </article>
        </div>
        <div className="card">
          <h2>Property</h2>
          <article>
            <LocationPreview location={invoice.location} />
          </article>
        </div>
      </div>
      <div className="card">
        <LineItemsPreview line_items={invoice.line_items} />
      </div>
    </div>
  );
}

function LineItemsPreview({ line_items }: { line_items: LineItem[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {line_items.map((line_item) => (
          <LineItemPreview key={line_item.key} line_item={line_item} />
        ))}
      </tbody>
    </table>
  );
}

function ContactPreview({ contact }: { contact: Contact }) {
  return (
    <>
      <h3>{contact.name}</h3>
      <p>{contact.email}</p>
      <p>{contact.cell}</p>
      {contact.location && <LocationPreview location={contact.location} />}
    </>
  );
}

function LocationPreview({ location }: { location: Location }) {
  const { address, suburb, city } = location;
  return (
    <>
      <p>{address}</p>
      {suburb && <p>{suburb}</p>}
      <p>{city}</p>
    </>
  );
}

function LineItemPreview({ line_item }: { line_item: LineItem }) {
  return (
    <tr>
      <td>{line_item.name}</td>
      <td>{line_item.description}</td>
    </tr>
  );
}
