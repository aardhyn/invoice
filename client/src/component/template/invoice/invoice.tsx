import { type Invoice, type LineItem, type Location, type Contact, ProductLineItem, ServiceLineItem } from "api";
import { H1, H2, H3 } from "component";
import { type Override, dateFromTimestamp } from "common";
import { useLineItemColumnNames, useCustomFieldCells } from ".";

export type ExportableInvoice = Invoice;

export function InvoicePreview({ invoice }: { invoice: ExportableInvoice }) {
  return (
    <div className="page">
      <div className="card">
        <H1>{invoice.name}</H1>
        {invoice.description && <p>{invoice.description}</p>}
      </div>
      <div className="row">
        <div className="card">
          <H2>From</H2>
          <div className="row">
            <div className="column">
              <H3>{invoice.business.name}</H3>
              {invoice.business.location && <LocationPreview location={invoice.business.location} />}
            </div>
            <div className="column">
              <ContactPreview contact={invoice.business.contact} />
            </div>
          </div>
        </div>
        <div className="card">
          <H2>Tax</H2>
          <div className="column">
            <p className="row">
              <b>Nō</b> {invoice.invoiceKey}
            </p>
            <p className="row">
              <b>Due</b> {invoice.dueDate ? dateFromTimestamp(invoice.dueDate) : "Unset"}
            </p>
            <p className="row">
              <b>Reference</b> {invoice.reference ? invoice.reference : "None"}
            </p>
          </div>
        </div>
        <div className="card">
          <H2>To</H2>
          <div className="column">{invoice.client ? <ContactPreview contact={invoice.client.contact} /> : "Unset"}</div>
        </div>
        <div className="card">
          <H2>Property</H2>
          <div className="column">{invoice.location ? <LocationPreview location={invoice.location} /> : "Unset"}</div>
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
      <H3>{contact.name}</H3>
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

function LineItemsPreview({ lineItems, total }: { lineItems: LineItem[]; total: number }) {
  const { customColumns, formattedColumns, hasProductColumns, hasServiceColumns } = useLineItemColumnNames(lineItems);

  return (
    <table style={{ width: "100%" }}>
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
          <td colSpan={formattedColumns.length - 1} style={{ textAlign: "right", paddingRight: 16, fontWeight: "bold" }}>
            Total
          </td>
          <td>{total}</td>
        </tr>
      </tfoot>
    </table>
  );
}

// union the keys of possible detail properties so we can type safely render them in the table
type LineItemView = Override<LineItem, { detail: ServiceLineItem & ProductLineItem }>;

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
