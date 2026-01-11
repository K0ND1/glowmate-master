import { api } from './api';

export const waitlistService = {
    async joinWaitlist(email: string, referredBy?: string | null): Promise<any> {
        // Web uses: /v1/waitlist. Assuming backend route structure matches or mapped.
        // The user showed `backend/src/routes/waitlist.routes.ts` exists.
        // Likely mounted at /api/v1/waitlist or just /waitlist depending on app.ts.
        // Looking at auth.routes.ts, it was mounted on router.
        // I'll assume /waitlist or /v1/waitlist. web used `${apiUrl}/v1/waitlist`.
        // My api wrapper uses base+endpoint.
        return api.post('/v1/waitlist', { email, referredBy }, false);
    },
};
