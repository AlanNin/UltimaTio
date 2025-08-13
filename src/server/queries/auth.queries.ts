"use server";
import prisma from "../prisma-client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "~/env";
import { getRandomProfilePicture } from "~/utils/profile-pictures";
import {
  RecoverPasswordEmail,
  SendVerificationEmail,
} from "../nodemailer/nodemailer";

type User = {
  id: string;
  email: string;
  password?: string;
  access_token?: string;
  created_at: Date;
  updated_at: Date | null;
};

type EmailVerifyPayload = {
  sub: string;
  email: string;
  type: "email-verify";
};

type AccountRecoverPayload = {
  sub: string;
  email: string;
  type: "account-recover";
};

const { EMAIL_VERIFICATION_SECRET = "", RECOVER_ACCOUNT_SECRET = "" } = env;

function createEmailVerifyToken(
  userId: string,
  email: string,
  expiresIn = "24h"
) {
  const payload: EmailVerifyPayload = {
    sub: userId,
    email,
    type: "email-verify",
  };
  return jwt.sign(payload, EMAIL_VERIFICATION_SECRET, { expiresIn });
}

function verifyEmailVerifyToken(token: string): EmailVerifyPayload {
  const decoded = jwt.verify(
    token,
    EMAIL_VERIFICATION_SECRET
  ) as EmailVerifyPayload & jwt.JwtPayload;
  if (decoded.type !== "email-verify") {
    throw new Error("Invalid token type");
  }
  return decoded;
}

function createRecoverAccountToken(email: string, expiresIn = "24h") {
  const payload: AccountRecoverPayload = {
    sub: email,
    email,
    type: "account-recover",
  };
  return jwt.sign(payload, RECOVER_ACCOUNT_SECRET, { expiresIn });
}

function verifyRecoverAccountToken(token: string): AccountRecoverPayload {
  const decoded = jwt.verify(
    token,
    RECOVER_ACCOUNT_SECRET
  ) as AccountRecoverPayload & jwt.JwtPayload;
  if (decoded.type !== "account-recover") {
    throw new Error("Invalid token type");
  }
  return decoded;
}

// SIGN UP ACCOUNT
export async function SignUpAccount(
  email: string,
  password: string,
  confirm_password: string,
  receive_emails: boolean
): Promise<{
  success: boolean;
  response: User | string | null;
}> {
  if (password !== confirm_password) {
    throw new Error("Passwords do not match");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: {
        equals: email.toLowerCase(),
        mode: "insensitive",
      },
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.toLowerCase())) {
    throw new Error("Invalid email format");
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  // GET DEFAULT PROFILE PICTURE
  const profilePicture = (await getRandomProfilePicture()) || "";

  // CREATE NEW USER
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hash,
      emailVerified: false,
      profiles: {
        create: {
          name: "Default",
          imgUrl: profilePicture,
          library: {
            createMany: {
              data: [
                { name: "Following" },
                { name: "Plan To Watch" },
                { name: "On Hold" },
                { name: "Completed" },
              ],
            },
          },
        },
      },
      userSettings: {
        create: {
          receive_emails,
        },
      },
    },
    include: { profiles: true, userSettings: true },
  });

  const verificationToken = createEmailVerifyToken(user.id, user.email);

  await SendVerificationEmail(verificationToken, user.email);

  return {
    success: true,
    response: "Account Created Successfully",
  };
}

