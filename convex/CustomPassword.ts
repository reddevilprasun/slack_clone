import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexError } from "convex/values";
import { z } from "zod";
import { DataModel } from "./_generated/dataModel";

const ParamsSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters long")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
  name: z.string().min(3, "Name must be at least 3 characters long").optional(),
});

export default Password<DataModel>({
  profile(params) {
    const { data, error } = ParamsSchema.safeParse(params);
    if (error) {
      throw new ConvexError({
        message: error.format(),
      });
    }
    return { 
      email: data.email,
      name: data.name,
    };
  },
});
