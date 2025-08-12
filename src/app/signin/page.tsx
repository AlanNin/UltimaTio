"use client";
import Logo from "~/assets/icons/ultimatio-logo.png";
import GoogleIcon from "~/assets/icons/google.png";
import useMediaQuery from "~/hooks/use-media-query";
import Link from "next/link";
import {
  ChevronRightIcon,
  EyeIcon,
  EyeSlashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import Cookies from "js-cookie";
import { SignInAccount, SignInWithGoogle } from "~/server/queries/auth.queries";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { GoogleProvider, auth } from "~/firebase/config";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "~/providers/redux/user-slice";

const LogIn = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 800px)");
  const isSmallTablet = useMediaQuery("(min-width: 600px)");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect_fallback = searchParams.get("redirect_fallback");
  const dispatch = useDispatch();

  interface Inputs {
    email?: string;
    password?: string;
  }

  const [inputs, setInputs] = useState<Inputs>({
    email: undefined,
    password: undefined,
  });
  const [isWrongCredentials, setIsWrongCredentials] = useState<boolean>(false);
  const [isLoginError, setIsLoginError] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: any) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const {
    mutate: loginMutation,
    isPending: isLoginMutationPending,
  } = useMutation({
    mutationFn: ({ email, password }: { email: any; password: string }) =>
      SignInAccount(email.trim(), password),
    onMutate: () => {
      dispatch(loginStart());
    },
    onSuccess: (data) => {
      if (data.success === true) {
        Cookies.set("access_token", data.token!, { expires: 365 });
        dispatch(loginSuccess(data.response));
        if (redirect_fallback) {
          router.replace(redirect_fallback);
        } else {
          router.replace("/");
        }
      } else {
        setIsWrongCredentials(true);
      }
    },
    onError: () => {
      dispatch(loginFailure());
      setIsLoginError(true);
    },
  });

  const {
    mutate: loginGoogleMutation,
    isPending: isLoginGoogleMutationPending,
  } = useMutation({
    mutationFn: () => signInWithPopup(auth, GoogleProvider),
    onMutate: () => {
      dispatch(loginStart());
    },
    onSuccess: async (data) => {
      const { response, token } = await SignInWithGoogle(data.user.email!);
      if (token) {
        Cookies.set("access_token", token, { expires: 365 });
        dispatch(loginSuccess(response));
        if (redirect_fallback) {
          router.replace(redirect_fallback);
        } else {
          router.replace("/");
        }
      }
    },
    onError: () => {
      setIsLoginError(true);
      dispatch(loginFailure());
    },
  });

  const handleLogin = async () => {
    if (
      inputs.email !== undefined &&
      inputs.email.length > 0 &&
      inputs.password !== undefined
    ) {
      loginMutation({ email: inputs.email, password: inputs.password });
    }
  };

  // HANDLE SIGN UP WITH GOOGLE
  const signInWithGoogle = () => {
    loginGoogleMutation();
  };

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

      <div
        className={`bg-[#121212] h-max m-auto shadow-md
          py-8 px-8 rounded-xl flex flex-col gap-6 items-center  ${
            isAboveMediumScreens ? "w-[425px]" : " w-full"
          }`}
      >
        <div className="flex flex-col gap-y-1 mb-1">
          <h1 className="text-center text-xl "> Sign In </h1>
          <h1 className="text-center font-light text-sm  text-[#a6a6a6]">
            Welcome to UltimaTio
          </h1>
        </div>

        <input
          placeholder="Email"
          onChange={(e) => {
            handleChange(e);
            setIsWrongCredentials(false);
            setIsLoginError(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && handleLogin) {
              handleLogin();
            }
          }}
          name="email"
          autoComplete="new-email"
          autoFocus={true}
          required
          className="bg-[#292929] focus:outline-none font-normal
            px-4 py-2.5 rounded text-white w-full text-sm placeholder:text-sm placeholder:text-[#8a8a8a]"
        />

        <div
          className={`relative bg-[#292929] rounded w-full m-0 p-0
              `}
        >
          <input
            placeholder="Password"
            required
            autoComplete="new-password"
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={(e) => {
              handleChange(e);
              setIsWrongCredentials(false);
              setIsLoginError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && handleLogin) {
                handleLogin();
              }
            }}
            className={`bg-transparent text-white placeholder:text-[#8a8a8a] text-sm placeholder:text-sm w-full py-2.5 px-4 pr-12 focus:outline-none font-normal
                   `}
          />
          {inputs.password && inputs.password.length > 0 && (
            <>
              {showPassword ? (
                <EyeSlashIcon
                  strokeWidth={0.8}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white h-5 w-5 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <EyeIcon
                  strokeWidth={0.8}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white h-5 w-5 cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </>
          )}
        </div>

        <div
          className="bg-[#ebf7ff] w-full py-1.5 flex justify-center rounded cursor-pointer max-w-[400px] select-none"
          onClick={signInWithGoogle}
        >
          <img alt="Google" src={GoogleIcon.src} className="h-5 w-5" />
        </div>

        {isLoginError &&
          inputs.email !== undefined &&
          inputs.email.length > 0 &&
          inputs.password !== undefined &&
          inputs.password.length > 0 && (
            <h1 className="font-normal text-sm text-[#F77CFF] mt-[-14px] w-full text-start">
              Server error
            </h1>
          )}

        {isWrongCredentials &&
          inputs.email !== undefined &&
          inputs.email.length > 0 &&
          inputs.password !== undefined &&
          inputs.password.length > 0 && (
            <div className="flex mt-[-14px] items-center gap-1.5 w-full">
              <XCircleIcon
                strokeWidth={1}
                className="text-[#F77CFF] h-[16px]"
              />

              <h1 className="font-normal text-xs text-[#F77CFF]">
                Wrong Credentials
              </h1>
            </div>
          )}

        <div className="mt-1">
          {isLoginMutationPending || isLoginGoogleMutationPending ? (
            <div className="border-transparent p-4 bg-[rgba(158,16,90,0.5)]  rounded-3xl">
              <Loader2 className="h-7 w-7 text-white animate-spin cursor-progress " />
            </div>
          ) : (
            <ChevronRightIcon
              strokeWidth={0.8}
              className={`text-white border-[#383838]
              h-[60px] p-2 pr-1.5 pl-2.5 border-[2.5px] rounded-3xl stroke-current cursor-pointer
              ${
                inputs.email != undefined &&
                inputs.email.length > 0 &&
                inputs.password &&
                inputs.password.length > 0
                  ? "bg-[rgba(158,16,90)] border-transparent"
                  : "cursor-not-allowed"
              }`}
              onClick={handleLogin}
            />
          )}
        </div>

        <div className="flex flex-col items-center gap-y-2 mt-[-6px]">
          <Link href="/recover">
            <h1 className="font-light text-sm text-[#b8b8b8] hover:text-white cursor-pointer transition-colors">
              Forgot password?
            </h1>
          </Link>

          <h1 className="font-light text-sm">
            <span className="text-[#b8b8b8]"> New around here? </span>{" "}
            <Link href="/signup">Sign up now</Link>
          </h1>
        </div>
      </div>
    </section>
  );
};

export default LogIn;
