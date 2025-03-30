import { type HTMLAttributes } from "react";
import { type RecipeVariantProps, cva } from "panda/css";
import { styled } from "panda/jsx";

// note: this is a duplicate definition (fixme: Panda breaks if we try to use an imported symbol... probably related to codegen)
export function rem(px: number) {
  const rem = px / 16;
  return `${rem}rem`;
}

const styles = cva({
  base: {
    display: "block",
  },
  variants: {
    monospace: {
      true: { fontFamily: "monospace" },
    },
    color: {
      "1": { color: "text1" },
      "2": { color: "text2" },
      "3": { color: "text3" },
      "4": { color: "text4" },
    },
    scale: {
      "-1": { fontSize: rem(12), lineHeight: rem(16) },
      "1": { fontSize: rem(16), lineHeight: rem(20) },
      "2": { fontSize: rem(18), lineHeight: rem(24) },
      "3": { fontSize: rem(24), lineHeight: rem(28) },
      "4": { fontSize: rem(28), lineHeight: rem(36) },
      "5": { fontSize: rem(36), lineHeight: rem(48) },
      "6": { fontSize: rem(48), lineHeight: rem(64) },
    },
    weight: {
      "1": { fontWeight: 400 },
      "2": { fontWeight: 500 },
      "3": { fontWeight: 600 },
      "4": { fontWeight: 700 },
      "5": { fontWeight: 800 },
      "6": { fontWeight: 900 },
    },
    case: {
      upper: { textTransform: "uppercase" },
      lower: { textTransform: "lowercase" },
      title: { textTransform: "capitalize" },
    },
    selectable: {
      true: { userSelect: "text" },
      false: { userSelect: "none", cursor: "default" },
    },
  },
  defaultVariants: {
    scale: "1",
    color: "1",
    weight: "1",
    selectable: false,
  },
});

// Text //

export type TextProps = RecipeVariantProps<typeof styles> &
  HTMLAttributes<HTMLSpanElement> & {
    children: React.ReactNode;
  };

export const Text = styled("span", styles);

// Heading //

export function H1({ children, ...props }: TextProps) {
  return (
    <h1 className={styles({ scale: "6", weight: "6", ...props })} {...props}>
      {children}
    </h1>
  );
}

export function H2({ children, ...props }: TextProps) {
  return (
    <h2 className={styles({ scale: "5", weight: "6", ...props })} {...props}>
      {children}
    </h2>
  );
}

export function H3({ children, ...props }: TextProps) {
  return (
    <h3 className={styles({ scale: "4", weight: "5", ...props })} {...props}>
      {children}
    </h3>
  );
}

export function H4({ children, ...props }: TextProps) {
  return (
    <h4 className={styles({ scale: "3", weight: "5", ...props })} {...props}>
      {children}
    </h4>
  );
}

export function H5({ children, ...props }: TextProps) {
  return (
    <h5 className={styles({ scale: "2", weight: "4", ...props })} {...props}>
      {children}
    </h5>
  );
}

export function H6({ children, ...props }: TextProps) {
  return (
    <h6 className={styles({ scale: "1", weight: "4", ...props })} {...props}>
      {children}
    </h6>
  );
}
