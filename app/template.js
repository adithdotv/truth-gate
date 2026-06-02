"use client";

// Wraps every route and re-mounts on navigation, replaying a smooth
// entrance so the Landing → Submit → Verdict flow feels continuous.
// `flex flex-1 flex-col` preserves the layout chain so page <main> still fills.
export default function Template({ children }) {
  return (
    <div className="animate-page-in flex flex-1 flex-col">{children}</div>
  );
}
