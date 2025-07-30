import { prisma } from "@/lib/prisma";
import { GraphQLError } from "graphql";
import * as z from "zod";

import bcrypt from "bcryptjs";
// creating zod schame

const userCreateSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z
    .string()
    .min(2, { message: "min 2 character are required for password" }),
});
const userLoginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z
    .string()
    .min(2, { message: "min 2 character are required for password" }),
});

interface AuthInput {
  email: string;
  password: string;
}

interface User {
  email: string;
  createdAt: string;
  issues: Issue[];
}

interface Issue {
  id: string;
  createdAt: string;
  userId: string;
  status: string;
  content: string;
  name: string;
}

export const resolver = {
  Query: {
    hello: (): string => "Hello World!",
    me: (): User => {
      return {
        email: "test@example.com",
        createdAt: new Date().toISOString(),
        issues: [],
      };
    },
  },
  Mutation: {
    createUser: async (
      _parent: unknown,
      { input }: { input: AuthInput }
    ): Promise<User> => {
      // create a user
      try {
        const zodResult = userCreateSchema.safeParse({
          email: input.email,
          password: input.password,
        });
        console.log(zodResult);

        if (!zodResult.success) {
          const errorMessages = zodResult.error.issues
            .map((issue) => issue.message)
            .join(", ");
          throw new GraphQLError(`Validation failed: ${errorMessages}`, {
            extensions: {
              code: "INVALID_INPUT",
              validationErrors: zodResult.error.issues,
            },
          });
        }

        // check first if user exits or not

        const existsUser = await prisma.user.findUnique({
          where: {
            email: input.email,
          },
        });

        if (existsUser) {
          throw new GraphQLError(
            "User already exists try again with new email or password",
            {
              extensions: {
                code: "USER_ALREADY_EXISTS",
              },
            }
          );
        }

        // create user

        // enctpy password

        const passwordEnc = bcrypt.hashSync(input.password, 10);
        const result = await prisma.user.create({
          data: {
            email: input.email,
            password: passwordEnc, // Store the encrypted password
          },
        });

        return {
          email: result.email,
          createdAt: result.createdAt.toISOString(),
          issues: [],
        };
      } catch (error) {
        console.log(
          error instanceof Error ? error.message : "Unknown error occurred"
        );

        // If it's already a GraphQLError, rethrow it
        if (error instanceof GraphQLError) {
          throw error;
        }

        // Handle other types of errors
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        throw new GraphQLError(errorMessage, {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
          },
        });
      }
    },
  },
};
