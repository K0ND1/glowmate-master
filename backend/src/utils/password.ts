import argon2 from 'argon2';

const PEPPER = process.env.PASSWORD_PEPPER ? Buffer.from(process.env.PASSWORD_PEPPER) : undefined;

export const hashPassword = async (password: string): Promise<string> => {
    return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16, // 64 MB
        timeCost: 3,
        parallelism: 1,
        secret: PEPPER,
    });
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return await argon2.verify(hash, password, {
        secret: PEPPER,
    });
};
