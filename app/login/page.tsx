/*
┌──────────────────────────────────────────────────────────────────────────────┐
│ @author: Davidson Gomes                                                      │
│ @file: /app/login/page.tsx                                                   │
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

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { login, forgotPassword, getMe, register, resendVerification } from "@/services/authService";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);
  const [showForgotSuccess, setShowForgotSuccess] = useState(false);
  const [redirectSeconds, setRedirectSeconds] = useState(5);
  const redirectTimer = useRef<NodeJS.Timeout | null>(null);
  const [loginError, setLoginError] = useState("");
  const [isEmailNotVerified, setIsEmailNotVerified] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const [forgotEmail, setForgotEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    setIsEmailNotVerified(false);

    try {
      const response = await login({
        email: loginData.email,
        password: loginData.password,
      });
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        document.cookie = `access_token=${
          response.data.access_token
        }; path=/; max-age=${60 * 60 * 24 * 7}`;
        const meResponse = await getMe();
        if (meResponse.data) {
          localStorage.setItem("user", JSON.stringify(meResponse.data));
          document.cookie = `user=${encodeURIComponent(
            JSON.stringify(meResponse.data)
          )}; path=/; max-age=${60 * 60 * 24 * 7}`;
        }
      }
      router.push("/");
    } catch (error: any) {
      let errorDetail = "Check your credentials and try again.";
      
      if (error?.response?.data) {
        if (typeof error.response.data.detail === 'string') {
          errorDetail = error.response.data.detail;
        } else if (error.response.data.detail) {
          errorDetail = JSON.stringify(error.response.data.detail);
        }
      }
      
      if (errorDetail === "Email not verified") {
        setIsEmailNotVerified(true);
      }
      
      setLoginError(errorDetail);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!loginData.email) return;
    
    setIsResendingVerification(true);
    try {
      await resendVerification({ email: loginData.email });
      toast({
        title: "Verification email sent",
        description: "Please check your inbox to verify your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error sending verification email",
        description:
          error?.response?.data?.detail ||
          "Unable to send verification email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerData.password) {
      toast({
        title: "Password required",
        description: "Please enter a password.",
        variant: "destructive",
      });
      return;
    }

    if (registerData.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: registerData.email,
        password: registerData.password,
        name: registerData.name,
      });

      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
      });

      setShowRegisterSuccess(true);
      setRedirectSeconds(5);
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
      redirectTimer.current = setInterval(() => {
        setRedirectSeconds((s) => s - 1);
      }, 1000);
    } catch (error: any) {
      let errorMessage = "Unable to register. Please try again.";
      
      if (error?.response?.data) {
        if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.detail) {
          errorMessage = JSON.stringify(error.response.data.detail);
        }
      }
      
      toast({
        title: "Error registering",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if ((showRegisterSuccess || showForgotSuccess) && redirectSeconds === 0) {
      setShowRegisterSuccess(false);
      setShowForgotSuccess(false);
      setActiveTab("login");
      setRedirectSeconds(5);
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
    }
  }, [showRegisterSuccess, showForgotSuccess, redirectSeconds]);

  useEffect(() => {
    if (!(showRegisterSuccess || showForgotSuccess) && redirectTimer.current) {
      clearInterval(redirectTimer.current);
    }
  }, [showRegisterSuccess, showForgotSuccess]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await forgotPassword({ email: forgotEmail });
      toast({
        title: "Email sent",
        description: "Check your inbox to reset your password.",
      });
      setShowForgotSuccess(true);
      setRedirectSeconds(5);
      if (redirectTimer.current) clearTimeout(redirectTimer.current);
      redirectTimer.current = setInterval(() => {
        setRedirectSeconds((s) => s - 1);
      }, 1000);
    } catch (error: any) {
      let errorMessage = "Unable to send the reset password email. Please try again.";
      
      if (error?.response?.data) {
        if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.detail) {
          errorMessage = JSON.stringify(error.response.data.detail);
        }
      }
      
      toast({
        title: "Error sending email",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#121212] p-4">
      <div className="mb-8">
        <Image
          src="https://evolution-api.com/files/evo/logo-evo-ai.svg"
          alt="Evolution API"
          width={140}
          height={30}
          priority
        />
      </div>

      <Card className="w-full max-w-md bg-[#1a1a1a] border-[#333]">
        {showRegisterSuccess ? (
          <div className="flex flex-col items-center justify-center p-8">
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Registration successful!</h2>
            <p className="text-neutral-300 mb-2 text-center">
              Please check your email to confirm your account.<br />
              Redirecting to login in {redirectSeconds} seconds...
            </p>
          </div>
        ) : showForgotSuccess ? (
          <div className="flex flex-col items-center justify-center p-8">
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Email sent!</h2>
            <p className="text-neutral-300 mb-2 text-center">
              Check your inbox to reset your password.<br />
              Redirecting to login in {redirectSeconds} seconds...
            </p>
          </div>
        ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-[#222]">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-[#333] data-[state=active]:text-emerald-400"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-[#333] data-[state=active]:text-emerald-400"
            >
              Register
            </TabsTrigger>
            <TabsTrigger
              value="forgot"
              className="data-[state=active]:bg-[#333] data-[state=active]:text-emerald-400"
            >
              Forgot
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle className="text-white">Login</CardTitle>
                <CardDescription className="text-neutral-400">
                  Enter your credentials to access the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-neutral-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    className="bg-[#222] border-[#444] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-neutral-300">
                      Password
                    </Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="bg-[#222] border-[#444] text-white"
                  />
                </div>
                {loginError && (
                  <div className="text-red-500 text-sm mt-2" data-testid="login-error">
                    {isEmailNotVerified ? (
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          <span>{loginError}</span>
                        </div>
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleResendVerification}
                          disabled={isResendingVerification}
                          className="text-emerald-400 border-emerald-400 hover:bg-emerald-400/10"
                        >
                          {isResendingVerification ? "Sending..." : "Resend verification email"}
                        </Button>
                      </div>
                    ) : (
                      loginError
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-emerald-400 text-black hover:bg-[#00cc7d]"
                  disabled={isLoading}
                >
                  {isLoading ? "Entering..." : "Enter"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <CardHeader>
                <CardTitle className="text-white">Register</CardTitle>
                <CardDescription className="text-neutral-400">
                  Create a new account to get started.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-neutral-300">
                    Name
                  </Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Your name"
                    required
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, name: e.target.value })
                    }
                    className="bg-[#222] border-[#444] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-neutral-300">
                    Email
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    className="bg-[#222] border-[#444] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-neutral-300">
                    Password
                  </Label>
                  <Input
                    id="register-password"
                    type="password"
                    required
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    className="bg-[#222] border-[#444] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="register-confirm-password"
                    className="text-neutral-300"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    required
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="bg-[#222] border-[#444] text-white"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-emerald-400 text-black hover:bg-[#00cc7d]"
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="forgot">
            <form onSubmit={handleForgotPassword}>
              <CardHeader>
                <CardTitle className="text-white">Forgot Password</CardTitle>
                <CardDescription className="text-neutral-400">
                  Enter your email to receive a password reset link.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email" className="text-neutral-300">
                    Email
                  </Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="bg-[#222] border-[#444] text-white"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-emerald-400 text-black hover:bg-[#00cc7d]"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Link"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
        )}
      </Card>

      <div className="mt-4 text-center text-sm text-neutral-500">
        <p>
          By using this service, you agree to our{" "}
          <Link href="#" className="text-emerald-400 hover:underline">
            Terms of Service
          </Link>{" "}
          e{" "}
          <Link href="#" className="text-emerald-400 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
