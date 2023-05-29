import React from "react";
import clglogo from "../../../public/clgimage.jpg";
import { TextField, Button } from "@mui/material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { messages } from "../../constants/constants.js";
import axios from "axios";
import { URL } from "../../constants/config";
import useAuth from "../../hooks/useAuth";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import setHeaders from "../../interceptor/interceptor";
const schema = yup
  .object({
    EMAIL: yup.string().required(messages.username),
    PASSWORD: yup.string().required(messages.password),
  })
  .required();

function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const result = await axios.post(URL + "/login", data);
    const decoded = jwt_decode(result?.data?.token);
    setAuth(decoded);
    setHeaders(result?.data?.token);
    localStorage.setItem("token", result?.data?.token);
    const tokenExpiration = decoded.exp;
    const now = Math.floor(Date.now() / 1000);
    if (now >= tokenExpiration) {
      navigate("/login");
    }
    if (decoded.ROLE === "STUDENT") {
      // navigate(`/students/${decoded.EMAIL}`);
      navigate(`/details`);
    } else if (decoded.ROLE === "ADMIN") {
      navigate("/file-upload", { replace: true });
    } else if (decoded.ROLE === "STAFF") {
      navigate("/company-list", { replace: true });
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      <section className="h-screen">
        <div className="container h-full px-6 py-24">
          <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between xl:mr-8">
            <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
              <img src={clglogo} className="w-6/12 m-auto" alt="Phone image" />
            </div>
            <div className="md:w-8/12 lg:ml-6 lg:w-5/12">
              <div className="text-3xl font-bold text-center m-4 mb-6 text-blue-800">
                Placement Management System
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* <!-- Email input --> */}
                <div className="relative mb-6" data-te-input-wrapper-init>
                  <TextField
                    className="w-full"
                    id="EMAIL"
                    name="EMAIL"
                    label="Email"
                    placeholder="Enter your username"
                    variant="outlined"
                    {...register("EMAIL")}
                  />
                  <small className="text-red-500 bold text-xl">
                    {errors.EMAIL?.message}
                  </small>
                </div>

                {/* <!-- Password input --> */}
                <div className="relative mb-6" data-te-input-wrapper-init>
                  <TextField
                    className="w-full"
                    id="PASSWORD"
                    name="PASSWORD"
                    label="password"
                    placeholder="Enter your password"
                    type="password"
                    {...register("PASSWORD")}
                  />
                  <small className="text-red-500 bold text-xl">
                    {errors.PASSWORD?.message}
                  </small>
                </div>

                {/* <!-- Submit button --> */}
                <Button className="w-full" variant="contained" type="submit">
                  Sign In
                </Button>
                {/* <input type="submit" /> */}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default React.memo(Login);
