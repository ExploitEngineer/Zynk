import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface ForgotPasswordEmailProps {
  username: string;
  userEmail: string;
  resetUrl: string;
}

const ResetEmailTemplate = (props: ForgotPasswordEmailProps) => {
  const { username, userEmail, resetUrl } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Reset your password - Action required</Preview>
        <Body className="bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto max-w-[580px] rounded-[8px] bg-white p-[40px] shadow-sm">
            {/* Header */}
            <Section className="mb-[32px] text-center">
              <Heading className="m-0 mb-[8px] text-[28px] font-bold text-gray-900">
                Password Reset Request
              </Heading>
              <Text className="m-0 text-[16px] text-gray-600">
                We received a request to reset your password
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="m-0 mb-[16px] text-[16px] leading-[24px] text-gray-700">
                Hello <strong>{username}</strong>,
              </Text>
              <Text className="m-0 mb-[16px] text-[16px] leading-[24px] text-gray-700">
                We received a request to reset the password for your account
                associated with <strong>{userEmail}</strong>.
              </Text>
              <Text className="m-0 mb-[24px] text-[16px] leading-[24px] text-gray-700">
                Click the button below to create a new password. This link will
                expire in 24 hours for security purposes.
              </Text>
            </Section>

            {/* Reset Button */}
            <Section className="mb-[32px] text-center">
              <Button
                href={resetUrl}
                className="box-border inline-block rounded-[8px] bg-blue-600 px-[32px] py-[16px] text-[16px] font-semibold text-white no-underline"
              >
                Reset Password
              </Button>
            </Section>

            {/* Security Notice */}
            <Section className="mb-[32px] rounded-[8px] bg-gray-50 p-[20px]">
              <Text className="m-0 mb-[12px] text-[14px] text-gray-600">
                <strong>Security Notice:</strong>
              </Text>
              <Text className="m-0 mb-[8px] text-[14px] leading-[20px] text-gray-600">
                • If you did not request this password reset, please ignore this
                email
              </Text>
              <Text className="m-0 mb-[8px] text-[14px] leading-[20px] text-gray-600">
                • Your password won't change until you create a new one
              </Text>
              <Text className="m-0 text-[14px] leading-[20px] text-gray-600">
                • This link expires in 24 hours for your security
              </Text>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-[32px]">
              <Text className="m-0 mb-[8px] text-[14px] leading-[20px] text-gray-600">
                If the button does not work, copy and paste this link into your
                browser:
              </Text>
              <Text className="m-0 text-[14px] break-all text-blue-600">
                {resetUrl}
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[24px]">
              <Text className="m-0 mb-[8px] text-[12px] leading-[16px] text-gray-500">
                This email was sent to {userEmail}
              </Text>
              <Text className="m-0 mb-[8px] text-[12px] leading-[16px] text-gray-500">
                © 2025 Your Company Name. All rights reserved.
              </Text>
              <Text className="m-0 text-[12px] leading-[16px] text-gray-500">
                123 Business Street, City, State 12345
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetEmailTemplate;
