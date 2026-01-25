import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPassword } from "@/api/auth/auth.mutation";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { AxiosError } from "axios";
import { ForgotPasswordErrorResponse } from "@/api/auth/auth.type";
import FormContainer from "@/components/reusable/auth/form-container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IMAGES } from "@/consts/image";
import { TextInput } from "@/components/reusable/partials/input";
import SubmitButton from "@/components/reusable/auth/submit-button";
import { Text } from "@/components/ui/text/app-text";


interface VerifyEmailResponse {
    message: string;
}

const ForgotPassword = () => {
    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-white dark:bg-gray-950">
            {/* Left Column */}
            <div className="hidden lg:flex lg:flex-col lg:items-start lg:justify-center p-12 space-y-6 bg-gray-100 dark:bg-gray-900">

                <Text.TitleLarge className="text-gray-900 dark:text-gray-100">
                    Request Password Reset
                </Text.TitleLarge>

                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Please enter your email address to receive a password reset link.
                </p>

                <img
                    src={IMAGES.FORGOT_PASSWORD}
                    alt="Inventory Dashboard"
                    width={600}
                    height={400}
                    className="object-contain"
                />
            </div>

            {/* Right Column */}
            <FormContainer
                formTitle="Request Password Reset"
                formDescription="Please enter your email address to receive a password reset link."
                form={<RequestForm />}
                isShowIcon={false}
                cardFooter={<FormFooter/>}
            />

        </div>
    );
}


export const RequestForm = () => {

    const [email , setEmail] = useState<string>("");
    
    const forgotPasswordMutation = useForgotPassword();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        forgotPasswordMutation.mutate({ email } , {
            // You can add any additional logic here if needed after a successful request
        });
        
    }

    const isSuccess = forgotPasswordMutation.isSuccess;
    const successResponse = forgotPasswordMutation.data?.message;

    const isError = forgotPasswordMutation.isError;
    const fieldErrors = (forgotPasswordMutation.error as AxiosError<ForgotPasswordErrorResponse>)?.response?.data.errors;



    return (
        <div>
            {isSuccess && successResponse && <RequestSuccess message={successResponse} />}
            {isError && <RequestFailed message="Failed to send password reset link." />}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <TextInput
                    id="email"
                    label="Your Email"
                    type="email"
                    placeholder="Please fill your email"
                    value={email}
                    error={fieldErrors?.email?.[0]}
                    onChange={handleChange}
                />
                <SubmitButton
                    text="Send Reset Link"
                    loadingText="Sending reset link..."
                    isPending={forgotPasswordMutation.isPending}
                />
            </form>
        </div>
    )
}


export const FormFooter = () => {
    return (
        <p className="text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{" "}
            <Link to="/auth/login" className="underline font-bold">
                Login
            </Link>
        </p>
    )
}


export const RequestSuccess = (props: VerifyEmailResponse) => {
    return (
        <div className="grid w-full max-w-xl items-start gap-4">
            <Alert variant="success">
                <CheckCircle2Icon />
                <AlertTitle>{props.message}</AlertTitle>
                <AlertDescription>
                    Please check your email for the password reset link.
                </AlertDescription>
            </Alert>
        </div>
    )
}

export const RequestFailed = (props: VerifyEmailResponse) => {
    return (
        <div className="grid w-full max-w-xl items-start gap-4">
            <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Password Reset Request Failed</AlertTitle>
                <AlertDescription>
                    {props.message} or There was an issue verifying your email. Please try again or contact support.
                </AlertDescription>
            </Alert>
        </div>
    )
}


export default ForgotPassword;