// SIGN IN ACCOUNT
export async function SignInAccount(
  email: string,
  password: string
): Promise<{
  success: boolean;
  response: User | string | null;
  token?: string;
}> {
  try {
    // GET USER
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email.toLowerCase(),
          mode: "insensitive",
        },
      },
    });

    // VALIDATIONS
    if (!user) {
      return {
        response: "Incorrect credentials. Please, try again.",
        success: false,
      };
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return {
        response: "Incorrect credentials. Please, try again.",
        success: false,
      };
    }

    if (!user.emailVerified) {
      // SEND VERIFICATION EMAIL
      const verificationToken = createEmailVerifyToken(user.id, user.email);
      await SendVerificationEmail(verificationToken, user.email);

      return {
        response:
          "Account not confirmed. We've sent a verification email to your email address.",
        success: false,
      };
    }

    // TOKEN
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);

    // EXCLUDE USER PASSWORD FROM ANSWER
    const { password: _, ...userData } = user;

    return { token, response: userData, success: true };
  } catch (error) {
    console.error("Error in SignInAccount:", error);
    throw new Error("An error occurred during sign-in");
  }
}
// SIGN IN WITH GOOGLE
export async function SignInWithGoogle(
  email: string
): Promise<{
  success: boolean;
  response: User | string | null;
  token?: string;
}> {
  try {
    // GET USER
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email.toLowerCase(),
          mode: "insensitive",
        },
      },
    });

    // VALIDATIONS
    if (!user) {
      return { response: "Incorrect credentials. Try Again", success: false };
    }

    // TOKEN
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);

    // EXCLUDE USER PASSWORD FROM ANSWER
    const { password: _, ...userData } = user;

    return { token, response: userData, success: true };
  } catch (error) {
    console.error("Error in SignInAccount:", error);
    throw new Error("An error occurred during sign-in");
  }
}

// SIGN UP WITH GOOGLE
export async function SignUpWithGoogle(
  email: string
): Promise<{
  success: boolean;
  response: User | string | null;
  token?: string;
}> {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email.toLowerCase(),
          mode: "insensitive",
        },
      },
    });

    if (existingUser) {
      const response = await SignInWithGoogle(existingUser.email);
      return response;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toLowerCase())) {
      throw new Error("Invalid email format");
    }

    // GET DEFAULT PROFILE PICTURE
    const profilePicture = (await getRandomProfilePicture()) || "";

    // CREATE NEW USER
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: "",
        emailVerified: true,
        profiles: {
          create: {
            name: "Default",
            imgUrl: profilePicture,
            library: {
              createMany: {
                data: [
                  { name: "Following" },
                  { name: "Plan To Watch" },
                  { name: "On Hold" },
                  { name: "Completed" },
                ],
              },
            },
          },
        },
        userSettings: {
          create: {
            receive_emails: false,
          },
        },
      },
      include: { profiles: true, userSettings: true },
    });

    const response = await SignInWithGoogle(newUser.email);
    return response;
  } catch (error) {
    console.error("Error in SignUpWithGoogle:", error);
    throw new Error("An error occurred during sign-up");
  }
}

// VALIDATE EMAIL
export async function validateEmail(
  email: string
): Promise<{
  success: boolean;
}> {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email.toLowerCase(),
          mode: "insensitive",
        },
      },
    });

    if (existingUser) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
}

// VERIFY ACCOUNT
export async function VerifyAccount(token: string) {
  try {
    const decoded = verifyEmailVerifyToken(token);

    await prisma.user.update({
      where: {
        email: decoded.email,
      },
      data: {
        emailVerified: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error in VerifyAccount:", error);
    throw new Error("An error occurred during verify-account");
  }
}

// SENT RECOVER ACCOUNT EMAIL
export async function SentRecoverAccountEmail(email: string) {
  try {
    const token = createRecoverAccountToken(email);

    await RecoverPasswordEmail(token, email);

    return { success: true };
  } catch (error) {
    console.error("Error in VerifyAccount:", error);
    throw new Error("An error occurred during verify-account");
  }
}

// VERIFY RECOVER ACCOUNT TOKEN
export async function VerifyRecoverAccountToken(token: string) {
  try {
    const decoded = verifyRecoverAccountToken(token);

    if (!decoded.email || !decoded.sub || decoded.type !== "account-recover") {
      throw new Error("Invalid token");
    }

    return { success: true };
  } catch (error) {
    console.error("Error in VerifyAccount:", error);
    throw new Error("An error occurred during verify-account");
  }
}

// RESET PASSWORD
export async function ResetPassword(
  token: string,
  newPassword: string,
  confirmNewPassword: string
) {
  try {
    if (newPassword !== confirmNewPassword) {
      throw new Error("Passwords do not match");
    }

    const decoded = verifyRecoverAccountToken(token);
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    await prisma.user.update({
      where: {
        email: decoded.email,
      },
      data: {
        password: hash,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error in VerifyAccount:", error);
    throw new Error("An error occurred during verify-account");
  }
}
