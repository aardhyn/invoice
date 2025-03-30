import { type RefObject, useEffect, useState } from "react";

type FrameSize = { width: number; height: number };

const INITIAL_FRAME_SIZE = { width: 300, height: 150 }; // browser default iframe size
const MESSAGE_EVENT_LISTENER = "message";
const SEND_MESSAGE_INTERVAL_MS = 1_000;

function isFrameSize(size: unknown): size is FrameSize {
  return typeof size === "object" && size !== null && "width" in size && "height" in size;
}

/**
 * Creates a scripts that reports the size of the window and posts it to the the topmost window.
 * @param parentOrigin origin to post size information to.
 * @returns JavaScript code string
 */
function createIframeSizeDetectionScript(parentOrigin: string) {
  return `
  function getDocumentSize() {
    return { 
      width: document.body.scrollWidth,
      height: document.body.scrollHeight,
    };
  }

  function sendSize(size) {
    window.top.postMessage(size, "${parentOrigin}"); 
  }

  setInterval(() => {
    const size = getDocumentSize();
    sendSize(size);
  }, ${SEND_MESSAGE_INTERVAL_MS});
`;
}

/**
 * Hooks dynamic sizing functionality into an iframe
 * @returns script that must be injected into the iframe to detect the size of the scrollable area.
 */
export function useFrameSize(ref: RefObject<HTMLIFrameElement | null>) {
  const [size, setSize] = useState(INITIAL_FRAME_SIZE);

  const origin = window.location.origin;

  useEffect(() => {
    const handleReceiveMessage = ({ origin: messageOrigin, data }: MessageEvent) => {
      if (messageOrigin !== origin) return null; // ignore messages to other origins
      if (!isFrameSize(data)) return; // ignore messages not for us
      setSize(data);
    };

    window.addEventListener(MESSAGE_EVENT_LISTENER, handleReceiveMessage);
    return () => {
      window.removeEventListener(MESSAGE_EVENT_LISTENER, handleReceiveMessage);
    };
  }, [origin, ref]);

  const script = createIframeSizeDetectionScript(origin);

  return { script, size };
}
