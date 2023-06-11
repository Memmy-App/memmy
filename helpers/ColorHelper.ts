export const depthToColor = (depth: number): string => {
    switch(depth) {
    case 1: return "#b51c14";
    case 2: return "#e07625";
    case 3: return "#efc91c";
    case 4: return "#b4cb18";
    case 5: return "#39cb18";
    case 6: return "#18cb86";
    case 7: return "#1895cb";
    default: return "#1836cb";
    }
};