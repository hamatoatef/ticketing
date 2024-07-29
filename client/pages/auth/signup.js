import { useForm } from "react-hook-form";
import Router from "next/router";
import useRequest from "../../hooks/useRequest";

export default function Signup() {
  const { register, handleSubmit } = useForm();
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    onSuccess: () => Router.push("/"),
  });

  async function onSubmit({ email, password }) {
    doRequest({ email, password });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1> Sign up</h1>
      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          className="form-control"
          id="email"
          {...register("email", { required: "This field is required" })}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          {...register("password", { required: "This field is required" })}
        />
      </div>
      {errors}
      <button type="submit" className="btn btn-primary">
        sign up
      </button>
    </form>
  );
}
