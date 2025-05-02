import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppValue, WhatsAppMessage } from './whatsappTypes';
import { processWhatsAppMessage } from '@/app/api/whatsapp/processWebhook';
import { getUserByWAID } from '@/firebase/users';
import { handleSignUpFlow } from '@/app/api/whatsapp/nonUsers/signUp';
import { handleBusiness } from '@/app/api/whatsapp/business/handleBusiness';
import { handleUser } from '@/app/api/whatsapp/users/handleUser';
// import { sendUrlButton } from '@/app/api/whatsapp/messages/ctaMessages';

const WHATSAPP_OBJECT = 'whatsapp_business_account';


// Fail fast if you forgot to set this, when verifyin the webhook endpoint.
const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;
if (!VERIFY_TOKEN) {
  throw new Error('Missing env var WEBHOOK_VERIFY_TOKEN');
}

// Top-level GET handler: Webhook endpoint verfication
export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode      = searchParams.get('hub.mode');
  const token     = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Only allow if they’re subscribing AND the token matches
  if (mode === 'subscribe' && token === VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse('Forbidden', { status: 403 });
}

// Top-level POST handler: handle HTTP POST from WhatsApp
export async function POST(req: NextRequest) {
    // 1. Parse and Validation
    const body = await req.json().catch( () => null );
    if (!body || body.object !== WHATSAPP_OBJECT) {
        return new NextResponse('Bad Request', { status: 400 });
    }

    // 2. Drill into the first change
    const change = body.entry?.[0]?.changes?.[0];
    const value = change?.value;
    if (!value) {
        return new NextResponse('No payload to process', { status: 200 });
    }

    // 3. Handle status updates (if any)
    if (value.statuses?.length) {
        await handleStatus(value.statuses[0]);
    }

    // 4. Handle incoming message (if any)
    const msg = value.messages?.[0];
    if (!msg) {
        return new NextResponse(null, { status: 200 });
    }
    await handleIncomingMessage(msg, value);

    // 5. Alwayes return 200
    return new NextResponse(null, { status: 200 });
}

// ---------------
// Helpers
// ---------------
async function handleStatus(status: { id: string, status: string }) {
    console.log(`Status update: [${status.id}] -> ${status.status}`);
}

async function handleIncomingMessage(msg: WhatsAppMessage, value: WhatsAppValue) {
    console.log(`Incoming message:`, JSON.stringify(msg, null, 2));

    const waId = value.contacts?.[0]?.wa_id;
    const user = waId ? await getUserByWAID(waId) : null;
    const role = user?.role;

    switch (role) {
        case 'business':
            await handleBusiness(msg, user?.uid);
            break
        case 'user':
            await handleUser(msg);
            break
        case 'non-user':
            await handleSignUpFlow(msg);
            break
    }
}