import {
  type InvoiceGet,
  type LineItem,
  type Location,
  type Contact,
  ProductLineItem,
  ServiceLineItem,
} from "api";
import { dateFromTimestamp, Override } from "common";
import { useLineItemColumnNames, useCustomFieldCells } from ".";

import "./style.css";

export type ExportableInvoice = InvoiceGet;

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
  const { customColumns, formattedColumns } =
    useLineItemColumnNames(line_items);

  return (
    <table>
      <thead>
        <tr>
          {formattedColumns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {line_items.map((line_item) => (
          <LineItemPreview
            key={line_item.key}
            line_item={line_item as LineItemView}
            customFieldColumns={customColumns}
          />
        ))}
      </tbody>
    </table>
  );
}

// union the keys of possible detail properties so we can type safely render them in the table
type LineItemView = Override<
  LineItem,
  { detail: ServiceLineItem & ProductLineItem }
>;

function LineItemPreview({
  line_item: lineItem,
  customFieldColumns,
}: {
  line_item: LineItemView;
  customFieldColumns: string[];
}) {
  const customColumnCells = useCustomFieldCells(lineItem, customFieldColumns);

  return (
    <tr>
      <td>{lineItem.name}</td>
      <td>{lineItem.description}</td>
      <td>{lineItem.quantity}</td>

      <td>{lineItem.detail?.cost}</td>

      <td>{lineItem.detail?.initial_rate}</td>
      <td>{lineItem.detail?.rate}</td>

      {customColumnCells.map((data, index) => (
        <td key={index}>{data}</td> // index is fine here as it's a static list
      ))}
    </tr>
  );
}
