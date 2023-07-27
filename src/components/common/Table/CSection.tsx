import React from "react";
import { Section } from "@gkasdorf/react-native-tableview-simple";
import { SectionInterface } from "@gkasdorf/react-native-tableview-simple/lib/typescript/components/Section";
import { useThemeOptions } from "@src/stores/settings/settingsStore";

function CSection({ ...props }: SectionInterface) {
  const theme = useThemeOptions();
  return (
    <Section
      roundedCorners
      hideSurroundingSeparators
      separatorTintColor={theme.colors.border}
      {...props}
      header={props.header ? props.header.toUpperCase() : ""}
    >
      {props.children}
    </Section>
  );
}

export default CSection;
