"use client";

import { useState } from "react";
import { SignUpFlow } from "../type";
import { SignUpCard } from "./sign-up-card";
import { SignInCard } from "./sign-in-card";

export const AuthScreen = () => {
  const [state, setState] = useState<SignUpFlow>("signIn");
  return (
    <div className="h-full flex items-center justify-center bg-[#5C3B58]">
      <div className="md:h-auto md:w-[420px]">
        {state === "signIn" ? <SignInCard setState={setState}/> : <SignUpCard setState={setState}/>}
      </div>
    </div>
  );

}