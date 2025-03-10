import {
  type Invoice,
  type LineItem,
  type Location,
  type Contact,
  ProductLineItem,
  ServiceLineItem,
} from "api";
import { dateFromTimestamp, Override } from "common";
import { useLineItemColumnNames, useCustomFieldCells } from ".";

import "./style.css";

export type ExportableInvoice = Invoice;

export function InvoicePreview({ invoice }: { invoice: ExportableInvoice }) {
  return (
    <div className="page column">
      <div className="card">
        <h1>{invoice.name}</h1>
        {invoice.description && <p>{invoice.description}</p>}
      </div>
      <div className="row">
        <div className="card">
          <h2>From</h2>
          <div className="row">
            <article>
              <h3>{invoice.business.name}</h3>
              {invoice.business.location && (
                <LocationPreview location={invoice.business.location} />
              )}
            </article>
            <article>
              <ContactPreview contact={invoice.business.contact} />
            </article>
          </div>
        </div>
        <div className="card">
          <h2>Tax</h2>
          <article>
            <p className="row">
              <b>Nō</b> {invoice.invoiceKey}
            </p>
            <p className="row">
              <b>Due</b>{" "}
              {invoice.dueDate ? dateFromTimestamp(invoice.dueDate) : "Unset"}
            </p>
            <p className="row">
              <b>Reference</b> {invoice.reference ? invoice.reference : "None"}
            </p>
          </article>
        </div>
        <div className="card">
          <h2>To</h2>
          <article>
            {invoice.client ? (
              <ContactPreview contact={invoice.client.contact} />
            ) : (
              "Unset"
            )}
          </article>
        </div>
        <div className="card">
          <h2>Property</h2>
          <article>
            {invoice.location ? (
              <LocationPreview location={invoice.location} />
            ) : (
              "Unset"
            )}
          </article>
        </div>
      </div>
      <div className="card">
        <LineItemsPreview lineItems={invoice.lineItems} total={invoice.total} />
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

function LineItemsPreview({
  lineItems,
  total,
}: {
  lineItems: LineItem[];
  total: number;
}) {
  const {
    customColumns,
    formattedColumns,
    hasProductColumns,
    hasServiceColumns,
  } = useLineItemColumnNames(lineItems);

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
        {lineItems.map((lineItem) => (
          <LineItemPreview
            key={lineItem.key}
            lineItem={lineItem as LineItemView}
            customFieldColumns={customColumns}
            showProductColumns={hasProductColumns}
            showServiceColumns={hasServiceColumns}
          />
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td
            colSpan={formattedColumns.length - 1}
            style={{ textAlign: "right", paddingRight: 16, fontWeight: "bold" }}
          >
            Total
          </td>
          <td>{total}</td>
        </tr>
      </tfoot>
    </table>
  );
}

// union the keys of possible detail properties so we can type safely render them in the table
type LineItemView = Override<
  LineItem,
  { detail: ServiceLineItem & ProductLineItem }
>;

function LineItemPreview({
  lineItem: lineItem,
  customFieldColumns,
  showProductColumns,
  showServiceColumns,
}: {
  lineItem: LineItemView;
  customFieldColumns: string[];
  showProductColumns?: boolean;
  showServiceColumns?: boolean;
}) {
  const customColumnCells = useCustomFieldCells(lineItem, customFieldColumns);

  return (
    <tr>
      <td>{lineItem.name}</td>
      <td>{lineItem.description}</td>
      <td>{lineItem.quantity}</td>

      {showProductColumns && <td>{lineItem.detail?.unitCost}</td>}
      {showServiceColumns && (
        <>
          <td>{lineItem.detail?.initialRate}</td>
          <td>{lineItem.detail?.rate}</td>
        </>
      )}

      {customColumnCells.map((data, index) => (
        <td key={index}>{data}</td> // index is fine here as it's a static list
      ))}

      <td>{lineItem.total}</td>
    </tr>
  );
}
