import { useState } from "react";
import { Form } from "@radix-ui/react-form";
import { Flex, styled } from "panda/jsx";
import { type Uuid, map, splitTimestamp, fromSnakeCase, capitalize, toTimestampz } from "common";
import { useMutableInvoiceState } from "utility";
import {
  LINE_ITEM_TYPE,
  DEFAULT_LINE_ITEM,
  type Invoice,
  type Location,
  type LineItemType,
  type CreateLineItem,
  type MutableLineItem,
  type KeyedMutableLineItem,
  type CreateServiceLineItem,
  type CreateProductLineItem,
  useClientListQuery,
  useProductListQuery,
  useServiceListQuery,
} from "api";
import {
  Card,
  H3,
  H4,
  Text,
  Textarea,
  TextField,
  Select,
  Button,
  LineItemCustomFieldsForm,
  LineItemMetaForm,
  LineItemProductSelectionForm,
  LineItemServiceSelectionForm,
} from "component";

function locationRequired(location?: Location | null) {
  return !!location?.address || !!location?.suburb || !!location?.city;
}

export function DraftInvoiceMutationForm({ initialInvoice }: { initialInvoice: Invoice }) {
  const { invoice, mutate, lineItems } = useMutableInvoiceState(initialInvoice);

  const clientList = useClientListQuery({
    businessId: invoice.business.businessId,
  });

  const isLocationRequired = locationRequired(invoice.location);

  return (
    <Form>
      <Flex direction="column" gap="md" align="start">
        <TextField
          label="Name"
          name="name"
          value={invoice.name}
          onValueChange={(name) => {
            mutate({ name });
          }}
        />
        <Textarea
          label="Description"
          name="description"
          value={invoice.description ?? ""}
          onValueChange={(description) => {
            mutate({ description });
          }}
        />
        <TextField
          label="Due Date"
          name="due_date"
          type="date"
          value={map(invoice.dueDate, splitTimestamp)?.date ?? ""}
          onValueChange={(dueDate) => {
            mutate({ dueDate: toTimestampz(dueDate) });
          }}
        />
        <Select
          label="Client"
          name="clientId"
          value={initialInvoice.client?.clientId.toString()}
          onValueChange={(client) => {
            mutate({ client: parseInt(client) });
          }}
          placeholder="Select Client"
          options={clientList.data?.data?.map((client) => ({ value: client.clientId.toString(), label: client.name })) ?? []}
        />
        <TextField
          label="Reference"
          name="reference"
          value={invoice.reference ?? ""}
          onValueChange={(reference) => {
            mutate({ reference });
          }}
        />
        <H3>Location</H3>
        <Flex gap="sm" wrap="wrap">
          <TextField
            label="Street"
            name="address"
            value={invoice.location?.address ?? ""}
            required={isLocationRequired}
            onValueChange={(address) => {
              mutate({
                location: {
                  city: invoice.location?.city ?? "",
                  address,
                  suburb: invoice.location?.suburb ?? null,
                },
              });
            }}
          />
          <TextField
            label="Suburb"
            name="suburb"
            value={invoice.location?.suburb ?? ""}
            onValueChange={(suburb) => {
              mutate({
                location: {
                  city: invoice.location?.city ?? "",
                  address: invoice.location?.address ?? "",
                  suburb,
                },
              });
            }}
          />
          <TextField
            label="City"
            name="city"
            required={isLocationRequired}
            value={invoice.location?.city}
            onValueChange={(city) => {
              mutate({
                location: {
                  city,
                  address: invoice.location?.address ?? "",
                  suburb: invoice.location?.suburb ?? null,
                },
              });
            }}
          />
        </Flex>
        <H3>Line Items</H3>
        <LineItemsForm
          businessId={initialInvoice.business.businessId}
          lineItems={lineItems.items}
          onMutate={lineItems.mutate}
          onDelete={lineItems.remove}
        />
        <H3>Create Line Item</H3>
        <CreateLineItemForm businessId={initialInvoice.business.businessId} onCreateLineItem={lineItems.add} />
      </Flex>
    </Form>
  );
}

