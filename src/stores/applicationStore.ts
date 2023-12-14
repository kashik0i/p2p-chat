import {writable} from "svelte/store";
import {ApplicationManager} from "@services/ApplicationManager";


export const applicationStore = writable(new ApplicationManager())
