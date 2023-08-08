import React from "react";
import {
  createProvider,
  GluestackUIContextProvider,
} from "@gluestack-ui/provider";
import { StyledProvider } from "@gluestack-style/react";
import { OverlayProvider } from "@gluestack-ui/overlay";
import { ToastProvider } from "@gluestack-ui/toast";

const GluestackUIStyledProvider = createProvider({ StyledProvider });

interface IProps {
  children: React.JSX.Element;
  props: any;
}

function GluestackUIProvider({
  children,
  ...props
}: IProps): React.JSX.Element {
  return (
    <GluestackUIStyledProvider {...props} config={{}}>
      <OverlayProvider>
        <ToastProvider>{children}</ToastProvider>
      </OverlayProvider>
    </GluestackUIStyledProvider>
  );
}

export {
  GluestackUIProvider,
  GluestackUIStyledProvider,
  GluestackUIContextProvider,
};
