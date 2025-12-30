import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "@/api/auth/auth.mutation";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { TextInput } from "@/components/reusable/partials/input";
import { AxiosError } from "axios";
import { LoginValidationErrors } from "@/api/auth/auth.type";
import FormContainer from "@/components/reusable/auth/form-container";
import SubmitButton from "@/components/reusable/auth/submit-button";

function Login() {
    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-white dark:bg-gray-950">
            {/* Left Column */}
            <div className="hidden lg:flex lg:flex-col lg:items-start lg:justify-center p-12 space-y-6 bg-gray-100 dark:bg-gray-900">
                <div className="flex items-center gap-2">
                    <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="currentColor" />
                    <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        Inventory
                    </span>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    Manage your Inventory
                </h1>

                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    តាមដាន និង វិភាគទិន្នន័យលក់តាមរយៈ: trends, ត្រួតពិនិត្យ និង
                    រាយការណ៍ងាយៗដើម្បីបង្កើនប្រសិទ្ធភាពការលក់។
                </p>

                <img
                    src="/placeholder-dashboard.png"
                    alt="Inventory Dashboard"
                    width={600}
                    height={400}
                    className="object-contain"
                />
            </div>

            {/* Right Column */}
            <FormContainer
                formTitle="Login to your account"
                formDescription="Login to your inventory system from following form."
                form={loginForm()}
                isShowIcon={true}
                cardFooter={loginCardFooter()}
            />

        </div>
    );
}


// Login Form (Focus on Login Logic)
const loginForm = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        email: "",
        password: "",
    });

    const loginMutation = useLogin();

    const error = loginMutation.error as AxiosError<LoginValidationErrors> | null;
    const fieldErrors = error?.response?.data?.errors;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        loginMutation.mutate(
            {
                email: values.email,
                password: values.password,
            },
            {
                onSuccess: () => {
                    navigate("/");
                },
            }
        );
    };
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <TextInput
                id="email"
                label="Your Email"
                type="email"
                placeholder="Please fill your email"
                value={values.email}
                error={fieldErrors?.email?.[0]}
                onChange={handleChange}
            />

            <TextInput
                id="password"
                label="Your Password"
                type="password"
                value={values.password}
                error={fieldErrors?.password?.[0]}
                onChange={handleChange}
            />
            
            <SubmitButton
                text="Login to your account"
                loadingText="Logging in..."
                isPending={loginMutation.isPending}
            />

        </form>
    )
}


// Login Card Footer
const loginCardFooter = () => {
    return (
        <div className="w-full flex flex-col items-center gap-4">
            <Button
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-700
                             text-gray-800 dark:text-gray-200
                             hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                Login with Google
            </Button>
            <Link
                to="/auth/forgot-password"
                className="mt-2 inline-block text-sm
                             text-purple-600 dark:text-purple-400
                             hover:underline"
            >
                Forget your password?
            </Link>
        </div>
    )
}

export default Login;
