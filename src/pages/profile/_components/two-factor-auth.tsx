import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateUserLoginInformation } from "@/redux/slices/auth-slice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Smartphone,
  ShieldCheck,
  Copy,
  ShieldPlus,
  Download,
} from "lucide-react";
import { Text } from "@/components/ui/text/app-text";
import {
  useConfirmTwoFactor,
  useDisableTwoFactor,
  useSetupTwoFactor,
} from "@/api/auth/auth.mutation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TwoFactorAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEnabled, setIsEnabled] = useState(user?.two_factor_enabled || false);
  const [twoFactorData, setTwoFactorData] = useState<{
    qr_code: string;
    secret: string;
    recovery_codes: string[];
  } | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Disable dialog state
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [disableTab, setDisableTab] = useState<"code" | "recovery">("code");
  const [disablePassword, setDisablePassword] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [disableRecoveryCode, setDisableRecoveryCode] = useState("");

  const setupMutation = useSetupTwoFactor();
  const confirmMutation = useConfirmTwoFactor();
  const disableMutation = useDisableTwoFactor();

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      try {
        const response = await setupMutation.mutateAsync();
        setTwoFactorData(response.data);
        setIsEnabled(true);
        setVerificationCode("");
        setIsConfirmed(false);
        setShowRecoveryCodes(false);
        toast.success(response.message);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to setup 2FA");
        setIsEnabled(false);
      }
    } else {
      // Show disable confirmation dialog
      setShowDisableDialog(true);
    }
  };

  const handleDisable = async () => {
    const payload = {
      password: disablePassword,
      ...(disableTab === "code"
        ? { code: disableCode }
        : { recovery_code: disableRecoveryCode }),
    };

    try {
      const response = await disableMutation.mutateAsync(payload);
      setIsEnabled(false);
      setTwoFactorData(null);
      setRecoveryCodes([]);
      setShowRecoveryCodes(false);
      setVerificationCode("");
      setIsConfirmed(false);
      setShowDisableDialog(false);
      setDisablePassword("");
      setDisableCode("");
      setDisableRecoveryCode("");
      dispatch(updateUserLoginInformation({ two_factor_enabled: false }));
      toast.success(response.message || "2FA disabled successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to disable 2FA");
    }
  };

  const handleDisableDialogClose = (open: boolean) => {
    if (!open) {
      setShowDisableDialog(false);
      setDisablePassword("");
      setDisableCode("");
      setDisableRecoveryCode("");
      setDisableTab("code");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Secret key copied to clipboard");
  };

  const downloadRecoveryCodes = () => {
    if (!recoveryCodes.length) return;

    const codesText = recoveryCodes.join("\n");
    const blob = new Blob([codesText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "recovery-codes.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Recovery codes downloaded");
  };

  const handleConfirm = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      const response = await confirmMutation.mutateAsync({
        code: verificationCode,
      });
      setRecoveryCodes(twoFactorData?.recovery_codes || []);
      setIsConfirmed(true);
      setTwoFactorData(null);
      dispatch(updateUserLoginInformation({ two_factor_enabled: true }));
      toast.success(response.message || "2FA enabled successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to confirm 2FA");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-2">
      <div>
        <Text.TitleSmall>Two-Factor Authentication</Text.TitleSmall>
        <p className="text-sm text-muted-foreground">
          Add an extra layer of security to your account by requiring more than
          just a password to log in.
        </p>
      </div>

      {/* Main Toggle Card */}
      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>
              <span className="inline-flex mr-2 h-9 w-9 items-center justify-center rounded-full bg-green-50 ring-1 ring-green-200">
                <ShieldPlus className="w-5 h-5 text-green-600" />
              </span>
              Enable 2FA
            </CardTitle>
            <CardDescription>
              We recommend using an authenticator app like Google Authenticator
              or 1Password.
            </CardDescription>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggle}
            disabled={setupMutation.isPending || disableMutation.isPending}
          />
        </CardHeader>
      </Card>

      {/* Setup UI - Only show when newly setting up (twoFactorData exists) */}
      {twoFactorData && (
        <div className="grid gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <Card className="">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg">
                  <Smartphone className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="font-medium ">Authenticator App</p>
                    <p className="text-sm text-muted-foreground">
                      Scan the QR code in your authenticator app to get started.
                    </p>
                  </div>

                  {/* QR Code */}
                  <div className="bg-white p-4 w-40 h-40 rounded-md mx-auto">
                    <img
                      src={twoFactorData.qr_code}
                      alt="2FA QR Code"
                      className="w-full h-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase">
                      Manual Entry Key
                    </Label>
                    <div className="flex gap-2">
                      <code className="flex-1 p-2 rounded text-sm border">
                        {twoFactorData.secret}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(twoFactorData.secret)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {!isConfirmed && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase">
                        Verification Code
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={verificationCode}
                          onChange={e =>
                            setVerificationCode(
                              e.target.value.replace(/\D/g, "").slice(0, 6),
                            )
                          }
                          maxLength={6}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleConfirm}
                          disabled={
                            confirmMutation.isPending ||
                            verificationCode.length !== 6
                          }
                        >
                          {confirmMutation.isPending
                            ? "Confirming..."
                            : "Confirm"}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enter the 6-digit code from your authenticator app to
                        enable 2FA
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recovery Codes - Show after confirmation */}
      {isConfirmed && recoveryCodes.length > 0 && (
        <Card className="border-dashed animate-in fade-in slide-in-from-top-2 duration-300">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <CardTitle className="text-md ">Recovery Codes</CardTitle>
            </div>
            <CardDescription>
              Store these in a safe place. They allow you to access your account
              if you lose your phone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showRecoveryCodes ? (
              <Button
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => setShowRecoveryCodes(true)}
              >
                View Recovery Codes
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {recoveryCodes.map((code, index) => (
                    <code
                      key={index}
                      className="p-2 rounded text-sm border bg-muted"
                    >
                      {code}
                    </code>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Save these codes securely. Each code can only be used once.
                </p>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={downloadRecoveryCodes}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Recovery Codes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Disable 2FA Dialog */}
      <Dialog open={showDisableDialog} onOpenChange={handleDisableDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Enter your password and a verification code or recovery code to
              disable 2FA.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={disablePassword}
                onChange={e => setDisablePassword(e.target.value)}
              />
            </div>

            <Tabs
              value={disableTab}
              onValueChange={value =>
                setDisableTab(value as "code" | "recovery")
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="code">Authenticator Code</TabsTrigger>
                <TabsTrigger value="recovery">Recovery Code</TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="space-y-2 mt-3">
                <Label>Verification Code</Label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={disableCode}
                  onChange={e =>
                    setDisableCode(
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the 6-digit code from your authenticator app.
                </p>
              </TabsContent>

              <TabsContent value="recovery" className="space-y-2 mt-3">
                <Label>Recovery Code</Label>
                <Input
                  type="text"
                  placeholder="Enter recovery code"
                  value={disableRecoveryCode}
                  onChange={e => setDisableRecoveryCode(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter one of your recovery codes.
                </p>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => handleDisableDialogClose(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisable}
              disabled={
                disableMutation.isPending ||
                !disablePassword ||
                (disableTab === "code"
                  ? disableCode.length !== 6
                  : !disableRecoveryCode)
              }
            >
              {disableMutation.isPending ? "Disabling..." : "Disable 2FA"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