function LineItemsForm({
  businessId,
  lineItems,
  onMutate: handleMutate,
  onDelete: handleDelete,
}: {
  businessId: number;
  onMutate(mutation: KeyedMutableLineItem): void;
  onDelete(key: Uuid): void;
  lineItems: KeyedMutableLineItem[];
}) {
  const createClickHandler = (key: Uuid) => () => {
    handleDelete(key);
  };

  const hasItems = !!lineItems.length;

  return (
    <LineItems>
      {lineItems.map((item) => {
        return (
          <li key={item.key}>
            <Card r="sm">
              <Flex justify="space-between" gap="sm">
                <H4>{item.name}</H4>
                <Button type="button" onClick={createClickHandler(item.key)}>
                  Delete
                </Button>
              </Flex>
              <LineItemForm
                businessId={businessId}
                lineItem={item}
                onMutateLineItem={(mutation) => {
                  handleMutate({ ...mutation, key: item.key });
                }}
              />
            </Card>
          </li>
        );
      })}
      {!hasItems && (
        <li>
          <Text color="2">No Items</Text>
        </li>
      )}
    </LineItems>
  );
}
const LineItems = styled("ul", {
  base: {
    alignSelf: "stretch",
    spaceY: "md",
  },
});

function getLineItemType({ detail }: KeyedMutableLineItem): LineItemType | undefined {
  if (!detail) return "ad_hoc";
  if ("productId" in detail) return "product";
  if ("serviceId" in detail) return "service";

  throw new Error("Unknown line item type");
}

export function LineItemForm({
  businessId,
  lineItem = DEFAULT_LINE_ITEM(),
  onMutateLineItem: handleMutateLineItem,
}: {
  businessId: number;
  lineItem: KeyedMutableLineItem;
  onMutateLineItem(item: MutableLineItem): void;
}) {
  // fixme: lets combine the services and products into one big select (with search) and set the detail structure accordingly
  const [type, setType] = useState(getLineItemType(lineItem));
  const handleTypeChange = (type: LineItemType) => {
    setType(type);
    handleMutateLineItem({ detail: null }); // clear current detail
  };

  const isProductType = !!lineItem.detail && "productId" in lineItem.detail;
  const productListQuery = useProductListQuery({ businessId }, isProductType);

  const isServiceType = !!lineItem.detail && "serviceId" in lineItem.detail;
  const serviceListQuery = useServiceListQuery({ businessId }, isServiceType);

  return (
    <>
      <LineItemMetaForm
        meta={{
          name: lineItem.name,
          description: lineItem.description,
          quantity: lineItem.quantity,
        }}
        onMetaChange={(meta) => {
          handleMutateLineItem(meta);
        }}
      />
      <Flex gap="md">
        <TypeDropdown type={type} onTypeChange={handleTypeChange} />
        {type === "product" && (
          <LineItemProductSelectionForm
            products={productListQuery.data || []}
            selectedProductId={(lineItem.detail as CreateProductLineItem)?.productId}
            onProductIdChange={(productId) => {
              handleMutateLineItem({
                detail: productId ? { productId } : null,
              });
            }}
          />
        )}
        {type === "service" && (
          <LineItemServiceSelectionForm
            services={serviceListQuery.data?.data || []}
            selectedServiceId={(lineItem.detail as CreateServiceLineItem)?.serviceId}
            onServiceIdChange={(serviceId) => {
              handleMutateLineItem({
                detail: serviceId ? { serviceId } : null,
              });
            }}
          />
        )}
      </Flex>
      <LineItemCustomFieldsForm
        customFields={lineItem.customFields || []}
        onCustomFieldsChange={(customFields) => {
          handleMutateLineItem({
            customFields,
          });
        }}
      />
    </>
  );
}

function CreateLineItemForm({
  businessId,
  onCreateLineItem: handleCreateLineItem,
}: {
  businessId: number;
  onCreateLineItem(item: CreateLineItem): void;
}) {
  const [lineItem, setLineItem] = useState<CreateLineItem>(DEFAULT_LINE_ITEM());
  const handleSubmit = () => {
    handleCreateLineItem(lineItem);
    setLineItem(DEFAULT_LINE_ITEM());
  };

  return (
    <>
      <LineItemForm
        businessId={businessId}
        lineItem={lineItem}
        onMutateLineItem={(mutation) => {
          setLineItem((lineItem) => ({ ...lineItem, ...mutation }));
        }}
      />
      <Button type="button" onClick={handleSubmit}>
        Add
      </Button>
    </>
  );
}

function TypeDropdown({
  type,
  onTypeChange: handleTypeChange,
}: {
  type?: LineItemType;
  onTypeChange(type: LineItemType): void;
}) {
  return (
    <Select
      name="lineItemType"
      label="Type"
      value={type}
      onValueChange={(value) => {
        handleTypeChange(value as LineItemType);
      }}
      options={LINE_ITEM_TYPE.map((value) => ({
        value,
        label: capitalize(fromSnakeCase(value)),
      }))}
    />
  );
}
