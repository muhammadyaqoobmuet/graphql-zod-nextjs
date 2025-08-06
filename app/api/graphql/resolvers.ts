import { prisma } from "@/lib/prisma";
import { GraphQLError } from "graphql";
import * as z from "zod";

import bcrypt from "bcryptjs";
import { createToken } from "./lib/userAtuhentications";

// Enums must be declared before use
enum IssueStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  INPROGRESS = "INPROGRESS",
  DONE = "DONE",
}

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

const createIssueSchema = z.object({
  name: z.string().min(1, "Issue name is required"),
  content: z.string().min(1, "Issue content is required"),
  status: z.nativeEnum(IssueStatus),
});

interface CreateIssueInput {
  name: string;
  content: string;
  status: IssueStatus;
}
interface AuthInput {
  email: string;
  password: string;
}

interface Project {
  id: string;
  createdAt: string;
  name: string;
  content: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  token?: string;
  issues: Issue[];
  projects: Project[];
}

interface UserBasic {
  email: string;
  createdAt: string;
}

interface Context {
  user?: UserBasic & { id: string };
}

interface Issue {
  id: string;
  createdAt: string;
  userId: string;
  status: IssueStatus;
  content: string;
  name: string;
  user?: UserBasic; // Use simpler user type to avoid circular reference
  projectId: string | null;
}

export const resolver = {
  Issue: {
    user: async (parent: Issue) => {
      // This only runs when user field is requested in the query
      const user = await prisma.user.findUnique({
        where: { id: parent.userId },
      });

      if (!user) return null;

      return {
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      };
    },
  },
  Query: {
    Issues: async (_, args, ctx: any): Promise<Issue[]> => {
      // first check is this user authorized
      try {
        // Fixed: Proper authorization check
        if (!ctx.user || !ctx.user.email) {
          throw new GraphQLError(
            "Unauthorized - Please provide a valid token",
            {
              extensions: { code: "UNAUTHORIZED" },
            }
          );
        }

        const email = ctx.user.email;

        const doesUserExits = await prisma.user.findUnique({
          where: {
            email,
          },
          include: {
            issues: {
              include: {
                user: true,
              },
            },
          },
        });

        if (!doesUserExits) {
          throw new GraphQLError("User does not exists", {
            extensions: { code: "USER_NOT_FOUND" },
          });
        }

        console.log(doesUserExits.issues);

        // Properly map Prisma issues to GraphQL Issue interface
        return doesUserExits.issues.map((issue) => ({
          id: issue.id,
          name: issue.name,
          content: issue.content,
          status: issue.status as IssueStatus,
          createdAt: issue.createdAt.toISOString(),
          userId: issue.userId,
          projectId: issue.projectId, // This can be null now
        }));
      } catch (error) {
        console.error("Error fetching user issues:", error);

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
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    hello: (): string => "Hello World!",
    me: async (_: unknown, __: unknown, ctx: Context): Promise<User> => {
      if (!ctx.user) {
        throw new Error("Unauthorized: No user found in context");
      }
      const email = ctx.user.email;
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: { code: "USER_NOT_FOUND" },
        });
      }

      return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        token: undefined, // Don't return token in me query for security
        issues: [], // Will be populated by Issue resolver if needed
        projects: [],
      };
    },
    loginUser: async (
      _parent: unknown,
      { input }: { input: AuthInput },

      ctx: any
    ): Promise<User> => {
      try {
        console.log({ input });
        // Fixed: Use userLoginSchema instead of userCreateSchema
        const zodResult = userLoginSchema.safeParse({
          email: input.email,
          password: input.password,
        });

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

        if (!existsUser) {
          throw new GraphQLError(
            "User does not exists try again with new email or password",
            {
              extensions: {
                code: "USER_NOT_FOUND",
              },
            }
          );
        }

        // Fixed: Await the bcrypt.compare promise
        const passwordMatch = await bcrypt.compare(
          input.password,
          existsUser.password
        );
        if (!passwordMatch) {
          throw new GraphQLError("Invalid Credentials", {
            extensions: {
              code: "INVALID_CREDENTIALS",
            },
          });
        }

        // create token
        const token = createToken({ email: input.email });

        return {
          id: existsUser.id,
          email: existsUser.email,
          createdAt: existsUser.createdAt.toISOString(),
          token,
          issues: [],
          projects: [],
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
  Mutation: {
    createUser: async (
      _parent: unknown,
      { input }: { input: AuthInput },
      ctx: any
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
        // encrypt password
        const passwordEnc = bcrypt.hashSync(input.password, 10);
        const result = await prisma.user.create({
          data: {
            email: input.email,
            password: passwordEnc, // Store the encrypted password
          },
        });

        // create token
        const token = createToken({ email: input.email });

        return {
          id: result.id,
          email: result.email,
          createdAt: result.createdAt.toISOString(),
          token,
          issues: [],
          projects: [],
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
    createIssue: async (
      _parent: unknown,
      { input }: { input: CreateIssueInput },
      ctx: { user?: { email: string } }
    ): Promise<Issue> => {
      try {
        // Validate input using Zod
        const zodResult = createIssueSchema.safeParse(input);
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

        console.log("Context:", ctx);
        console.log("User in context:", ctx.user);

        if (!ctx.user) {
          throw new GraphQLError(
            "Unauthorized - Please provide a valid token",
            {
              extensions: { code: "UNAUTHORIZED" },
            }
          );
        }

        // Find the user in the database
        const user = await prisma.user.findUnique({
          where: { email: ctx.user.email },
        });

        if (!user) {
          throw new GraphQLError("User not found", {
            extensions: { code: "USER_NOT_FOUND" },
          });
        }

        // Create the issue
        const issue = await prisma.issue.create({
          data: {
            name: input.name,
            content: input.content,
            status: input.status,
            userId: user.id,
          },
          include: {
            user: true,
          },
        });

        return {
          id: issue.id,
          name: issue.name,
          content: issue.content,
          status: issue.status as IssueStatus,
          createdAt: issue.createdAt.toISOString(),
          userId: issue.userId,
          projectId: issue.projectId, // This will be null from database
          user: {
            email: issue.user.email,
            createdAt: issue.user.createdAt.toISOString(),
          },
        };
      } catch (error) {
        console.log(
          "Create issue error:",
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
