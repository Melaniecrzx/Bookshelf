export function Shelf() {
  return (
    <div className="mt-1.5">
      <div
        className="h-[2px] rounded-t-[1px]"
        style={{ background: "var(--shelf-top)" }}
      />
      <div
        className="h-[8px] rounded-b-[2px]"
        style={{
          background: "var(--shelf-body)",
          boxShadow: "0 3px 6px var(--shelf-shadow)",
        }}
      />
    </div>
  );
}
