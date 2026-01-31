import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyTwoFactorLogin } from "@/api/auth/auth.mutation";
import { TextInput } from "@/components/reusable/partials/input";
import { AxiosError } from "axios";
import FormContainer from "@/components/reusable/auth/form-container";
import SubmitButton from "@/components/reusable/auth/submit-button";
import { IMAGES } from "@/consts/image";
import { Text } from "@/components/ui/text/app-text";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function TwoFactorVerify() {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-white dark:bg-gray-950">
      {/* Left Column */}
      <div className="hidden lg:flex lg:flex-col lg:items-start lg:justify-center p-12 space-y-6 bg-gray-100 dark:bg-gray-900">
        <Text.TitleLarge className="text-gray-900 dark:text-gray-100">
          Two-Factor Authentication
        </Text.TitleLarge>

        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Enter the verification code from your authenticator app or use a
          recovery code.
        </p>

        <img
          src={IMAGES.LOGIN}
          alt="Security"
          width={600}
          height={400}
          className="object-contain"
        />
      </div>

      {/* Right Column */}
      <FormContainer
        formTitle="Two-Factor Authentication"
        formDescription="Enter your verification code or recovery code to continue."
        form={verifyForm()}
        isShowIcon={true}
      />
    </div>
  );
}

const verifyForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const twoFactorToken = searchParams.get("token");

  const [activeTab, setActiveTab] = useState<"code" | "recovery">("code");
  const [code, setCode] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");

  const verifyMutation = useVerifyTwoFactorLogin();

  const error = verifyMutation.error as AxiosError<{
    message: string;
    errors?: Record<string, string[]>;
  }> | null;
  const errorMessage = error?.response?.data?.message;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!twoFactorToken) {
      toast.error("Two-factor token is missing. Please log in again.");
      navigate("/auth/login");
      return;
    }

    const payload = {
      two_factor_token: twoFactorToken,
      ...(activeTab === "code" ? { code } : { recovery_code: recoveryCode }),
    };

    verifyMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Login successful");
        navigate("/");
      },
      onError: () => {
        toast.error(errorMessage || "Verification failed");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Tabs
        value={activeTab}
        onValueChange={value => setActiveTab(value as "code" | "recovery")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="code">Authenticator Code</TabsTrigger>
          <TabsTrigger value="recovery">Recovery Code</TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="space-y-4 mt-4">
          <TextInput
            id="code"
            label="Verification Code"
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={e =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            maxLength={6}
            error={error?.response?.data?.errors?.code?.[0]}
          />
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code from your authenticator app.
          </p>
        </TabsContent>

        <TabsContent value="recovery" className="space-y-4 mt-4">
          <TextInput
            id="recovery_code"
            label="Recovery Code"
            type="text"
            placeholder="Enter recovery code"
            value={recoveryCode}
            onChange={e => setRecoveryCode(e.target.value)}
            error={error?.response?.data?.errors?.recovery_code?.[0]}
          />
          <p className="text-sm text-muted-foreground">
            Enter one of your recovery codes if you don't have access to your
            authenticator app.
          </p>
        </TabsContent>
      </Tabs>

      <SubmitButton
        text="Verify and Login"
        loadingText="Verifying..."
        isPending={verifyMutation.isPending}
      />
    </form>
  );
};

export default TwoFactorVerify;
