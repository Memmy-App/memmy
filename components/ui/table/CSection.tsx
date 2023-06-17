import React from "react";
import {Section} from "react-native-tableview-simple";
import {SectionInterface} from "react-native-tableview-simple/lib/typescript/components/Section";

const CSection = (props: SectionInterface) => {
    return (
        <Section
            roundedCorners={true}
            hideSurroundingSeparators={true}
            {...props}
        >
            {props.children}
        </Section>
    );
};

export default CSection;