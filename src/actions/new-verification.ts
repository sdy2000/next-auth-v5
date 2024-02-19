"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { deleteVerificationToken } from "@/lib/tokens";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) return { error: "Token does not exist!" };

  // Check token expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired!" };

  // Get user and check user exist by email
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "Email dose not exist!" };

  try {
    // Update user emil verified and email
    await db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    await deleteVerificationToken(existingToken.email); // Delete Token

    return { success: "Email verified!" };
  } catch (error) {
    console.log(error);

    return { error: "Something went wrong!" };
  }
};
