import { db } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: { userId },
    });

    return twoFactorConfirmation;
  } catch (err) {
    console.log(err);

    return null;
  }
};

export const deleteTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.delete({
      where: { userId },
    });

    return true;
  } catch (err) {
    console.log(err);

    return null;
  }
};

export const createTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.create({
      data: { userId },
    });

    return true;
  } catch (err) {
    console.log(err);

    return null;
  }
};
