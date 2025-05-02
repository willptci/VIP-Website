import { Type } from '@google/genai';

// Define the function declarations for the Gemini model
export const welcomeMessageFunctionDeclaration = {
    name: 'welcome_message',
    description: `If the user is non-user of the Andros Platform, this function is always called, , otherwise do not call.
    Sends a welcome message to a user prompt. e.g. Hi, Hello.`
}


export const updateProfileImageFunctionDeclaration = {
    name: 'update_profile_image',
    description: 'Updates a profile image or photo on the website.',
}



export const updateTourPackageFunctionDeclaration = {
    name: 'update_tour_package',
    description: `Manages tour packages on the website. 
                    modify an existing one, or turn off outdated offers. 
                    Other detal are optionl. If not give, set them as default values.
                    For example:
                    - To add a package: "New Package: Sunset Fishing Tour – $150 per person, available every Saturday and Sunday"
                    - To turn off outdated offers: "Turn off outdated offers."`,
    parameters: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
                description: 'The title of the package.'
            },
            status: {
                type: 'boolean',
                description: 'The status of the package. For new or modified packages, true means active. For turning off, set to false. '
            },
            amount: {
                type: 'string',
                description: 'The price of the package (numeric value). Defaults to "30" if not provided.'
            },
            per: {
                type: 'string',
                description: 'The unit for the package price (e.g., "person", "total", "hour"). Defaults to "total" if not provided.'
            },
            capacity: {
                type: 'string',
                description: 'The capacity or available slots for this package. Defaults to "10" if not provided.'
            },
            total: {
                type: 'number',
                description: 'A description of the total time (e.g., "3 hours"). Defaults to "2 hours" if not provided.'
            },
            what: {
                type: 'string',
                description: 'Description of what is included or what you will do in this tour package. Defaults to "None" if not provided.'
            },
            time: {
                type: 'string',
                description: 'Description of how long the package lasts or its schedule. Defaults to "None" if not provided.'
            },
            included: {
                type: 'string',
                description: 'Description of what is included in the package (e.g., equipment, meal). Defaults to "None" if not provided.'
            },
            bring: {
                type: 'string',
                description: 'Description of what customers should bring with them. Defaults to "None" if not provided.'
            },
        },
        required: ['title'] // All properties are optional. The required ones depend on the "action"
    }
};





export const getAvailableBusinessFunctionDeclaration = {
    name: 'get_current_businesses',
    description: 'Gets list of available businesses or companies on the platform.',
}

export const getBusinessInformationFunctionDeclaration = {
    name: 'get_businesses_information',
    description: 'Gets business or company information by a specific business or company.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            businessName: {
                type: Type.STRING,
                description: 'The business or company name, e.g. Uber',
            },
        },
        required: ['businessName'],
    },
}

export const getBusinessPackagesFunctionDeclaration = {
    name: 'get_businesses_packages',
    description: 'Gets availble packages offered by a specific business.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            businessName: {
                type: Type.STRING,
                description: 'The business name, e.g. Uber',
            },
        },
        required: ['businessName'],
    },
}