import React from "react";
import {
  createProvider,
  GluestackUIContextProvider,
} from "@gluestack-ui/provider";
import { ICustomConfig, StyledProvider } from "@gluestack-style/react";
import { OverlayProvider } from "@gluestack-ui/overlay";
import { ToastProvider } from "@gluestack-ui/toast";

const GluestackUIStyledProvider = createProvider({ StyledProvider });

interface IProps {
  children: React.JSX.Element;
  config: ICustomConfig;
}

function GluestackUIProvider({ children, config }: IProps): React.JSX.Element {
  return (
    <GluestackUIStyledProvider config={config}>
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
