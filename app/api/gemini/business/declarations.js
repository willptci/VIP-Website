import { Type } from '@google/genai';

export { 
    showUserProfile,
    showBusiness,
    showPackages,
    displaySettings,

    editUserProfile,
    editProfileImage,
    editBusiness,
    editBusinessImage,

    addNewTourPackage,
    updateTourPackage,
}

const showUserProfile = {
    name: 'show_user_profile',
    description: `Shows current user profiles.`
}

const editUserProfile = {
    name: 'edit_user_profile',
    description: `Edits, updates, changes current user profiles.`
}

const editProfileImage = {
    name: 'edit_profile_image',
    description: `Edits current user profiles image.`
}

const showBusiness = {
    name: 'show_business_page',
    description: 'Shows information of the website.'
}

const showPackages = {
    name: 'show_packages',
    description: 'Shows information of the packages of the business.'
}

const editBusiness = {
    name: 'edit_business_page',
    description: `Edits, updates, changes information of the website.`
}

const editBusinessImage = {
    name: 'edit_business_image',
    description: `Edits, updates, changes current business images.`
}

const displaySettings = {
    name: 'display_settings',
    description: `Updates the website settings to customize the display of various elements.
    Only business owner is allowed to change settings.
    For example:
        - Customize settings.
        - Updaet settings.
        - Modify settings.
        - Change settings.`,
    parameters: {
        type: Type.OBJECT,
    }
};

const addNewTourPackage = {
    name: 'add_package_tour',
    description: `
        Use this function whenever the user expresses intent to add or create a tour package—
        e.g. “I want to add a new package,” “create a package,” “add a package of Fun Fishing Tour,” etc.
        The title is optional; if omitted, it will default to null.`,
    parameters: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
                description: 'Optional. The name of the tour package (e.g. “Fun Fishing Tour”).',
            },
        },
    }
}

const updateTourPackage = {
    name: 'update_tour_package',
    description: `
        Manages tour packages on the website. 
        Modify an existing one, or turn off outdated offers. 
        At lease one arugment except pakcage title is required.
        If more than one package titles are given, at least one parameter to change for each of packages are required.`,
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



const updateDesctiption = {
    name: 'update_description',
    description: `Updates the business (company) and/or owner description or profile on the website.`,
    parameters: {
        type: 'object',
        properties: {
            companyDescription: {
                type: 'string',
                description: 'The new business description or profile to display on the website. Omit this if you do not wish to change the business description.'
            },
            ownerDescription: {
                type: 'string',
                description: 'The new owner description or profile to display on the website. Omit this if you do not wish to change the owner description.'
            }
        },
        required: [] // Both properties are optional.
    }
}