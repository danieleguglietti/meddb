import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import type { RequestEvent } from '@sveltejs/kit';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';

import { db } from '$lib/server/db';
import { user, session, type ISession } from '$lib/server/db/schema';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
    const bytes = crypto.getRandomValues(new Uint8Array(18));
    const token = encodeBase64url(bytes);
    return token;
}

export async function createSession(token: string, userId: string) {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    const s: ISession = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
    };

    await db.insert(session).values(s);

    return s;
}

export async function validateSessionToken(token: string) {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    const [result] = await db
        .select({
            // Adjust user table here to tweak returned data
            user: { id: user.id, username: user.username },
            session: session
        })
        .from(session)
        .innerJoin(user, eq(session.userId, user.id))
        .where(eq(session.id, sessionId));

    if (!result) {
        return { session: null, user: null };
    }
    
    const { session: s, user: u } = result;

    const sessionExpired = Date.now() >= s.expiresAt.getTime();

    if (sessionExpired) {
        await db.delete(session).where(eq(session.id, session.id));
        return { session: null, user: null };
    }

    const renewSession = Date.now() >= s.expiresAt.getTime() - DAY_IN_MS * 15;

    if (renewSession) {
        s.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
        await db
            .update(session)
            .set({ expiresAt: s.expiresAt })
            .where(eq(session.id, session.id));
    }

    return { session: s, user: u };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
    await db.delete(session).where(eq(session.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
    event.cookies.set(sessionCookieName, token, {
        expires: expiresAt,
        path: '/'
    });
}

export function deleteSessionTokenCookie(event: RequestEvent) {
    event.cookies.delete(sessionCookieName, {
        path: '/'
    });
}
