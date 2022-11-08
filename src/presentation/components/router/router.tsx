import React, { ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, SignUp } from "@/presentation/pages";

type Props = {
  MakeLogin: React.FC;
};

const Router: React.FC<Props> = ({ MakeLogin }: Props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<MakeLogin />} />
      </Routes>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
