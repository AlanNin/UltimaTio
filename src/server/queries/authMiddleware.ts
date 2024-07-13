"use server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

type User = {
  id: string;
};

type Profile = {
  id: string;
};

export const getUserFromAuth = async (): Promise<string> => {
  const user = await authMiddleware();
  return user.id;
};

export const getCurrentProfile = async (): Promise<string> => {
  const profile = await profileMiddleware();
  return profile.id;
};

const authMiddleware = async (): Promise<User> => {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("No token found");
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as JwtPayload;
    const user: User = {
      id: decodedToken.id as string,
    };

    return user;
  } catch (error) {
    console.error("JWT verification error:", error);
    throw new Error("Invalid token");
  }
};

const profileMiddleware = async (): Promise<Profile> => {
  const cookieStore = cookies();
  const profile_id = cookieStore.get("currentProfile")?.value;

  if (!profile_id) {
    throw new Error("No token found");
  }

  try {
    const profile: Profile = {
      id: profile_id as string,
    };

    return profile;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
