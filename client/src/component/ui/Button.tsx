import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { type LinkProps, Link } from "@tanstack/react-router";
import { type RecipeVariantProps, cva } from "panda/css";
import { SystemStyleObject } from "panda/types";

const styles = cva({
  base: {
    px: "md",
    h: 40,
    r: "xs",

    display: "inline-flex",
    flexDir: "row",
    gap: "sm",
    justifyContent: "center",
    alignItems: "center",

    whiteSpace: "nowrap",

    cursor: "pointer",
    userSelect: "none",

    "& svg": { w: 18, h: 18 },

    ln: "transparent",

    "&:disabled": {
      cursor: "not-allowed",
      filter: "grayscale(0.33)",
      opacity: 0.5,
    },

    transition: "background-color 100ms, color 100ms, outline 50ms ease-in-out",
  },
  variants: {
    color: {
      primary: {},
      tonal: {},
    },
    variant: {
      solid: {},
      outlined: {},
      ghost: { bg: "transparent", px: 0, py: 0 },
      plain: { bg: "transparent" },
    },
    width: {
      full: { w: "100%" },
      greedy: { flex: 1 },
    },
    compact: {
      [`true`]: {
        fontSize: 14,
        h: "auto",
        px: 4,
        py: 2,
        g: "xs",
        "& svg": { w: 14, h: 14 },
      },
    },
  },
  defaultVariants: {
    color: "primary",
    variant: "solid",
    compact: false,
  },

  compoundVariants: [
    {
      color: "primary",
      variant: "solid",
      css: {
        bg: "primary",
        color: "onPrimary",
        "&:hover:not(:disabled)": { bg: "primary2" },
      },
    },
    {
      color: "primary",
      variant: "outlined",
      css: {
        bg: "transparent",
        color: "primary",
        b: "primary",
        "&:hover:not(:disabled)": { bg: "highlight" },
      },
    },
    {
      color: "primary",
      variant: "ghost",
      css: {
        color: "primary",
        "&:hover:not(:disabled)": {
          color: "primary2",
          textDecoration: "underline",
        },
      },
    },
    {
      color: "primary",
      variant: "plain",
      css: {
        color: "primary",
        "&:hover:not(:disabled)": {
          color: "onPrimary",
          bg: "primary",
        },
      },
    },
    {
      color: "tonal",
      variant: "solid",
      css: {
        bg: "surface",
        color: "text",
        "&:hover:not(:disabled)": { bg: "highlight" },
      },
    },
    {
      color: "tonal",
      variant: "outlined",
      css: {
        bg: "transparent",
        color: "text",
        b: "neutral",
        "&:hover:not(:disabled)": { bg: "highlight" },
      },
    },
    {
      color: "tonal",
      variant: "ghost",
      css: {
        color: "text2",
        "&:hover:not(:disabled)": { textDecoration: "underline" },
      },
    },
    {
      color: "tonal",
      variant: "plain",
      css: {
        color: "text2",
        "&:hover:not(:disabled)": { bg: "highlight" },
      },
    },
  ],
});

export type ButtonProps = RecipeVariantProps<typeof styles> & {
  children: React.ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  css?: SystemStyleObject;
};

function ButtonInternal({
  children,
  leadingIcon,
  trailingIcon,
}: Pick<ButtonProps, "children" | "leadingIcon" | "trailingIcon">) {
  return (
    <>
      {!!leadingIcon && leadingIcon}
      {children}
      {!!trailingIcon && trailingIcon}
    </>
  );
}

export function Button({
  children,
  leadingIcon,
  trailingIcon,
  compact,
  ...props
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={styles({ ...props, compact })} {...props}>
      <ButtonInternal leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
        {children}
      </ButtonInternal>
    </button>
  );
}

type ButtonLinkProps = HTMLAttributes<HTMLAnchorElement> & LinkProps & ButtonProps;
export function ButtonLink({ className, children, leadingIcon, trailingIcon, ...props }: ButtonLinkProps) {
  return (
    <Link className={`${styles(props)} ${className}`} {...props}>
      <ButtonInternal leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
        {children}
      </ButtonInternal>
    </Link>
  );
}

export function ButtonAnchor({
  children,
  variant = "ghost",
  color = "primary",
  ...props
}: ButtonProps & HTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={styles({ variant, color })} {...props}>
      <ButtonInternal {...props}>{children}</ButtonInternal>
    </a>
  );
}
