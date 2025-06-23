import { useState, useEffect } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import {
  Package,
  Info,
  Calendar,
  Clock,
  X,
  Tag,
  DollarSign
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { FaTools, FaDownload } from "react-icons/fa";
import useAuthStore from "@/store/useAuthStore";
function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return isNaN(date)
    ? "Invalid Date"
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
}

const ITEMS_PER_PAGE = 3;

export default function TrackPlansAndTools({ user }) {
  const { getInvoiceDownloadLink } = useAuthStore(); 
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

useEffect(() => {
  const plans = (user?.counselingPlans || [])
    .filter((p) => typeof p.planId === "object" && p.planId !== null)
    .map((p) => ({
      ...p.planId,
      purchasedOn: p?.purchasedOn,
      expiryDate: p?.planId?.expiryDate,
      paymentId: p?.paymentId,        // <-- Add paymentId here
      type: "plan",
      uniqueKey: `${p.planId._id}-plan`
    }));

  const tools = (user?.premiumTools || [])
    .filter((t) => typeof t.planId === "object" && t.planId !== null)
    .map((t) => ({
      ...t.planId,
      purchasedOn: t?.purchasedOn,
      paymentId: t?.paymentId,        // <-- Add paymentId here
      type: "tool",
      uniqueKey: `${t.planId._id}-tool`
    }));

  const allItems = [...plans, ...tools].sort(
    (a, b) => new Date(b.purchasedOn) - new Date(a.purchasedOn)
  );

  setItems(allItems);
  setLoading(false);
}, [user]);


  const filteredItems =
    filter === "all" ? items : items.filter((item) => item.type === filter);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const currentItems = filteredItems.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const changeFilter = (type) => {
    setFilter(type);
    setPage(1);
  };

  return (
    <>
      <div className="mb-3 flex justify-center gap-2 text-sm">
        {["all", "plan", "tool"].map((type) => (
          <button
            key={type}
            className={`px-3 py-1 rounded-full border ${
              filter === type
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
            onClick={() => changeFilter(type)}
          >
            {type === "all" ? "All" : type === "plan" ? "Plans" : "Tools"}
          </button>
        ))}
      </div>

      <div className="max-h-[340px] overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-1">
                <div className="h-4 w-24 bg-gray-300 rounded" />
                <div className="h-3 w-36 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center p-6 text-sm text-gray-600 dark:text-gray-300">
            <div className="text-4xl mb-2">🛒</div>
            <p className="font-medium">No plans or tools purchased yet.</p>
            <p className="mt-1 text-xs">
              Start exploring and unlock premium benefits by purchasing a plan or tool.
            </p>
          </div>
        ) : (
          <VerticalTimeline layout="1-column-left">
            {currentItems.map((item) => (
              <VerticalTimelineElement
                key={item.uniqueKey}
                date={formatDate(item.purchasedOn)}
                icon={
                  item.type === "plan" ? (
                    <Package className="text-blue-600 h-4 w-4" />
                  ) : (
                    <FaTools className="text-purple-600 h-4 w-4" />
                  )
                }
                iconStyle={{
                  background: item.type === "plan" ? "#dbeafe" : "#ede9fe",
                  color: item.type === "plan" ? "#1e3a8a" : "#5b21b6"
                }}
                contentStyle={{
                  background: "var(--tw-bg)",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 5px rgba(0,0,0,0.1)"
                }}
                contentArrowStyle={{ borderRight: "7px solid #fff" }}
                onTimelineElementClick={() => setSelected(item)}
              >
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  {item.type === "tool"
                    ? "Lifetime Access"
                    : item.expiryDate
                    ? `Valid till ${formatDate(item.expiryDate)}`
                    : "Validity info not available"}
                </p>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-2 flex justify-center gap-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
            <button
              key={pg}
              onClick={() => setPage(pg)}
              className={`px-3 py-1 rounded-full ${
                page === pg
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              {pg}
            </button>
          ))}
        </div>
      )}

      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-h-[90vh] overflow-y-auto scrollbar-hide">
            {selected && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <Info className="text-blue-600 h-4 w-4" />
                    {selected.title}
                  </h2>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                  >
                    <X />
                  </button>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">
                  {selected?.description || "No description available."}
                </p>

                <div className="text-xs text-gray-600 dark:text-gray-400 mb-6 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <strong>Purchased:</strong>{" "}
                    {formatDate(selected.purchasedOn)}
                  </div>

                  {selected.type === "plan" && selected.expiryDate && (
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <strong>Expires:</strong>{" "}
                      {formatDate(selected.expiryDate)}
                    </div>
                  )}

                  {selected.type === "tool" && (
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <strong>Access:</strong> Lifetime
                    </div>
                  )}

                  {selected?.price && (
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} />
                      <strong>Price:</strong> ₹{selected.price}
                    </div>
                  )}

                  {selected?.sessions && (
                    <div className="flex items-center gap-2">
                      <Tag size={14} />
                      <strong>Sessions:</strong> {selected.sessions}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <FaTools size={12} />
                    <strong>Type:</strong>{" "}
                    {selected.type === "plan"
                      ? "Counselling Plan"
                      : "Premium Tool"}
                  </div>
                </div>
<a
  href={getInvoiceDownloadLink(selected.paymentId)}
  target="_blank"
  rel="noopener noreferrer"
  className="w-full"
>
  <button className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
    <FaDownload /> View Invoice
  </button>
</a>

              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
