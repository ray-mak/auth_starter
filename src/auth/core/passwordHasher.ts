import crypto from "crypto"

export function hashPassword(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password.normalize(), salt, 64, (error, hash) => {
      if (error) reject(error)

      resolve(hash.toString("hex").normalize())
    })
  })
}

export async function comparePassword(
  password: string,
  salt: string,
  hashedPassword: string
) {
  const inputHashPassword = await hashPassword(password, salt)

  //use timingSafeEqual to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(inputHashPassword, "hex"),
    Buffer.from(hashedPassword, "hex")
  )
}

export function generateSalt() {
  return crypto.randomBytes(16).toString("hex").normalize()
}
