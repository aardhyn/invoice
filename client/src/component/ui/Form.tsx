import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { SystemStyleObject } from "panda/types";
import { styled } from "panda/jsx";
import { cva } from "panda/css";
import {
  type FormFieldProps,
  type FormMessageProps,
  Field as FieldPrimitive,
  Label as LabelPrimitive,
  Control as ControlPrimitive,
  Message as MessagePrimitive,
  FormMessage,
} from "@radix-ui/react-form";
import {
  type CheckboxProps,
  Root as CheckboxPrimitive,
  CheckboxIndicator as CheckboxIndicatorPrimitive,
} from "@radix-ui/react-checkbox";
import {
  type SelectProps as SelectPrimitiveProps,
  type SelectItemProps,
  Select as SelectPrimitive,
  SelectItem as SelectItemPrimitive,
  SelectTrigger as SelectTriggerPrimitive,
  SelectContent as SelectContentPrimitive,
  ItemIndicator as SelectItemIndicatorPrimitive,
  SelectItemText as SelectItemTextPrimitive,
  SelectValue as SelectValuePrimitive,
  SelectIcon,
  SelectPortal,
  SelectViewport,
  SelectScrollDownButton,
  SelectScrollUpButton,
} from "@radix-ui/react-select";

const DISABLE_AUTOCOMPLETE_PROPS = {
  autoComplete: "off",
  "data-1p-ignore": "true",
  "data-lpignore": "true",
  "data-protonpass-ignore": "true",
};

const fieldCss = cva({
  base: {
    d: "flex",
    alignItems: "flex-start",
    flexDir: "column",
    whiteSpace: "nowrap",
    gap: 4,
  },
  variants: {
    inline: {
      true: { flexDir: "row", alignItems: "center" },
    },
  },
});
const Field = styled(FieldPrimitive, fieldCss);

const labelCss = cva({
  base: {
    fontWeight: 500,
    userSelect: "none",
  },
});
const Label = styled(LabelPrimitive, labelCss);

type FormMessage = { message: string } & Pick<FormMessageProps, "match">;
const messageCss = cva({
  base: {
    whiteSpace: "nowrap",
    color: "textError",
    fontSize: "sm",
    userSelect: "none",
  },
});
const Message = styled(MessagePrimitive, messageCss);
function FieldMessages({ messages = [] }: { messages?: FormMessage[] }) {
  return messages.map(({ message, ...props }, index) => (
    <Message asChild={typeof message !== "string"} key={index} {...props}>
      {message}
    </Message>
  ));
}

type FieldProps = FormFieldProps & {
  label?: string;
  messages?: FormMessage[];
  css?: SystemStyleObject;
};

const TextFieldRoot = styled("span", {
  base: {
    d: "inline-flex",
    alignItems: "center",
    g: "sm",
    py: "xs",
    px: "sm",
    minW: 256,
    b: "neutral",
    r: "xs",
    ln: "transparent",
    transition: "outline 50ms",
    "&:focus-within": { ln: "focus" },
    "[data-invalid] &": {
      b: "error",
      "&:focus-within": { ln: "focusError" },
    },

    "& svg": { w: 16, h: 16 },
  },
});
const Input = styled("input", {
  base: {
    flex: 1,
    bg: "transparent",
    ln: "none",
  },
});
type TextFieldProps = FieldProps &
  // Override<
  InputHTMLAttributes<HTMLInputElement> & {
    // { type?: "text" | "email" | "number" | "tel" | "password" }
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    onValueChange?(value: string): void;
  };
export function TextField({
  name,
  label,
  leadingIcon,
  trailingIcon,
  css,
  type = "text",
  autoComplete = "off",
  messages,
  onValueChange: handleValueChange,
  ...inputProps
}: TextFieldProps) {
  const noAutoComplete = autoComplete === "off" && DISABLE_AUTOCOMPLETE_PROPS;
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleValueChange?.(event.target.value);
  };
  return (
    <Field name={name} css={css}>
      {label && <Label>{label}</Label>}
      <TextFieldRoot>
        {!!leadingIcon && leadingIcon}
        <ControlPrimitive asChild>
          <Input type={type} onChange={handleChange} {...inputProps} {...noAutoComplete} />
        </ControlPrimitive>
        {!!trailingIcon && trailingIcon}
      </TextFieldRoot>
      <FieldMessages messages={messages} />
    </Field>
  );
}

const TextareaRoot = styled("textarea", {
  base: {
    b: "neutral",
    r: "xs",
    p: 8,
    w: "100%",
    h: 128,
    maxH: 256,
    resize: "vertical",
    ln: "transparent",
    transition: "outline 50ms ease-in-out",
    "&:focus": { ln: "focus" },
    "[data-invalid] &": {
      b: "error",
      "&:focus-within": { ln: "focusError" },
    },
  },
});
type TextareaProps = FieldProps &
  InputHTMLAttributes<HTMLTextAreaElement> & {
    onValueChange?(value: string): void;
  };
export function Textarea({ name, label, messages, css, onValueChange: handleValueChange, ...textareaProps }: TextareaProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    handleValueChange?.(event.target.value);
  };
  return (
    <Field name={name} css={{ w: "100%", maxW: 400, ...css }}>
      <Label>{label}</Label>
      <ControlPrimitive asChild>
        <TextareaRoot onChange={handleChange} {...textareaProps} />
      </ControlPrimitive>
      <FieldMessages messages={messages} />
    </Field>
  );
}

