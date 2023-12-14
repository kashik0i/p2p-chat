const hexValues: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e"];

function populate(a: string) {
    for (let i = 0; i < 6; i++) {
        const x = Math.round(Math.random() * 14);
        const y = hexValues[x];
        a += y;
    }
    return a;
}

export function randomGradiant() {
    const angle = Math.round(Math.random() * 360);

    return "linear-gradient(" + angle + "deg, " + populate('#') + ", " + populate('#') + ")";
}