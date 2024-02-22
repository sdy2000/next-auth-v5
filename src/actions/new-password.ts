"use server";

import * as z from "zod";
import bcryptjs from "bcryptjs";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { deleteResetPasswordToken } from "@/lib/tokens";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { NewPasswordSchema } from "@/schemas";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) return { error: "Missing token!" };

  const validateFields = NewPasswordSchema.safeParse(values);

  if (!validateFields.success) return { error: "Invalid fields!" };

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) return { error: "Token does not exist!" }; // Check token exist!

  // Check token expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired!" };

  const { password, confirmPassword } = validateFields.data;
  // return error if pass not match
  if (password !== confirmPassword)
    return { error: "Passwords does not match" };

  // Get user and check user exist by email
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "Email dose not exist!" };

  const hashedPassword = await bcryptjs.hash(password, 10);

  try {
    // Update user emil verified and email
    await db.user.update({
      where: { id: existingUser.id },
      data: {
        email: existingToken.email,
        password: hashedPassword,
      },
    });

    await deleteResetPasswordToken(existingToken.email); // Delete Token

    return { success: "Password updated!" };
  } catch (error) {
    console.log(error);

    return { error: "Something went wrong!" };
  }
};
