import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const verifyEmail = useAuthStore((state) => state.verifyEmail);

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const [redirectMessage, setRedirectMessage] = useState("");

  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const type = searchParams.get("type"); // "activation", "signup", "reset"

  useEffect(() => {
    if (!token || !email || !type || type === "reset") {
      setStatus("error");
      setMessage("Invalid verification link");
      toast.error("Invalid or unsupported verification request.");

      setTimeout(() => navigate("/login"), 5000);
      return;
    }

    verifyEmail(token, email, type)
      .then((res) => {
        if (res?.success) {
          setStatus("success");
          setMessage("Email verified successfully!");
          toast.success("Email verified!");

          setRedirectMessage("Redirecting to login...");
          setTimeout(() => navigate("/login"), 3000);
        } else if (res?.alreadyVerified) {
          setStatus("success");
          setMessage("Email already verified");
          toast.success("Already verified.");
          
          setRedirectMessage("Taking you to login...");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setStatus("error");
          setMessage("Verification failed");
          toast.error(res?.message || "Verification failed.");

          setRedirectMessage(
            type === "activation"
              ? "Redirecting to login to request new verification"
              : "Redirecting to signup to try again"
          );
          setTimeout(() => navigate(type === "activation" ? "/login" : "/signup"), 5000);
        }
      })
      .catch((err) => {
        console.error("Verification Error:", err);
        setStatus("error");
        setMessage("Verification error");
        toast.error("Error verifying email.");

        setRedirectMessage("Redirecting to login...");
        setTimeout(() => navigate("/login"), 5000);
      });
  }, [token, email, type, verifyEmail, navigate]);

  const getIcon = () => {
    if (status === "loading") return (
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-blue-900/30 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-400 border-t-transparent animate-spin"></div>
      </div>
    );
    if (status === "success") return (
      <div className="animate-bounce-in">
        <CheckCircle className="w-16 h-16 text-green-500" />
      </div>
    );
    return <XCircle className="w-16 h-16 text-red-500 animate-pulse" />;
  };

  // Generate random stars for background
  const stars = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`
            }}
          />
        ))}
      </div>

      <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 shadow-xl rounded-xl p-6 md:p-8 max-w-md w-full text-center space-y-6 z-10">
        <div className="flex justify-center">{getIcon()}</div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-white">
            {message}
          </h1>

          {status === "loading" && (
            <p className="text-gray-400 text-sm">
              Validating your email verification token...
            </p>
          )}

          {status === "error" && (
            <p className="text-gray-400 text-sm">
              This link is invalid or expired. Verification links are time-limited.
              <br className="hidden sm:block" />
              Please go to{" "}
              <span className="text-blue-400 font-medium">
                {type === "activation" ? "login" : "signup"}
              </span>{" "}
              to request a new verification email.
            </p>
          )}

          {status === "success" && (
            <p className="text-gray-400 text-sm">
              Your email has been successfully verified.
              <br className="hidden sm:block" />
              You can now access all features.
            </p>
          )}
        </div>

        {redirectMessage && (
          <div className="pt-2 border-t border-gray-700">
            <p className="text-gray-500 text-sm animate-pulse">
              {redirectMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;