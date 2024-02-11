"use server";

import { LoginSchema } from "@/schemas";
import * as z from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values); // sever validate for more security

  if (!validateFields.success) return { error: "Invalid fields!" };

  return { success: "Email sent!" };
  //   console.log(validateFields);
};
