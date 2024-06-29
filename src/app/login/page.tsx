"use client";
import LogoL from "~/assets/UltimatioLogo_Lighter.png";
import GoogleIcon from "~/assets/GoogleIcon2.png";
import useMediaQuery from "~/hooks/useMediaQuery";
import Link from "next/link";
import { ChevronRightIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginFailure,
  loginSuccess,
} from "~/utils/redux/user-slice";
import Cookies from "js-cookie";
import Image from "next/image";
import { SignInAccount } from "~/server/queries/auth.queries";
import { useRouter } from "next/navigation";

const LogIn = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 800px)");
  const isSmallTablet = useMediaQuery("(min-width: 600px)");
  const router = useRouter();

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
  const dispatch = useDispatch();

  const handleChange = (e: any) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleLogin = async () => {
    if (
      inputs.email !== undefined &&
      inputs.email.length > 0 &&
      inputs.password !== undefined
    ) {
      try {
        dispatch(loginStart());
        const response = await SignInAccount(
          inputs.email.trim(),
          inputs.password
        );

        if (response.success === true) {
          dispatch(loginSuccess(response.response));
          Cookies.set("access_token", response.token!, { expires: 365 });
          router.push("/");
        } else {
          setIsWrongCredentials(true);
          dispatch(loginFailure());
        }
      } catch (error) {
        setIsLoginError(true);
      }
    }
  };

  return (
    <section
      id="home"
      className={`fixed w-full h-full overflow-y-auto bg-login-background bg-cover flex ${
        isAboveMediumScreens ? "" : `${isSmallTablet ? "px-[155px]" : "px-8"}`
      }`}
    >
      <Link href="/">
        <Image
          alt="logo"
          src={LogoL}
          className={`fixed ${
            isAboveMediumScreens
              ? "top-10 left-10 h-14 w-auto"
              : `${
                  isSmallTablet
                    ? "top-8 left-6 h-12 w-auto"
                    : "top-5 left-4 h-6 w-auto"
                }`
          }`}
        />
      </Link>

      <div
        className={`bg-[#121212] h-max m-auto
          py-8 px-8 rounded-xl flex flex-col gap-6 items-center  ${
            isAboveMediumScreens ? "w-[425px]" : " w-full"
          }`}
      >
        <h1 className="text-center text-xl mb-[-15px]"> Log In </h1>
        <h1 className="text-center font-light text-sm mb-1 text-[#a6a6a6]">
          {" "}
          Welcome to UltimaTio{" "}
        </h1>

        <input
          placeholder="Email"
          onChange={(e) => {
            handleChange(e);
            setIsWrongCredentials(false);
            setIsLoginError(false);
          }}
          name="email"
          required
          className="bg-[#292929]
            px-4 p-2 rounded text-white w-full text-sm placeholder:text-sm placeholder:text-[#8a8a8a]"
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => {
            handleChange(e);
            setIsWrongCredentials(false);
            setIsLoginError(false);
          }}
          name="password"
          required
          className="bg-[#292929]
            px-4 p-2 rounded text-white w-full tx-sm placeholder:text-sm placeholder:text-[#8a8a8a]"
        />

        <div className="bg-[#ebf7ff] w-full py-1 flex justify-center rounded cursor-pointer max-w-[400px]">
          <Image alt="Google" src={GoogleIcon} className="h-5 w-5" />
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

        <div className="mt-1" onClick={handleLogin}>
          <ChevronRightIcon
            strokeWidth={0.8}
            className={`text-white border-[#383838]
              h-[60px] p-2 border-[2.5px] rounded-3xl stroke-current cursor-pointer
              ${
                inputs.email != undefined &&
                inputs.email.length > 0 &&
                inputs.password &&
                inputs.password.length > 0
                  ? "bg-[rgba(158,16,90)]"
                  : "cursor-not-allowed"
              }`}
          />
        </div>

        <Link href="/recover">
          <h1 className="font-light text-sm mt-[-6px] text-[#b8b8b8] cursor-pointer">
            Forgot password?
          </h1>
        </Link>

        <Link href="/signup">
          <h1 className="font-light text-sm mt-[-12px] cursor-pointer">
            <span className="text-[#b8b8b8]"> New around here? </span> Sign up
            now
          </h1>
        </Link>
      </div>
    </section>
  );
};

export default LogIn;