const CheckboxRoot = styled(CheckboxPrimitive, {
  base: {
    w: 24,
    h: 24,
    p: "sm",
    r: "xs",
    d: "flex",
    b: "neutral",
    alignItems: "center",
    justifyContent: "center",
    ln: "transparent",
    transition: "outline 50ms ease-in-out, background-color 50ms ease-in-out",
    "&:focus-visible": { ln: "focus" },
    "&:has(+ input:user-invalid)": {
      b: "error",
      "&:focus-visible": { ln: "focusError" },
    },
    backgroundColor: "transparent",
    "&[data-state=checked]": { backgroundColor: "primary", b: "primary" },
  },
});
const CheckboxIndicator = styled(CheckboxIndicatorPrimitive, {
  base: { color: "onPrimary" },
});
export function Checkbox({
  name,
  label,
  inline = true,
  messages,
  css,
  ...checkboxProps
}: FieldProps & CheckboxProps & { inline?: boolean }) {
  return (
    <Field name={name} inline={inline} gap={8} css={css}>
      {!inline && <Label>{label}</Label>}
      <ControlPrimitive asChild>
        <CheckboxRoot {...checkboxProps}>
          <CheckboxIndicator>
            <CheckIcon size={16} />
          </CheckboxIndicator>
        </CheckboxRoot>
      </ControlPrimitive>
      {inline && <Label>{label}</Label>}
      <FieldMessages messages={messages} />
    </Field>
  );
}

const SelectRoot = styled(SelectPrimitive, {
  base: {
    d: "flex",
    flexDir: "row-reverse",
  },
});
const SelectTrigger = styled(SelectTriggerPrimitive, {
  base: {
    d: "flex",
    alignItems: "center",
    g: "sm",
    b: "neutral",
    r: "xs",
    py: "xs",
    px: "sm",
    "& svg": { w: 16, h: 16 },
    ln: "transparent",
    transition: "outline 50ms ease-in-out",
    userSelect: "none",
    "&:focus-within": { ln: "focus" },
    "*:has(* + select:user-invalid) &": {
      b: "error",
      "&:focus-within": { ln: "focusError" },
    },
    "&[data-placeholder]": { color: "text2" },
  },
});
const SelectValue = styled(SelectValuePrimitive, {
  base: {
    userSelect: "none",
  },
});
const SelectContent = styled(SelectContentPrimitive, {
  base: {
    bg: "background",
    p: "xs",
    b: "neutral",
    r: "sm",
    zIndex: 1024,
  },
});

type SelectOption = Omit<SelectItemProps, "children"> & { label: string };
type SelectProps = Omit<
  SelectPrimitiveProps & {
    label?: string;
    options: SelectOption[];
    placeholder?: string;
    leadingIcon?: ReactNode;
  },
  "children"
>;
export function Select({ name, label, placeholder, leadingIcon, options, ...selectProps }: SelectProps) {
  return (
    <div className={fieldCss()}>
      {label && <label className={labelCss()}>{label}</label>}
      <SelectRoot name={name} {...selectProps}>
        <SelectTrigger>
          {!!leadingIcon && leadingIcon}
          <SelectValue placeholder={placeholder} />
          <SelectIcon asChild>
            <ChevronDownIcon size={16} />
          </SelectIcon>
        </SelectTrigger>
        <SelectPortal>
          <SelectContent>
            <SelectScrollUpButton />
            <SelectViewport>
              {options.map(({ value, label, ...props }) => {
                return (
                  <SelectItem key={value} value={value} {...props}>
                    {label ?? value}
                  </SelectItem>
                );
              })}
            </SelectViewport>
            <SelectScrollDownButton />
          </SelectContent>
        </SelectPortal>
      </SelectRoot>
      {selectProps.required && (
        <styled.div
          className={messageCss()}
          data-invalid
          css={{
            display: "none",
            "select:user-invalid + &": { display: "initial" },
          }}
        >
          {label} is required
        </styled.div>
      )}
    </div>
  );
}
const SelectItemRoot = styled(SelectItemPrimitive, {
  base: {
    p: "xs",
    r: "xs",
    pos: "relative",
    px: "lg",
    alignItems: "center",
    userSelect: "none",
    "&[data-highlighted]": { bg: "highlight" },
    "&[data-disabled]": { cursor: "not-allowed", o: 0.5 },
    "&:focus": { ln: "none" },
  },
});
const SelectItemText = styled(SelectItemTextPrimitive, {
  base: {
    userSelect: "none",
  },
});

const SelectItemIndicator = styled(SelectItemIndicatorPrimitive, {
  base: {
    pos: "absolute",
    top: "calc(50% - 8px)",
    left: 8,
  },
});
export function SelectItem({ children, ...props }: SelectItemProps) {
  return (
    <SelectItemRoot {...props}>
      <SelectItemText>{children}</SelectItemText>
      <SelectItemIndicator asChild>
        <CheckIcon size={16} />
      </SelectItemIndicator>
    </SelectItemRoot>
  );
}
