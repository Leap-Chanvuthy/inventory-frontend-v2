import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Smartphone, ShieldCheck, Key, Copy, ShieldPlus } from "lucide-react";

export function TwoFactorAuth() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-lg font-medium ">Two-Factor Authentication</h3>
        <p className="text-sm text-muted-foreground">
          Add an extra layer of security to your account by requiring more than just a password to log in.
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
              We recommend using an authenticator app like Google Authenticator or 1Password.
            </CardDescription>
          </div>
          <Switch 
            checked={isEnabled} 
            onCheckedChange={setIsEnabled} 
          />
        </CardHeader>
      </Card>

      {/* Conditional Setup UI */}
      {isEnabled ? (
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
                  
                  {/* Placeholder for QR Code */}
                  <div className="bg-white p-4 w-40 h-40 rounded-md mx-auto lg:mx-0">
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-black text-xs text-center px-2">
                       [QR Code Generator Component]
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase">Manual Entry Key</Label>
                    <div className="flex gap-2">
                      <code className="flex-1 p-2 rounded text-sm border">
                        ABCD-1234-EFGH-5678
                      </code>
                      <Button variant="outline" size="icon"><Copy className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recovery Codes */}
          <Card className="border-dashed">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <CardTitle className="text-md ">Recovery Codes</CardTitle>
              </div>
              <CardDescription>
                Store these in a safe place. They allow you to access your account if you lose your phone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full sm:w-auto">
                Generate Recovery Codes
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="rounded-lg border p-8 flex flex-col items-center text-center">
          <Key className="w-12 h-12 text-zinc-700 mb-4" />
          <h4 className="text-zinc-400 font-medium">2FA is currently disabled</h4>
          <p className="text-zinc-500 text-sm max-w-xs">
            Switch the toggle above to start securing your account with time-based one-time passwords (TOTP).
          </p>
        </div>
      )}
    </div>
  );
}