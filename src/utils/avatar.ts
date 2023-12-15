import {generateFromString} from "generate-avatar";

export function generateAvatar(id: string) {
    return `data:image/svg+xml;utf8,${generateFromString(id)}`;
}