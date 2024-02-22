"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import {
  deleteTwoFactorToken,
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import {
  createTwoFactorConfirmationByUserId,
  deleteTwoFactorConfirmationByUserId,
  getTwoFactorConfirmationByUserId,
} from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values); // sever validate for more security

  if (!validateFields.success) return { error: "Invalid fields!" };

  const { email, password, code } = validateFields.data;

  const existingUser = await getUserByEmail(email); // get user by email if exist

  if (!existingUser || !existingUser.email || !existingUser.password)
    return { error: "Email does not exist!" };

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) return { error: "Invalid code!" };
      if (twoFactorToken.token !== code)
        return { error: "Invalid entered code!" };

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) return { error: "Code expired!" };

      await deleteTwoFactorToken(twoFactorToken.email);

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );
      if (existingConfirmation)
        await deleteTwoFactorConfirmationByUserId(existingUser.id);

      const isCreateTwoFactorConfirmation =
        await createTwoFactorConfirmationByUserId(existingUser.id);
      if (!isCreateTwoFactorConfirmation) return { error: "Server problem!" };
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      // TODO: Fix email sender bug
      // const isSendTwoFactorToken = await sendTwoFactorTokenEmail(
      //   twoFactorToken.email,
      //   twoFactorToken.token
      // );
      // if (!isSendTwoFactorToken)
      //   return { error: "Server problem, We can't send two factor email!" };

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return { success: "OK" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};
