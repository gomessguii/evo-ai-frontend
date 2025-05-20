/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/security/reset-password/page.tsx                                 │
│ Developed by: Davidson Gomes                                                 │
│ Creation date: May 13, 2025                                                  │
│ Contact: contato@evolution-api.com                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│ @copyright © Evolution API 2025. All rights reserved.                        │
│ Licensed under the Apache License, Version 2.0                               │
│                                                                              │
│ You may not use this file except in compliance with the License.             │
│ You may obtain a copy of the License at                                      │
│                                                                              │
│    http://www.apache.org/licenses/LICENSE-2.0                                │
│                                                                              │
│ Unless required by applicable law or agreed to in writing, software          │
│ distributed under the License is distributed on an "AS IS" BASIS,            │
│ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.     │
│ See the License for the specific language governing permissions and          │
│ limitations under the License.                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│ @important                                                                   │
│ For any future changes to the code in this file, it is recommended to        │
│ include, together with the modification, the information of the developer    │
│ who changed it and the date of modification.                                 │
└──────────────────────────────────────────────────────────────────────────────┘
*/
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { resetPassword } from "@/services/authService";
import Link from "next/link";

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPage />
    </Suspense>
  );
}

function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";
  const [form, setForm] = useState({
    token: tokenFromUrl,
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [redirectSeconds, setRedirectSeconds] = useState(5);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.token) {
      setError("Recovery token is required.");
      setStatus("error");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      await resetPassword({ token: form.token, new_password: form.password });
      setStatus("success");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reset password.");
      setStatus("error");
    }
  };

  useEffect(() => {
    if (status === "success" && redirectSeconds > 0) {
      const timer = setTimeout(() => {
        setRedirectSeconds((s) => s - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (status === "success" && redirectSeconds === 0) {
      router.push("/login");
    }
  }, [status, redirectSeconds, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === "success" ? (
              <Alert className="border-green-500">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500 inline" />
                <AlertTitle>Password reset!</AlertTitle>
                <AlertDescription>
                  Your password has been updated.
                  <br />
                  Redirecting to login in {redirectSeconds} seconds...
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {status === "error" && (
                  <Alert variant="destructive">
                    <XCircle className="mr-2 h-4 w-4 inline" />
                    <AlertTitle>Reset failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Input
                    id="token"
                    name="token"
                    type="hidden"
                    value={form.token}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat new password"
                    required
                  />
                </div>
              </>
            )}
          </CardContent>
          {status !== "success" && (
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-emerald-400 text-black hover:bg-[#00cc7d]"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </CardFooter>
          )}
          <div className="mt-4 mb-2 text-center">
            <Link href="/login" className="text-emerald-400 hover:underline">Go to Login</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
