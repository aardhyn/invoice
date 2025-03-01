import { Override } from "common";

/**
 * Renders JSON in preformatted text.
 */
export function Json({
  children,
  ...props
}: Override<React.HTMLProps<HTMLPreElement>, { children: unknown }>) {
  return <pre {...props}>{JSON.stringify(children, null, 2)}</pre>;
}
