"use client";
import Logo from "~/assets/icons/ultimatio-logo.png";
import useMediaQuery from "~/hooks/use-media-query";
import Link from "next/link";
import { ChevronRightIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import {
  ResetPassword,
  SentRecoverAccountEmail,
  VerifyRecoverAccountToken,
} from "~/server/queries/auth.queries";
import { useSearchParams } from "next/navigation";
import { CheckCircle, EyeIcon, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const LogIn = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 800px)");
  const isSmallTablet = useMediaQuery("(min-width: 600px)");
  const searchParams = useSearchParams();
  const recover_token = searchParams.get("recover-token");
  const [step, setStep] = useState<number>(0);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(
    false
  );

  interface Inputs {
    email?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  }

  const [inputs, setInputs] = useState<Inputs>({
    email: undefined,
    newPassword: undefined,
    confirmNewPassword: undefined,
  });

  const handleChange = (e: any) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  // HANDLE SENT RECOVER EMAIL
  const {
    mutate: recoverEmailSentMutation,
    isPending: isRecoverEmailSentPending,
  } = useMutation({
    mutationFn: () => SentRecoverAccountEmail(inputs.email!),
    onSuccess: () => {
      setStep(1);
      setInputs({
        email: undefined,
        newPassword: undefined,
        confirmNewPassword: undefined,
      });
    },
  });

  function handleSentRecoverEmail() {
    if (inputs.email !== undefined && inputs.email.length > 0) {
      recoverEmailSentMutation();
    }
  }

  // HANDLE VERIFICATION TOKEN
  const {
    mutate: verifyRecoverTokenMutation,
    isPending: isVerifingTokenPending,
  } = useMutation({
    mutationFn: () => VerifyRecoverAccountToken(String(recover_token)),
    onSuccess: () => {
      setStep(2);
      setInputs({
        email: undefined,
        newPassword: undefined,
        confirmNewPassword: undefined,
      });
    },
  });

  // HANDLE RESET PASSWORD
  const {
    mutate: resetPasswordMutation,
    isPending: isResetPasswordPending,
  } = useMutation({
    mutationFn: () =>
      ResetPassword(
        String(recover_token),
        inputs.newPassword!,
        inputs.confirmNewPassword!
      ),
    onSuccess: () => {
      setStep(3);
      setInputs({
        email: undefined,
        newPassword: undefined,
        confirmNewPassword: undefined,
      });
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("recover-token");
      const newUrl = `${window.location.pathname}?${newParams.toString()}`;
      window.history.replaceState(null, "", newUrl);
    },
  });

  function handleResetPassword() {
    if (
      inputs.newPassword !== undefined &&
      inputs.newPassword.length > 0 &&
      inputs.confirmNewPassword !== undefined &&
      inputs.confirmNewPassword.length > 0 &&
      inputs.newPassword === inputs.confirmNewPassword
    ) {
      resetPasswordMutation();
    }
  }

  useEffect(() => {
    if (!recover_token) {
      return;
    }
    verifyRecoverTokenMutation();
  }, [recover_token]);

  return (
    <section
      id="home"
      className={`fixed w-full h-full overflow-y-auto bg-signin-background bg-cover flex ${
        isAboveMediumScreens ? "" : `${isSmallTablet ? "px-[155px]" : "px-8"}`
      }`}
    >
      <Link href="/">
        <img
          alt="logo"
          src={Logo.src}
          className={`fixed ${
            isAboveMediumScreens
              ? "top-10 left-10 h-10 w-auto"
              : `${
                  isSmallTablet
                    ? "top-8 left-6 h-8 w-auto"
                    : "top-5 left-4 h-6 w-auto"
                }`
          }`}
        />
      </Link>

      {step === 0 && (
        <>
          {isVerifingTokenPending ? (
            <div
              className={`bg-[#121212] h-max m-auto shadow-md
          py-8 px-8 rounded-xl flex flex-col gap-6 items-center  ${
            isAboveMediumScreens ? "w-[425px]" : " w-full"
          }`}
            >
              <Loader2 className="size-12" />
            </div>
          ) : (
            <div
              className={`bg-[#121212] h-max m-auto shadow-md
          py-8 px-8 rounded-xl flex flex-col gap-6 items-center  ${
            isAboveMediumScreens ? "w-[425px]" : " w-full"
          }`}
            >
              <div className="flex flex-col gap-y-1 mb-1">
                <h1 className="text-center text-xl "> Recover Password </h1>
                <h1 className="text-center font-light text-sm  text-[#a6a6a6]">
                  Enter your email to recover your password.
                </h1>
              </div>

              <input
                placeholder="Email"
                onChange={(e) => {
                  handleChange(e);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && handleSentRecoverEmail) {
                    handleSentRecoverEmail();
                  }
                }}
                name="email"
                autoComplete="new-email"
                autoFocus={true}
                required
                className="bg-[#292929] focus:outline-none font-normal
            px-4 py-2.5 rounded text-white w-full text-sm placeholder:text-sm placeholder:text-[#8a8a8a]"
              />

              <div className="mt-1">
                {isRecoverEmailSentPending ? (
                  <div className="border-transparent p-4 bg-[rgba(158,16,90,0.5)]  rounded-3xl">
                    <Loader2 className="h-7 w-7 text-white animate-spin cursor-progress " />
                  </div>
                ) : (
                  <ChevronRightIcon
                    strokeWidth={0.8}
                    className={`text-white border-[#383838]
              h-[60px] p-2 pr-1.5 pl-2.5 border-[2.5px] rounded-3xl stroke-current cursor-pointer
              ${
                inputs.email != undefined && inputs.email.length > 0
                  ? "bg-[rgba(158,16,90)] border-transparent"
                  : "cursor-not-allowed"
              }`}
                    onClick={handleSentRecoverEmail}
                  />
                )}
              </div>

              <div className="flex flex-col items-center gap-y-2 mt-[-6px]">
                <h1 className="font-light text-sm">
                  <span className="text-[#b8b8b8]">
                    {" "}
                    Already have an account?{" "}
                  </span>{" "}
                  <Link href="/signin">Sign in now</Link>
                </h1>
              </div>
            </div>
          )}
        </>
      )}

      {step === 1 && (
        <div
          className={`bg-[#121212] h-max m-auto shadow-md
          py-8 px-8 rounded-xl flex flex-col gap-6 items-center  ${
            isAboveMediumScreens ? "w-[425px]" : " w-full"
          }`}
        >
          <div className="flex flex-col gap-y-1 mb-1">
            <h1 className="text-center text-xl "> Recover Password </h1>
            <h1 className="text-center font-light text-sm  text-[#a6a6a6]">
              Email sent! Check your inbox and reset your password.
            </h1>
          </div>

          <CheckCircle className="size-16 text-green-500" />

          <div className="flex flex-col items-center gap-y-2">
            <h1 className="font-light text-sm">
              <span className="text-[#b8b8b8]"> Already have an account? </span>{" "}
              <Link href="/signin">Sign in now</Link>
            </h1>
          </div>
        </div>
      )}

      {step === 2 && (
        <div
          className={`bg-[#121212] h-max m-auto shadow-md
          py-8 px-8 rounded-xl flex flex-col gap-6 items-center  ${
            isAboveMediumScreens ? "w-[425px]" : " w-full"
          }`}
        >
          <div className="flex flex-col gap-y-1 mb-1">
            <h1 className="text-center text-xl "> Recover Password </h1>
            <h1 className="text-center font-light text-sm  text-[#a6a6a6]">
              Type your new password to recover your account.
            </h1>
          </div>

          <div
            className={`relative bg-[#292929] rounded w-full m-0 p-0
              `}
          >
            <input
              placeholder="New Password"
              required
              autoComplete="new-password"
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              onChange={(e) => {
                handleChange(e);
              }}
              className={`bg-transparent text-white placeholder:text-[#8a8a8a] text-sm placeholder:text-sm w-full py-2.5 px-4 pr-12 focus:outline-none font-normal
                   `}
            />

            {showNewPassword ? (
              <EyeSlashIcon
                strokeWidth={0.8}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white h-5 w-5 cursor-pointer"
                onClick={() => setShowNewPassword(false)}
              />
            ) : (
              <EyeIcon
                strokeWidth={0.8}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white h-5 w-5 cursor-pointer"
                onClick={() => setShowNewPassword(true)}
              />
            )}
          </div>

          <div
            className={`relative bg-[#292929] rounded w-full m-0 p-0
              `}
          >
            <input
              placeholder="Confirm New Password"
              required
              autoComplete="new-password"
              type={showConfirmNewPassword ? "text" : "password"}
              name="confirmNewPassword"
              onChange={(e) => {
                handleChange(e);
              }}
              className={`bg-transparent text-white placeholder:text-[#8a8a8a] text-sm placeholder:text-sm w-full py-2.5 px-4 pr-12 focus:outline-none font-normal
                   `}
            />

            {showConfirmNewPassword ? (
              <EyeSlashIcon
                strokeWidth={0.8}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white h-5 w-5 cursor-pointer"
                onClick={() => setShowConfirmNewPassword(false)}
              />
            ) : (
              <EyeIcon
                strokeWidth={0.8}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white h-5 w-5 cursor-pointer"
                onClick={() => setShowConfirmNewPassword(true)}
              />
            )}
          </div>

          <div className="mt-1">
            {isResetPasswordPending ? (
              <div className="border-transparent p-4 bg-[rgba(158,16,90,0.5)]  rounded-3xl">
                <Loader2 className="h-7 w-7 text-white animate-spin cursor-progress " />
              </div>
            ) : (
              <ChevronRightIcon
                strokeWidth={0.8}
                className={`text-white border-[#383838]
              h-[60px] p-2 pr-1.5 pl-2.5 border-[2.5px] rounded-3xl stroke-current cursor-pointer
              ${
                inputs.newPassword != undefined &&
                inputs.newPassword.length > 0 &&
                inputs.confirmNewPassword != undefined &&
                inputs.confirmNewPassword.length > 0 &&
                inputs.newPassword === inputs.confirmNewPassword
                  ? "bg-[rgba(158,16,90)] border-transparent"
                  : "cursor-not-allowed"
              }`}
                onClick={handleResetPassword}
              />
            )}
          </div>

          <div className="flex flex-col items-center gap-y-2">
            <h1 className="font-light text-sm">
              <span className="text-[#b8b8b8]"> Already have an account? </span>{" "}
              <Link href="/signin">Sign in now</Link>
            </h1>
          </div>
        </div>
      )}

      {step === 3 && (
        <div
          className={`bg-[#121212] h-max m-auto shadow-md
          py-8 px-8 rounded-xl flex flex-col gap-6 items-center  ${
            isAboveMediumScreens ? "w-[425px]" : " w-full"
          }`}
        >
          <div className="flex flex-col gap-y-1 mb-1">
            <h1 className="text-center text-xl "> Recover Password </h1>
            <h1 className="text-center font-light text-sm  text-[#a6a6a6]">
              Your password has been reset. You can now sign in.
            </h1>
          </div>

          <Link
            href="/signin"
            className="text-white px-5 py-1.5 rounded-md w-max mx-auto transition duration-500 p-2 bg-[#6C0386] hover:bg-[#510266] text-sm"
          >
            Go To Sign In
          </Link>
        </div>
      )}
    </section>
  );
};

export default LogIn;
