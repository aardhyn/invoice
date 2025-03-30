import {
  type ScrollAreaProps,
  ScrollArea as PrimitiveScrollArea,
  Scrollbar as PrimitiveScrollbar,
  Thumb as PrimitiveThumb,
  Viewport as PrimitiveViewport,
  Corner as PrimitiveCorner,
} from "@radix-ui/react-scroll-area";
import { styled } from "panda/jsx";

const THUMB_SIZE = 10;

export function Scroll({
  children,
  ...props
}: {
  children: React.ReactNode;
} & ScrollAreaProps) {
  return (
    <Root {...props}>
      <Viewport>{children}</Viewport>
      <Scrollbar orientation="horizontal">
        <Thumb />
      </Scrollbar>
      <Scrollbar orientation="vertical">
        <Thumb />
      </Scrollbar>
      <Corner />
    </Root>
  );
}

const Root = styled(PrimitiveScrollArea, { base: { overflow: "hidden" } });

const Viewport = styled(PrimitiveViewport, {
  base: {
    w: "100%",
    h: "100%",
    overflow: "auto",
  },
});

const Scrollbar = styled(PrimitiveScrollbar, {
  base: {
    d: "flex",
    userSelect: "none",
    touchAction: "none",
    p: 2,
    "&[data-orientation='horizontal']": { h: THUMB_SIZE },
    "&[data-orientation='vertical']": { w: THUMB_SIZE },
  },
});

const Thumb = styled(PrimitiveThumb, {
  base: {
    flex: 1,
    r: "sm",
    pos: "relative",
    transition: "background-color 100ms",
    bg: "text3",
    "&:hover": { bg: "text" },
    "&::before": {
      /* increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html */
      content: "''",
      pos: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      w: "100%",
      h: "100%",
      minW: 48,
      minH: 48,
    },
  },
});

const Corner = styled(PrimitiveCorner, { base: {} });
