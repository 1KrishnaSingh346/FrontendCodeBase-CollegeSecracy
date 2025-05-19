import { useState } from "react";
import { Loader2 } from "lucide-react";

const ButtonLoader = ({ text, onClick, type = "button", isLoading = false }) => {
  const [localLoading, setLocalLoading] = useState(false);

  const handleClick = async (event) => {
    if (!onClick) return; // ✅ Prevent errors if no onClick function is provided

    setLocalLoading(true);
    await onClick(event); // ✅ Pass event in case it's needed
    setLocalLoading(false);
  };

  return (
    <button
      type={type} // ✅ Support for form submissions
      onClick={type === "button" ? handleClick : undefined} // ✅ Use onClick only for buttons
      disabled={isLoading || localLoading}
      className="flex items-center justify-center px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
    >
      {(isLoading || localLoading) && <Loader2 className="animate-spin mr-2" size={18} />}
      {isLoading || localLoading ? "Processing..." : text}
    </button>
  );
};

export default ButtonLoader;
