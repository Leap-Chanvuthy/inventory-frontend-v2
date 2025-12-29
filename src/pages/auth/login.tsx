import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/api/auth/auth.mutation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { User, Star } from "lucide-react";
import { TextInput } from "@/components/reusable/partials/input";
import { AxiosError } from "axios";
import { LoginValidationErrors } from "@/api/auth/auth.type";

function Login() {
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
            <div className="flex items-center justify-center p-6 sm:p-12">
                <Card className="w-full max-w-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                    <CardHeader className="text-center space-y-3">
                        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Login to your account
                        </CardTitle>

                        <CardDescription className="text-gray-600 dark:text-gray-400">
                            Login to your inventory system from following form.
                        </CardDescription>

                        <div className="flex flex-col items-center pt-4">
                            <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-full">
                                <User className="h-6 w-6" />
                            </div>
                            <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Account Information
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent>
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

                            <Button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className="w-full
                           
                           text-white flex items-center justify-center gap-2"
                            >
                                {loginMutation.isPending && (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                )}
                                {loginMutation.isPending ? "Logging in..." : "Login to your account"}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex-col gap-4">
                        <Button
                            variant="outline"
                            className="w-full border-gray-300 dark:border-gray-700
                         text-gray-800 dark:text-gray-200
                         hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Login with Google
                        </Button>

                        <a
                            href="#"
                            className="mt-2 inline-block text-sm
                         text-purple-600 dark:text-purple-400
                         hover:underline"
                        >
                            Forget your password?
                        </a>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default Login;
