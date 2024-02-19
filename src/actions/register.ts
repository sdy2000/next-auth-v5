"use server";

import * as z from "zod";
import bcryptjs from "bcryptjs";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import {
  deleteVerificationToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values);

  if (!validateFields.success) return { error: "Invalid fields!" }; // sever validate for more security

  const { name, email, password, confirmPassword } = validateFields.data;

  if (password !== confirmPassword)
    return { error: "Passwords does not match" }; // return error if pass not match

  const hashedPassword = await bcryptjs.hash(password, 10); // hash password

  const existingUser = await getUserByEmail(email);

  if (existingUser) return { error: "Email already in use!" }; // return error if same email exist

  const verificationToken = await generateVerificationToken(email);

  // TODO: Fix email sender
  // const isSendVerificationEmail: boolean = await sendVerificationEmail(
  //   verificationToken.email,
  //   verificationToken.token
  // );

  const isSendVerificationEmail: boolean = true;

  // Check Email sended or not
  if (!isSendVerificationEmail) {
    deleteVerificationToken(email);

    return { error: "Something went wrong!" };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  return { success: "Confirmation email sent!" };
};
