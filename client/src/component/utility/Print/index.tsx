import { Slot } from "@radix-ui/react-slot";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Portal } from "component";
import Frame from "react-frame-component";

import preflight from "preflight.css?inline";
import print from "print.css?inline";
import "./style.css";

export type StyleString = string;

export function Print({
  content,
  children,
  style,
}: {
  content?: ReactNode;
  children: JSX.Element;
  style?: StyleString;
}) {
  const [isPrinting, setIsPrinting] = useState(false);
  const handleClick = () => {
    setIsPrinting(true);
  };

  return (
    <>
      <Slot onClick={handleClick}>{children}</Slot>
      {isPrinting && (
        <Portal>
          <Content style={style} onPrintChange={setIsPrinting}>
            {content}
          </Content>
        </Portal>
      )}
    </>
  );
}

const PRINT_CONTENT_MOUNT_DELAY = 64;
function getInitialContent(styles: StyleString = "") {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          ${preflight}
          ${print}
          ${styles}
        </style>
      </head>
      <body>
        <div></div> <!-- providing initial content requires we have a child of body -->
      </body>
    </html>
  `;
}

function Content({
  children,
  onPrintChange,
  style,
}: {
  children?: ReactNode;
  onPrintChange(print: boolean): void;
  style?: StyleString;
}) {
  const printRootRef = useRef<HTMLIFrameElement>(null);
  const hasRunOnce = useRef(false); // printing related state (not using useState api to avoid re-render)

  const handlePrintFinish = () => {
    onPrintChange(false);
  };
  const handlePrint = () => {
    if (!printRootRef.current?.contentWindow) {
      throw new Error("printRootRef.current?.contentWindow is null");
    }
    // @ts-expect-error __container__ does not exist on Window
    printRootRef.current.contentWindow.__container__ = printRootRef.current;
    printRootRef.current.contentWindow.onbeforeunload = handlePrintFinish;
    printRootRef.current.contentWindow.onafterprint = handlePrintFinish;
    printRootRef.current.contentWindow?.focus(); // Required for IE
    printRootRef.current.contentWindow?.print();
  };

  useEffect(() => {
    if (hasRunOnce.current) {
      return;
    }
    setTimeout(handlePrint, PRINT_CONTENT_MOUNT_DELAY); // todo: find a away around this delay... I'm not a fan
    hasRunOnce.current = true;
  }, [children]);

  return (
    <Frame
      initialContent={getInitialContent(style)}
      className="print-container"
      ref={printRootRef}
    >
      {children}
    </Frame>
  );
}
