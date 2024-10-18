import {
  InvoiceGet,
  isProductLineItem,
  isServiceLineItem,
  LineItem,
  Location,
  Contact,
} from "api";

export type ExportableInvoice = InvoiceGet;

import "./style.css";
import { dateFromTimestamp, capitalize, stringifyBoolean } from "common";
import { useMemo } from "react";
import { getLineItemColumns } from "./util";

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

function LineItemsPreview({ line_items }: { line_items: LineItem[] }) {
  const columns = useMemo(() => getLineItemColumns(line_items), [line_items]);

  return (
    <table>
      <thead>
        <tr>
          {columns.map(capitalize).map((column) => (
            <th key={column}>{column}</th>
          ))}
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

function LineItemPreview({ line_item }: { line_item: LineItem }) {
  return (
    <tr>
      <td>{line_item.name}</td>
      <td>{line_item.description}</td>
      <td>{line_item.quantity}</td>

      {isProductLineItem(line_item) && (
        <>
          <td>{line_item.detail.unit_cost}</td>
          <td>{line_item.detail.cost}</td>
        </>
      )}

      {isServiceLineItem(line_item) && (
        <>
          <td>{line_item.detail.initial_rate}</td>
          <td>{line_item.detail.rate_threshold}</td>
          <td>{line_item.detail.rate}</td>
        </>
      )}

      {line_item.custom_fields.map(({ data, key }) => {
        // prettier-ignore
        const value = typeof data === "boolean" 
          ? stringifyBoolean(data) 
          : data.toString();

        return <td key={key}>{value}</td>;
      })}
    </tr>
  );
}
