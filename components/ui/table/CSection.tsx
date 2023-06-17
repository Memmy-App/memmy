import React from "react";
import {Section} from "react-native-tableview-simple";

interface CSectionProps {
    props?: object,
    children: React.ReactNode
}

const CSection = ({props, children}: CSectionProps) => {
    return (
        <Section
            roundedCorners={true}
            hideSurroundingSeparators={true}
            {...props}
        >
            {children}
        </Section>
    );
};

export default CSection;