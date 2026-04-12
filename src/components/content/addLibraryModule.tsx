"use client";
import React, { forwardRef } from "react";
import Loading from "react-loading";
import useMediaQuery from "~/hooks/use-media-query";

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
            className="absolute left-0 right-0 top-[40px] flex h-max w-full flex-col gap-3 rounded-md border-b border-l border-r border-[rgba(255,255,255,0.04)] bg-[rgba(24,24,24)] p-4 text-center"
            ref={ref}
          >
            <div className="absolute left-[50%] top-[-10px] h-0 w-0 -translate-x-1/2 transform border-b-[10px] border-l-[10px] border-r-[10px] border-b-[rgba(24,24,24)] border-l-transparent border-r-transparent" />
            {isLoadingLibraries ? (
              <div className="flex items-center justify-center">
                <Loading type="spin" color="#fff" height={30} width={30} />
              </div>
            ) : (
              libraries?.map((library: any, index: number) => (
                <div
                  key={index}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-md py-2 text-center transition-colors duration-300 hover:bg-[rgba(255,255,255,0.05)] ${
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
          <div className="fixed inset-0 z-40 flex h-screen w-screen items-center justify-center bg-[rgba(0,0,0,0.7)]">
            <div
              className="mt-[-40px] flex h-max w-max flex-col gap-3 rounded-md border border-[rgba(255,255,255,0.04)] bg-[rgba(24,24,24,0.95)] p-4 text-center"
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
                    className={`flex cursor-pointer items-center justify-center gap-3 rounded-md px-4 py-2 text-center transition-colors duration-300 hover:bg-[rgba(255,255,255,0.05)] ${
                      library.added ? "bg-[rgba(255,255,255,0.05)]" : ""
                    }`}
                    onClick={() => handleAddToLibrary(library.name)}
                  >
                    {library.added && <span>✔</span>}
                    <span className="text-md select-none font-bold">
                      {library.name}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </>
    );
  },
);

export default AddLibraryModule;
