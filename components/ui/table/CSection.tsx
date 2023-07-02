import React from "react";
import { Section } from "@gkasdorf/react-native-tableview-simple";
import { SectionInterface } from "@gkasdorf/react-native-tableview-simple/lib/typescript/components/Section";

function CSection({ ...props }: SectionInterface) {
  return (
    <Section roundedCorners hideSurroundingSeparators {...props}>
      {props.children}
    </Section>
  );
}

export default CSection;
