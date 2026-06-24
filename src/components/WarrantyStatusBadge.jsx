const MAP = {
  Pending: 'bg-sun/15 text-[#9a7400] border-sun/30',
  Approved: 'bg-kamdhenu/15 text-kamdhenu border-kamdhenu/30',
  Rejected: 'bg-red-500/10 text-red-500 border-red-500/30',
  Expired: 'bg-cream/10 text-cream/50 border-line',
};

export default function WarrantyStatusBadge({ status }) {
  return (
    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${MAP[status] || MAP.Pending}`}>
      {status}
    </span>
  );
}
