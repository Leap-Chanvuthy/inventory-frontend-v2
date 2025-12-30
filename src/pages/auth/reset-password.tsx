import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useResetPassword } from "@/api/auth/auth.mutation";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { AxiosError } from "axios";
import { ResetPasswordErrorResponse, ResetPasswordPayload } from "@/api/auth/auth.type";
import FormContainer from "@/components/reusable/auth/form-container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IMAGES } from "@/consts/image";
import { TextInput } from "@/components/reusable/partials/input";
import SubmitButton from "@/components/reusable/auth/submit-button";


interface VerifyEmailResponse {
    message: string;
}

const ResetPassword = () => {
    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-white dark:bg-gray-950">
            {/* Left Column */}
            <div className="hidden lg:flex lg:flex-col lg:items-start lg:justify-center p-12 space-y-6 bg-gray-100 dark:bg-gray-900">

                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    Reset Your Password
                </h1>

                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Please check your email for a verification link to reset your password.
                    You are allowed to login after resetting your password.
                </p>

                <img
                    src={IMAGES.RESET_PASSWORD}
                    alt="Inventory Dashboard"
                    width={600}
                    height={400}
                    className="object-contain"
                />
            </div>

            {/* Right Column */}
            <FormContainer
                formTitle="Reset Your Password"
                formDescription="Input your new password after clicking the link sent to your email."
                form={<ResetForm />}
                isShowIcon={false}
            // cardFooter={loginCardFooter()}
            />

        </div>
    );
}


const ResetForm = () => {
    
    const resetPasswordMutation = useResetPassword();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token")?.toString() || "";
    const email = searchParams.get("email")?.toString() || "";

    const [form , setForm] = useState<ResetPasswordPayload>({
        token: "",
        email: "",
        password: "",
        password_confirmation: ""
        
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prevForm => ({
            ...prevForm,
            [e.target.id]: e.target.value
        }));
    }

    useEffect(() => {
    setForm(prevForm => ({
        ...prevForm,
        token,
        email
    }));

    }, [token, email]);


    const isError = resetPasswordMutation.isError;
    const isSuccess = resetPasswordMutation.isSuccess;
    const fieldErrors = (resetPasswordMutation.error as AxiosError<ResetPasswordErrorResponse>)?.response?.data.errors;
    const successResponse = resetPasswordMutation.data?.message;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        resetPasswordMutation.mutate(form , {
            onSuccess: () => {
                setTimeout(() => {
                    window.location.href = '/auth/login';
                }, 5000);
            }
        }); 
    }



    return (
        <div>
            <div className="my-5">
                {isSuccess && successResponse && <VerifySuccess message={successResponse} />}
                {isError && <VerifyFailed message={fieldErrors?.error || "Failed to reset password."} />}
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <TextInput
                    id="password"
                    label="Your New Password"
                    type="password"
                    placeholder="Please enter your new password"
                    value={form.password}
                    error={fieldErrors?.password?.[0] || ""}
                    onChange={handleChange}
                />
                
                <TextInput
                    id="password_confirmation"
                    label="Confirm Your New Password"
                    type="password"
                    placeholder="Please confirm your new password"
                    value={form.password_confirmation}
                    error={fieldErrors?.password?.[0] || ""}
                    onChange={handleChange}
                />

                <SubmitButton
                    text="Change Password"
                    loadingText="Changing password..."
                    isPending={resetPasswordMutation.isPending}
                />
            </form>
        </div>
    )
}


const VerifySuccess = (props: VerifyEmailResponse) => {
    return (
        <div className="grid w-full max-w-xl items-start gap-4">
            <Alert variant="success">
                <CheckCircle2Icon />
                <AlertTitle>Success! Your password has been reset.</AlertTitle>
                <AlertDescription>
                    {props.message} <Link to="/auth/login" className="underline font-bold">Back to login</Link>.
                </AlertDescription>
            </Alert>
        </div>
    )
}

const VerifyFailed = (props: VerifyEmailResponse) => {
    return (
        <div className="grid w-full max-w-xl items-start gap-4">
            <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Password Reset Failed</AlertTitle>
                <AlertDescription>
                    {props.message}
                </AlertDescription>
            </Alert>
        </div>
    )
}


export default ResetPassword;