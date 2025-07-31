// creating token
import jwt from "jsonwebtoken";

export const createToken = (input: { email: string }): string => {
  const token: string = jwt.sign({ email: input.email }, "secret", {
    expiresIn: "7d",
  });
  return token;
};

export const verifyTokenAndDecodeIt = (
  authHeader: string
): { email: string } | null => {
  try {
    // Extract token from "Bearer TOKEN" format
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      console.log("No token provided");
      return null;
    }

    const decoded = jwt.verify(token, "secret") as { email: string };
    console.log("decoded", decoded);
    return decoded;
  } catch (error) {
    console.log(
      "Token verification failed:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return null;
  }
};

export const decodeTokenWithoutVerification = (
  token: string
): { email: string } | null => {
  try {
    const decoded = jwt.decode(token) as { email: string };
    return decoded;
  } catch (error) {
    return null;
  }
};
