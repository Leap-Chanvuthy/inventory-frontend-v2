import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldQuestion, ExternalLink } from "lucide-react";
import FormContainer from "@/components/reusable/auth/form-container";
import { FormFooter, RequestForm } from "@/pages/auth/forgot-password";
import { Text } from "@/components/ui/text/app-text";

export function ForgetPassword() {
    return (
        <div className="max-w-[2500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="space-y-2">
                <Text.TitleSmall>Check your email after link is sent</Text.TitleSmall>
                <Alert >
                    <div className="flex items-center gap-2">
                        <ShieldQuestion className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                            Didn't receive the email? Check your spam folder or try another address.
                        </AlertDescription>
                    </div>
                </Alert>
            </div>

            {/* Primary Instruction Card */}
            <FormContainer
                formTitle="Request Password Reset"
                formDescription="Please enter your email address to receive a password reset link."
                form={<RequestForm />}
                isShowIcon={false}
                cardFooter={<FormFooter />}
            />

            {/* Action Steps */}

            {/* Support Footer */}
            <div className="pt-6 border-t text-center">
                <p className="text-xs">
                    Having trouble? <a href="#" className=" hover:underline inline-flex items-center">Contact Support <ExternalLink className="h-3 w-3 ml-1" /></a>
                </p>
            </div>
        </div>
    );
}