import React from "react";
import { selectThemeOptions } from "@src/slices/settings/settingsSlice";
import { useAppSelector } from "@root/store";
import { Section } from "@gkasdorf/react-native-tableview-simple";
import { SectionInterface } from "@gkasdorf/react-native-tableview-simple/lib/typescript/components/Section";

function CSection({ ...props }: SectionInterface) {
  const theme = useAppSelector(selectThemeOptions);
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
