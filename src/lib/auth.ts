import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { config } from "../config/config";
import { prisma } from "./prisma";
import { UserRoles } from "../../generated/prisma/enums";
import { sendEmail } from "./sendemail";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  advanced: {
    cookiePrefix: "skill_bridge",
  },

  trustedOrigins: [config.app_url!, config.backend_url!],

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    minPasswordLength: 6,
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const verificationUrl = `${config.app_url}/verify?token=${token}`;
      const html = `
                      <div style="font-family: Arial, sans-serif; text-align: center;">
                        <h2>Welcome to Our App, ${user?.name}!</h2>
                        <p>Please verify your email address to continue.</p>
                        <a href="${verificationUrl}"
                          style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                          Verify Email
                        </a>
                        <p>If you did not create an account, you can ignore this email.</p>
                      </div>
                    `;
      if (user?.email) {
        await sendEmail({
          to: user.email,
          subject: "Verify your email address for SkillBridge",
          text: `Click the link to verify your email: ${verificationUrl}`,
          html,
        });
      }
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: UserRoles.student,
      },
      is_banned: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
  },
});
