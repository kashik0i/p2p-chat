// @ts-ignore
import { uniqueNamesGenerator, type Config, starWars } from 'unique-names-generator';

const config: Config = {
    dictionaries: [starWars]
}

export const generateName = () => uniqueNamesGenerator(config);