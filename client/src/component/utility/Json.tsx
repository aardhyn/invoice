import { type Override, formatJson } from "common";

/**
 * Renders JSON in preformatted text.
 */
export function Json({ children, ...props }: Override<React.HTMLProps<HTMLPreElement>, { children: unknown }>) {
  return <pre {...props}>{formatJson(children)}</pre>;
}
