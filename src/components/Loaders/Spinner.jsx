export default function Spinner({ className = "" }) {
    return (
      <div className={`inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-orange-500 border-r-transparent ${className}`}>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }