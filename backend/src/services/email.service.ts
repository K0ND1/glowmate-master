import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    // In a real app, this should link to the frontend verification page
    // For now, we might link to the text, or a specific endpoint
    const verificationUrl = `${process.env.APP_URL || 'https://glowmate.tech'}/auth/verify-email?token=${token}`;

    // Use configured sender or default to Resend testing domain if not specified
    const fromAddress = process.env.RESEND_FROM || 'onboarding@glowmate.tech';

    try {
        const data = await resend.emails.send({
            from: `GlowMate <${fromAddress}>`,
            to: [email],
            subject: 'Verify your GlowMate Account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Welcome to GlowMate!</h2>
                    <p>Please click the button below to verify your email address and activate your account.</p>
                    <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Verify Email</a>
                    <p>If you didn't create an account, you can safely ignore this email.</p>
                </div>
            `,
        });

        console.log('Verification email sent:', data);
        return data;
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
    const resetUrl = `${process.env.APP_URL || 'https://glowmate.tech'}/auth/reset-password?token=${token}`;
    const fromAddress = process.env.RESEND_FROM || 'onboarding@glowmate.tech';

    try {
        await resend.emails.send({
            from: `GlowMate <${fromAddress}>`,
            to: [email],
            subject: 'Reset your GlowMate Password',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Reset Password</h2>
                    <p>You requested a password reset. Click the button below to reset it.</p>
                    <a href="${resetUrl}" style="background-color: #008CBA; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Reset Password</a>
                </div>
            `,
        });
    } catch (error) {
        console.error('Error sending reset email:', error);
        throw error;
    }
};

export const sendWaitlistVerificationEmail = async (email: string, token: string) => {
    // Link to Frontend Verification Page
    // process.env.FRONTEND_URL should be set, or fallback to localhost
    const frontendUrl = process.env.FRONTEND_URL || 'https://glowmate.tech';
    const verificationUrl = `${frontendUrl}/verify-waitlist?token=${token}`;
    const fromAddress = process.env.RESEND_FROM || 'hello@glowmate.tech';

    try {
        await resend.emails.send({
            from: `GlowMate <${fromAddress}>`,
            to: [email],
            subject: 'Verify your Spot on GlowMate Waitlist',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Verify Your Spot!</h2>
                    <p>Thanks for joining the GlowMate waitlist. Please verify your email to secure your position.</p>
                    <a href="${verificationUrl}" style="background-color: #9333ea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Verify Email</a>
                </div>
            `,
        });
        console.log(`Waitlist verification email sent to: ${email}`);
    } catch (error) {
        console.error('Error sending waitlist verification email:', error);
        // Don't throw to prevent blocking the UI flow, but log it
    }
};
