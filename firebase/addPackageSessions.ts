import { getSessionForUser, saveSession, initializeSession,  } from './signUpSession';

export { addPackageSessions }


async function addPackageSessions(phone: string, text: string) {
    const session = await getSessionForUser(phone);

    const step = session.package;

    switch (step) {
        case 'awaiting_pkg_title':
            session.package = ''


    }
}