export interface WhatsAppWebhookPayload {
    object: string; // will be "whatsapp_business_account"
    entry: WhatsAppEntry[];
}

export interface WhatsAppEntry {
    id: string; // WhatsApp Business Account ID
    changes: WhatsAppChange[];
}

export interface WhatsAppChange {
    field: string; // Expected to be "messages"
    value: WhatsAppValue;
}

export interface WhatsAppValue {
    messaging_product: string; // Should be "whatsapp"
    metadata: WhatsAppMetadata;
    contacts?: WhatsAppContact[];
    messages?: WhatsAppMessage[];
}

export interface WhatsAppMetadata {
    display_phone_number: string;
    phone_number_id: string;
}

export interface WhatsAppContact {
    profile: {
        name: string;
    };
    wa_id: string; // Customer's WhatsApp ID
}

// **WhatsApp Message Types**
export interface WhatsAppMessage {
    context: {
        from: string,
        id: string,
        replied_message: string,
    },
    from: string;
    id: string;
    timestamp: string | number;
    type: "text" | "image" | "video" | 'audio' | "interactive";
    text: {
        body: string;
    };
    image: {
        id: string;
        mime_type: string;
        sha256?: string;
        caption?: string;
    };
    video: {
        id: string;
        mime_type: string;
        sha256?: string;
        caption?: string;
    };
    audio: {
        id: string;
        mime_type: string;
        sha256?: string;
        voice: boolean;
    };
    interactive: {
        type: string;
        button_reply?: {
            id: string;
            title: string;
        };
        list_reply?: {
            id: string;
            title: string;
            description?: string;
        };
    };
}

// **Text Message**
export interface WhatsAppTextMessage {
    context: {
        from: string,
        id: string,
        replied_message: string,
    },
    from: string;
    id: string;
    timestamp: string | number;
    type: "text";
    text: {
        body: string;
    };
}

// **Image Message**
export interface WhatsAppImageMessage {
    from: string;
    id: string;
    timestamp: string | number;
    type: "image";
    image: {
        id: string;
        mime_type: string;
        sha256?: string;
        caption?: string;
    };
}

// **Video Message**
export interface WhatsAppVideoMessage {
    from: string;
    id: string;
    timestamp: string | number;
    type: "video";
    video: {
        id: string;
        mime_type: string;
        sha256?: string;
        caption?: string;
    };
}

// **Audio Message**
export interface WhatsAppAudioMessage {
    from: string;
    id: string;
    timestamp: string | number;
    type: "audio";
    audio: {
        id: string;
        mime_type: string;
        sha256?: string;
    };
}

// **Document Message**
export interface WhatsAppDocumentMessage {
    from: string;
    id: string;
    timestamp: string | number;
    type: "document";
    document: {
        id: string;
        mime_type: string;
        filename?: string;
        sha256?: string;
        caption?: string;
    };
}

// **Sticker Message**
export interface WhatsAppStickerMessage {
    from: string;
    id: string;
    timestamp: string | number;
    type: "sticker";
    sticker: {
        id: string;
        mime_type: string;
        sha256?: string;
    };
}

// **Interactive Message (e.g., Buttons, List Messages)**
export interface WhatsAppInteractiveMessage {
    from: string;
    id: string;
    timestamp: string | number;
    type: "interactive";
    interactive: {
        type: string;
        button_reply?: {
            id: string;
            title: string;
        };
        list_reply?: {
            id: string;
            title: string;
            description?: string;
        };
    };
}