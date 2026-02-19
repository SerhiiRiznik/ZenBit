import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { SiteHeader } from "../../../components/SiteHeader/SiteHeader";
import { FormInput } from "../../../components/FormInput/FormInput";
import "../AuthPages.css";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../store/hooks/store.hooks";
import { resetAuthState } from "../../../store/models/auth/auth.slice";
import { registration } from "../../../store/models/auth/auth.thunk";
import { STRICT_EMAIL_PATTERN } from "../../../utils/validation/email";

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const { status, error, token } = useAppSelector(
    (state) => state.authorization,
  );

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<{ fullName: string; email: string; password: string }>({
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  const [commonAuthError, setCommonAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "failed" || !error) {
      setCommonAuthError(null);
      return;
    }

    const normalizedMessage = error.toLowerCase();

    if (
      normalizedMessage.includes("full") &&
      normalizedMessage.includes("name")
    ) {
      setError("fullName", { type: "server", message: error });
      setCommonAuthError(null);
      return;
    }

    if (normalizedMessage.includes("email")) {
      setError("email", { type: "server", message: error });
      setCommonAuthError(null);
      return;
    }

    if (normalizedMessage.includes("password")) {
      setError("password", { type: "server", message: error });
      setCommonAuthError(null);
      return;
    }

    setCommonAuthError(error);
  }, [status, error, setError]);

  const onSubmit = handleSubmit((values) => {
    setCommonAuthError(null);
    clearErrors(["fullName", "email", "password"]);
    dispatch(registration(values));
  });

  return (
    <main className="auth-page">
      <SiteHeader hideGuestActions />

      <div className="login-layout">
        <section className="login-hero" aria-hidden="true" />

        <section className="login-panel">
          <div className="login-panel-inner">
            <h1>Register</h1>

            <form onSubmit={onSubmit} className="login-visual-form">
              <FormInput
                label="Full Name"
                type="text"
                placeholder="Full name"
                autoComplete="name"
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Full name must contain at least 2 characters",
                  },
                  maxLength: {
                    value: 120,
                    message: "Full name must be less than 120 characters",
                  },
                  onChange: () => {
                    if (errors.fullName?.type === "server") {
                      clearErrors("fullName");
                    }
                  },
                })}
                error={errors.fullName?.message}
              />

              <FormInput
                label="Email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: STRICT_EMAIL_PATTERN,
                    message: "Please enter a valid email",
                  },
                  onChange: () => {
                    if (errors.email?.type === "server") {
                      clearErrors("email");
                    }
                  },
                })}
                error={errors.email?.message}
              />

              <FormInput
                label="Password"
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must contain at least 6 characters",
                  },
                  onChange: () => {
                    if (errors.password?.type === "server") {
                      clearErrors("password");
                    }
                  },
                })}
                error={errors.password?.message}
              />

              <button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Signing Up..." : "Sign Up"}
              </button>
            </form>

            <p className="signup-row">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>

            {status === "succeeded" && token && (
              <p className="success">Registered successfully.</p>
            )}
            {status === "failed" && commonAuthError && (
              <p className="error">{commonAuthError}</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
