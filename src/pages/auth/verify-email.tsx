import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useVerifyEmail } from "@/api/auth/auth.mutation";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { AxiosError } from "axios";
import { VerifyEmailErrorResponse } from "@/api/auth/auth.type";
import FormContainer from "@/components/reusable/auth/form-container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IMAGES } from "@/consts/image";


interface VerifyEmailResponse {
    message: string;
}

const VerifyEmail = () => {
    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-white dark:bg-gray-950">
            {/* Left Column */}
            <div className="hidden lg:flex lg:flex-col lg:items-start lg:justify-center p-12 space-y-6 bg-gray-100 dark:bg-gray-900">

                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    Verify Your Email Address
                </h1>

                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Please check your email for a verification link to activate your account.
                    You are allowed to login after verifying your email address.
                </p>

                <img
                    src={IMAGES.VERIFY_EMAIL}
                    alt="Inventory Dashboard"
                    width={600}
                    height={400}
                    className="object-contain"
                />
            </div>

            {/* Right Column */}
            <FormContainer
                formTitle="Verify Your Email Address"
                formDescription="Please check your email for a verification link to activate your account."
                form={<IsVerified />}
                isShowIcon={false}
            // cardFooter={loginCardFooter()}
            />

        </div>
    );
}


const IsVerified = () => {

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token")?.toString() || "";

    const verifyMutation = useVerifyEmail();


    const error = verifyMutation.error as AxiosError<VerifyEmailErrorResponse> | null;
    const verifyError = error?.response?.data?.errors || null;
    const verifySuccess = error?.response?.data?.message || null;

    useEffect(() => {
        if (token) {
            verifyMutation.mutate({ token });
        }
    }, [token]);



    return (
        <div className="grid w-full max-w-xl items-start gap-4">
            {verifyMutation.isSuccess && <VerifySuccess message={verifySuccess || "Email verified successfully."} />}
            {verifyMutation.isError && <VerifyFailed message={verifyError || "There was an issue verifying your email. Please try again or contact support."} />}
        </div>
    )
}


const VerifySuccess = (props: VerifyEmailResponse) => {
    return (
        <div className="grid w-full max-w-xl items-start gap-4">
            <Alert variant="success">
                <CheckCircle2Icon />
                <AlertTitle>Success! Your email has been verified.</AlertTitle>
                <AlertDescription>
                    {props.message} <Link to="/auth/login" className="underline font-bold">login</Link>.
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
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>
                    {props.message} or There was an issue verifying your email. Please try again or contact support.
                </AlertDescription>
            </Alert>
        </div>
    )
}


export default VerifyEmail;