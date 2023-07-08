import React from "react";
import { Section } from "@gkasdorf/react-native-tableview-simple";
import { SectionInterface } from "@gkasdorf/react-native-tableview-simple/lib/typescript/components/Section";
import { useTheme } from "native-base";

function CSection({ ...props }: SectionInterface) {
  const theme = useTheme();
  return (
    <Section
      roundedCorners
      hideSurroundingSeparators
      separatorTintColor={theme.colors.app.border}
      {...props}
      header={props.header ? props.header.toUpperCase() : ""}
    >
      {props.children}
    </Section>
  );
}

export default CSection;
