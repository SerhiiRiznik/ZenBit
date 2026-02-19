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
import { login } from "../../../store/models/auth/auth.thunk";
import { STRICT_EMAIL_PATTERN } from "../../../utils/validation/email";

export function LoginPage() {
  const dispatch = useAppDispatch();
  const { status, error, token } = useAppSelector(
    (state) => state.authorization,
  );
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotResult, setForgotResult] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    mode: "onBlur",
    defaultValues: {
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

    if (
      normalizedMessage.includes("invalid email or password") ||
      normalizedMessage.includes("invalid credentials") ||
      normalizedMessage.includes("unauthorized")
    ) {
      setError("password", { type: "server", message: error });
      setCommonAuthError(null);
      return;
    }

    setCommonAuthError(error);
  }, [status, error, setError]);

  const onSubmit = handleSubmit((values) => {
    setCommonAuthError(null);
    clearErrors(["email", "password"]);
    dispatch(login(values));
  });

  const openForgotModal = () => {
    setIsForgotModalOpen(true);
    setForgotEmail("");
    setForgotError("");
    setForgotResult("");
  };

  const closeForgotModal = () => {
    setIsForgotModalOpen(false);
  };

  const submitForgotPassword = () => {
    const trimmedEmail = forgotEmail.trim();
    const isValidEmail = STRICT_EMAIL_PATTERN.test(trimmedEmail);

    if (!trimmedEmail) {
      setForgotError("Please enter your email");
      setForgotResult("");
      return;
    }

    if (!isValidEmail) {
      setForgotError("Please enter a valid email");
      setForgotResult("");
      return;
    }

    setForgotError("");
    setForgotResult("Email was not sent due to technical issues.");
  };

  return (
    <main className="auth-page">
      <SiteHeader hideGuestActions />

      <div className="login-layout">
        <section className="login-hero" aria-hidden="true" />

        <section className="login-panel">
          <div className="login-panel-inner">
            <h1>Login</h1>

            <form onSubmit={onSubmit} className="login-visual-form">
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
                autoComplete="current-password"
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

              <p className="forgot-row">
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    openForgotModal();
                  }}
                >
                  Forgot password?
                </a>
              </p>

              <button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <p className="signup-row">
              Don&apos;t have account? <Link to="/register">Sign Up</Link>
            </p>

            {status === "succeeded" && token && (
              <p className="success">Logged in successfully.</p>
            )}
            {status === "failed" && commonAuthError && (
              <p className="error">{commonAuthError}</p>
            )}
          </div>
        </section>
      </div>

      {isForgotModalOpen && (
        <div
          className="forgot-modal-backdrop"
          onClick={closeForgotModal}
          role="presentation"
        >
          <section
            className="forgot-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-password-title"
          >
            <h2 id="forgot-password-title">Forgot password</h2>

            <FormInput
              id="forgot-email-input"
              label="Enter your email"
              type="email"
              value={forgotEmail}
              onChange={(event) => {
                setForgotEmail(event.target.value);
                if (forgotError) {
                  setForgotError("");
                }
              }}
              placeholder="Email"
              autoComplete="email"
              error={forgotError}
            />

            {forgotResult && (
              <p className="forgot-modal-result">{forgotResult}</p>
            )}

            <div className="forgot-modal-actions">
              <button type="button" onClick={submitForgotPassword}>
                Send
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
