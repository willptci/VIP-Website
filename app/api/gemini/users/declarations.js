import { Type } from '@google/genai';

export { search_businesses, recommend_businesses };

const recommend_businesses = {
    name: 'recommend_businesses',
    description: [
        'Recommend businesses whose description or name matches the user request.',
        ].join(" "),
};

const search_businesses = {
    name: 'search_businesses',
    description: [
        'Search for businesses whose description or name matches a query',
        'or',
        'Search for businesses whose packages name matches a query.'
        ].join(" "),
    parameters: {
        type: Type.OBJECT,
        properties: {
            query: {
                type: Type.STRING,
                description: [
                    'Search terms.',
                    'E.g., "fishing", "boat", "diving", etc.',
                ].join(" ")
            },
            limit: {
                type: Type.NUMBER,
                description: 'Maximum number of results to return.',
            },
        },
        required: [ 'query' ],
    },
};

const display_businesses = {
    name: 'display_businesses',
    description: [
        'Dsiplay availble businesses on the Andros platform.',
    ].join("\n"),
    parameters: {
        type: Type.OBJECT,
        properties: {},
    },
    required: [],
};