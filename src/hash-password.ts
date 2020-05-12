var cryptoo = require('crypto');

export function hashPassword (password: string): string {
    return cryptoo.createHash('md5').update(password).digest("hex");
}