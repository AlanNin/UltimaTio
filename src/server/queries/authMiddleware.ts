import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";

type User = {
  id: string;
};

export const authMiddleware = async (): Promise<{
  success: boolean;
  response: User | string | null;
}> => {
  const token = Cookies.get("access_token");
  if (!token) {
    return { success: false, response: "No token found" };
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as JwtPayload;
    const user: User = {
      id: decodedToken.id as string,
    };
    return { success: true, response: user };
  } catch (error) {
    console.error("JWT verification error:", error);
    return { success: false, response: "Invalid token" };
  }
};
