"use client";
import React, { forwardRef, useEffect, useState } from "react";
import Loading from "react-loading";
import useMediaQuery from "~/hooks/useMediaQuery";

type Props = {
  isLoadingLibraries: boolean;
  libraries: any;
  handleAddToLibrary: (library_name: string) => void;
};

const AddLibraryModule = forwardRef<HTMLDivElement, Props>(
  ({ isLoadingLibraries, libraries, handleAddToLibrary }, ref) => {
    const isAboveMobileScreens = useMediaQuery("(min-width: 900px)");

    return (
      <>
        {isAboveMobileScreens ? (
          <div
            className="absolute top-[40px] left-0 right-0 w-full h-max bg-[rgba(24,24,24)] rounded-md p-4 text-center flex flex-col gap-3 border-b border-r border-l border-[rgba(255,255,255,0.04)]"
            ref={ref}
          >
            <div className="absolute top-[-10px] left-[50%] transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-[rgba(24,24,24)]" />
            {isLoadingLibraries ? (
              <div className="flex items-center justify-center">
                <Loading type="spin" color="#fff" height={30} width={30} />
              </div>
            ) : (
              libraries?.map((library: any, index: number) => (
                <div
                  key={index}
                  className={`flex items-center justify-center text-center gap-2 cursor-pointer py-2 rounded-md transition-colors duration-300 hover:bg-[rgba(255,255,255,0.05)] ${
                    library.added ? "bg-[rgba(255,255,255,0.05)]" : ""
                  }`}
                  onClick={() => handleAddToLibrary(library.name)}
                >
                  {library.added && <span>✔</span>}
                  <span className="text-sm font-bold">{library.name}</span>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="fixed inset-0 w-screen h-screen bg-[rgba(0,0,0,0.7)] z-40 flex items-center justify-center">
            <div
              className="w-max h-max bg-[rgba(24,24,24,0.95)] rounded-md p-4 text-center flex flex-col gap-3 border border-[rgba(255,255,255,0.04)] mt-[-40px]"
              ref={ref}
            >
              {isLoadingLibraries ? (
                <div className="flex items-center justify-center">
                  <Loading type="spin" color="#fff" height={40} width={40} />
                </div>
              ) : (
                libraries?.map((library: any, index: number) => (
                  <div
                    key={index}
                    className={`flex items-center justify-center text-center gap-3 cursor-pointer py-2 px-4 rounded-md transition-colors duration-300 hover:bg-[rgba(255,255,255,0.05)] ${
                      library.added ? "bg-[rgba(255,255,255,0.05)]" : ""
                    }`}
                    onClick={() => handleAddToLibrary(library.name)}
                  >
                    {library.added && <span>✔</span>}
                    <span className="text-md font-bold">{library.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </>
    );
  }
);

export default AddLibraryModule;
