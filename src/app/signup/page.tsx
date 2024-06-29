"use client";
import useMediaQuery from "~/hooks/UseMediaQuery";
import {
  MinusIcon,
  ChevronRightIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import GoogleIcon from "~/assets/GoogleIcon2.png";
import { Reveal } from "~/utils/framer-motion/reveal";
import Link from "next/link";
import { useState, useEffect } from "react";
import LogoL from "~/assets/UltimatioLogo_Lighter.png";
import { SignUpAccount, validateEmail } from "~/server/queries/auth.queries";
import Image from "next/image";

const SignUp = () => {
  const isAboveLargeScreens = useMediaQuery("(min-width: 1280px)");
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const isSmallTablet = useMediaQuery("(min-width: 650px)");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isEmailTaken, setIsEmailTaken] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [isErrorCreatingAcc, setIsErrorCreatingAcc] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<any>(0);

  interface Inputs {
    email?: string;
    checkbox?: boolean;
    password?: string;
    confirmpassword?: string;
  }

  const [inputs, setInputs] = useState<Inputs>({
    email: undefined,
    checkbox: false,
    password: undefined,
    confirmpassword: undefined,
  });

  const handleChange = (e: any) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  useEffect(() => {
    if (inputs.email !== undefined) {
      const validEmailRegex = /^[^\s]+@(gmail\.com|hotmail\.com|outlook\.es|yahoo\.com)$/i;
      setIsEmailValid(validEmailRegex.test(inputs.email));
    }
  }, [inputs.email]);

  useEffect(() => {
    const isPasswordValid =
      inputs.password !== undefined &&
      inputs.confirmpassword !== undefined &&
      inputs.password.length > 8 &&
      /\d/.test(inputs.password) &&
      /[A-Z]/.test(inputs.password) &&
      inputs.password === inputs.confirmpassword;

    setIsPasswordValid(isPasswordValid);
  }, [inputs.password, inputs.confirmpassword]);

  const handleNextStep = () => {
    if (currentStep === 0 && isEmailValid) {
      setCurrentStep((prevStep: any) => prevStep + 1);
    }
    if (currentStep === 1 && isPasswordValid) {
      setCurrentStep((prevStep: any) => prevStep + 1);
    }
  };

  const handleGoBack = (backTo: any) => {
    setCurrentStep(backTo);
  };

  const handleFirstStep = async () => {
    if (inputs.email !== undefined && inputs.email.length > 0) {
      try {
        const response = await validateEmail(inputs.email);
        if (response.success === true) {
          handleNextStep();
        } else {
          setIsEmailTaken(true);
        }
      } catch (error) {
        console.error("Error al validar el correo electrónico:", error);
      }
    }
  };

  const handleSecondStep = async () => {
    if (
      inputs.email !== undefined &&
      inputs.email.length > 0 &&
      inputs.password !== undefined &&
      inputs.password.length > 0 &&
      inputs.confirmpassword !== undefined &&
      inputs.confirmpassword.length > 0 &&
      inputs.checkbox !== undefined
    ) {
      try {
        const response = await SignUpAccount(
          inputs.email,
          inputs.password,
          inputs.confirmpassword,
          inputs.checkbox
        );

        if (response.success === true) {
          handleNextStep();
        } else {
          setIsErrorCreatingAcc(true);
        }
      } catch (error) {
        console.error("Error al validar el correo electrónico:", error);
      }
    }
  };

  return (
    <section
      id="home"
      className={`${
        isAboveLargeScreens ? "" : "bg-signup-background-mobile bg-cover flex"
      } fixed w-full h-full overflow-y-auto`}
    >
      <Link href="/">
        <Image
          alt="logo"
          src={LogoL}
          className={`fixed z-20 ${
            isAboveMediumScreens
              ? "top-10 left-10 h-14 w-auto "
              : `${
                  isSmallTablet
                    ? "top-8 left-6 h-12 w-auto"
                    : "top-5 left-4 h-6 w-auto"
                }`
          }`}
        />
      </Link>

      {isAboveLargeScreens && (
        <div className="inset-0 flex flex-col">
          <div className="bg-signup-background-desktop bg-cover relative inset-0 w-full h-full z-0 min-h-screen">
            <div className="flex items-center h-screen">
              <Reveal delay={0.25}>
                <h1
                  className="text-8xl max-w-[580px] font-viga font-bold mt-[40%] ml-[20%]"
                  style={{ textShadow: "4px 4px 8px rgba(0, 0, 0, 0.8)" }}
                >
                  CREATE AN ACCOUNT
                </h1>
              </Reveal>
            </div>
          </div>
        </div>
      )}

      <div
        className={`fixed z-30 bg-[#121212] rounded pt-2 pb-8 flex flex-col items-center gap-2 ${
          isAboveLargeScreens
            ? "top-[50%] right-36 transform -translate-y-1/2 px-14"
            : "m-auto h-max w-max px-10 relative"
        }`}
      >
        {currentStep < 2 && (
          <div className="flex gap-1 mb-5">
            <MinusIcon
              className={`${
                currentStep === 0 || currentStep > 0
                  ? "text-[rgba(158,16,90)] cursor-pointer"
                  : "text-white"
              }  h-[32px] w-auto stroke-current`}
              strokeWidth={1}
              onClick={() => handleGoBack(0)}
            />
            <MinusIcon
              className={`${
                currentStep === 1
                  ? "text-[rgba(158,16,90)] cursor-pointer"
                  : "text-white"
              }  h-[32px] w-auto stroke-current`}
              strokeWidth={1}
            />
          </div>
        )}

        {currentStep === 0 && (
          <>
            <h1 className="text-2xl ">What's your email?</h1>

            <h1 className="font-light text-lg text-[#a6a6a6] mb-5 text-center">
              Don't worry we won't tell anyone.
            </h1>

            <div className="flex flex-col gap-5 items-start w-full">
              <input
                placeholder="Email"
                value={inputs.email !== undefined ? inputs.email : ""}
                required
                name="email"
                onChange={(e) => {
                  handleChange(e);
                  setIsEmailTaken(false);
                }}
                className={`bg-[#292929] px-4 p-2 rounded text-white placeholder:text-[#8a8a8a] placeholder:text-sm
                ${isSmallTablet && !isAboveMediumScreens && "min-w-[340px]"}
                ${isAboveLargeScreens ? "w-[430px]" : "min-w-full"}`}
              />
              {!isEmailValid && inputs.email !== undefined && (
                <h1 className="font-normal text-sm text-[#F77CFF] mt-[-15px] mb-2">
                  You must enter a valid email
                </h1>
              )}
              {isEmailTaken && inputs.email !== undefined && (
                <h1 className="font-normal text-sm text-[#F77CFF] mt-[-15px] mb-2">
                  This email is not available
                </h1>
              )}

              <div
                className={`${
                  isAboveLargeScreens
                    ? "gap-4"
                    : "gap-3 items-center justify-center"
                } flex`}
              >
                <input
                  type="checkbox"
                  checked={
                    inputs.checkbox !== undefined ? inputs.checkbox : undefined
                  }
                  onChange={(e) =>
                    setInputs((prevInputs) => ({
                      ...prevInputs,
                      checkbox: e.target.checked,
                    }))
                  }
                  className={`${
                    isAboveLargeScreens ? "" : "size-3.5 mt-[-1px]"
                  } cursor-pointer`}
                />
                <p className="flex max-w-[400px] font-light text-sm">
                  {isAboveLargeScreens
                    ? "I acknowledge UltimaTio may send me info about account notifications or other UltimaTio-related content."
                    : "I would like to receive news."}
                </p>
              </div>
            </div>

            <h1
              className={`font-light text-sm text-[#a6a6a6] mb-2 ${
                isAboveLargeScreens ? "mt-10" : "mt-6"
              }`}
            >
              {isAboveLargeScreens
                ? "You could also create an account with"
                : "Or create an account with"}
            </h1>

            <div className="bg-[#ebf7ff] w-full py-1 flex justify-center rounded cursor-pointer">
              <Image alt="Google" src={GoogleIcon} className="h-5 w-5" />
            </div>

            <div className="mt-8">
              <ChevronRightIcon
                strokeWidth={0.8}
                className={`text-white
                h-[60px] p-2 border-[2.5px] border-[#383838] rounded-3xl stroke-current cursor-pointer
                ${
                  currentStep === 0
                    ? `${
                        inputs.email !== undefined && isEmailValid
                          ? "bg-[rgba(158,16,90)]"
                          : "transparent"
                      }`
                    : "transparent"
                }`}
                onClick={handleFirstStep}
              />
            </div>

            <Link href="/login">
              <h1 className="font-bold text-sm text-[#a6a6a6] mt-4 mb-2 cursor-pointer">
                Already have an account?
              </h1>
            </Link>
          </>
        )}

        {currentStep === 1 && (
          <>
            <h1 className="text-[22px] text-center">Choose a password</h1>

            <h1 className="font-light text-lg text-[#a6a6a6] mb-5 text-center">
              Make sure it's a good one.
            </h1>

            <div className="flex flex-col gap-5 items-start w-full">
              <input
                placeholder="Password"
                required
                value={inputs.password !== undefined ? inputs.password : ""}
                type="password"
                name="password"
                onChange={handleChange}
                className={`bg-[#292929] px-4 p-2 rounded text-white placeholder:text-[#8a8a8a] placeholder:text-sm
                ${isSmallTablet && !isAboveMediumScreens && "min-w-[340px]"}
                ${isAboveLargeScreens ? "w-[430px]" : "min-w-full"}`}
              />

              <div className="flex mt-[-5px] mb-2 items-center gap-2">
                {inputs.password !== undefined && inputs.password.length > 8 ? (
                  <CheckCircleIcon
                    strokeWidth={1}
                    className="text-[#88fc96] h-[16px]"
                  />
                ) : (
                  <XCircleIcon
                    strokeWidth={1}
                    className="text-[#b5b5b5] h-[16px]"
                  />
                )}

                <h1
                  className={`font-normal text-sm ${
                    inputs.password !== undefined && inputs.password.length > 8
                      ? "text-[#88fc96]"
                      : "text-[#b5b5b5]"
                  }`}
                >
                  Minimum 8 characters.
                </h1>
              </div>

              <div className="flex mt-[-20px] mb-2 items-center gap-2">
                {inputs.password !== undefined && /\d/.test(inputs.password) ? (
                  <CheckCircleIcon
                    strokeWidth={1}
                    className="text-[#88fc96] h-[16px]"
                  />
                ) : (
                  <XCircleIcon
                    strokeWidth={1}
                    className="text-[#b5b5b5] h-[16px]"
                  />
                )}

                <h1
                  className={`font-normal text-sm ${
                    inputs.password !== undefined && /\d/.test(inputs.password)
                      ? "text-[#88fc96]"
                      : "text-[#b5b5b5]"
                  }`}
                >
                  Must include numbers.
                </h1>
              </div>

              <div className="flex mt-[-20px] mb-2 items-center gap-2">
                {inputs.password !== undefined &&
                /[A-Z]/.test(inputs.password) ? (
                  <CheckCircleIcon
                    strokeWidth={1}
                    className="text-[#88fc96] h-[16px]"
                  />
                ) : (
                  <XCircleIcon
                    strokeWidth={1}
                    className="text-[#b5b5b5] h-[16px]"
                  />
                )}

                <h1
                  className={`font-normal text-sm ${
                    inputs.password !== undefined &&
                    /[A-Z]/.test(inputs.password)
                      ? "text-[#88fc96]"
                      : "text-[#b5b5b5]"
                  }`}
                >
                  Must have upper/lower case.
                </h1>
              </div>

              <input
                placeholder="Confirm Password"
                required
                value={
                  inputs.confirmpassword !== undefined
                    ? inputs.confirmpassword
                    : ""
                }
                type="password"
                name="confirmpassword"
                onChange={handleChange}
                className={`bg-[#292929] px-4 p-2 rounded text-white placeholder:text-[#8a8a8a] placeholder:text-sm
                ${isSmallTablet && !isAboveMediumScreens && "min-w-[340px]"}
                ${isAboveLargeScreens ? "w-[430px]" : "min-w-full"}`}
              />

              {(inputs.password || inputs.confirmpassword) &&
                inputs.password !== inputs.confirmpassword && (
                  <h1 className="font-normal text-sm text-[#F77CFF] mt-[-15px] mb-2">
                    Passwords do not match
                  </h1>
                )}

              {isErrorCreatingAcc &&
                inputs.password !== undefined &&
                inputs.confirmpassword !== undefined && (
                  <h1 className="font-normal text-sm text-[#F77CFF] mt-[-15px] mb-4">
                    Error creating account
                  </h1>
                )}
            </div>

            <div className="mt-5">
              <ChevronRightIcon
                strokeWidth={0.8}
                className={`text-white h-[60px] p-2 border-[2.5px] border-[#383838] rounded-3xl stroke-current cursor-pointer
                ${
                  currentStep === 0
                    ? inputs.email !== undefined && isEmailValid
                      ? "bg-[rgba(158,16,90)]"
                      : ""
                    : currentStep === 1
                    ? inputs.password !== undefined && isPasswordValid
                      ? "bg-[rgba(158,16,90)]"
                      : ""
                    : "transparent"
                }`}
                onClick={handleSecondStep}
              />
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <h1 className="text-2xl pt-10">Congratulations!</h1>

            <h1 className="font-light text-md text-[#a6a6a6] mt-2 mb-8 text-center">
              Welcome to UltimaTio, you can now log into you account.
            </h1>

            <Link href="/login">
              <div className="relative flex py-2 px-4 bg-[#6C0386] rounded-md mb-3 text-white">
                Go to log in
              </div>
            </Link>
          </>
        )}
      </div>
    </section>
  );
};

export default SignUp;
