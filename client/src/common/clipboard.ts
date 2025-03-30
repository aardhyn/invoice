export function addToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
