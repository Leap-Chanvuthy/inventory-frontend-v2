import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "@/api/auth/auth.mutation";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/reusable/partials/input";
import { AxiosError } from "axios";
import { LoginValidationErrors } from "@/api/auth/auth.type";
import FormContainer from "@/components/reusable/auth/form-container";
import SubmitButton from "@/components/reusable/auth/submit-button";
import { IMAGES } from "@/consts/image";
import { Text } from "@/components/ui/text/app-text";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/auth-slice";

function Login() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-white dark:bg-gray-950">
      {/* Left Column */}
      <div className="hidden lg:flex lg:flex-col lg:items-start lg:justify-center p-12 space-y-6 bg-gray-100 dark:bg-gray-900">
        <Text.TitleLarge className="text-gray-900 dark:text-gray-100">
          Login to your account
        </Text.TitleLarge>

        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Access your inventory management system easily and securely.
        </p>

        <img
          src={IMAGES.LOGIN}
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
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const loginMutation = useLogin();

  const error = loginMutation.error as AxiosError<LoginValidationErrors> | null;
  const fieldErrors = error?.response?.data?.errors;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setValues(prev => ({
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
        onSuccess: response => {
          // Check if 2FA is required
          if (
            "two_factor_enabled" in response.data &&
            response.data.two_factor_enabled
          ) {
            // Navigate to 2FA verification page with token in URL
            navigate(
              `/auth/two-factor-verify?token=${response.data.two_factor_token}`,
            );
          } else if ("authorisation" in response.data) {
            // Normal login - dispatch login action
            dispatch(
              login({
                token: response.data.authorisation.token,
                user: response.data.user,
              }),
            );
            navigate("/");
          }
        },
      },
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
        placeholder="Please enter your password"
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
  );
};

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
  );
};

export default Login;
