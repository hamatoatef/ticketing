import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scrypptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buffer = (await scrypptAsync(password, salt, 64)) as Buffer;

    return `${buffer.toString("hex")}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [password, salt] = storedPassword.split(".");
    const buffer = (await scrypptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buffer.toString("hex") === password;
  }
}
