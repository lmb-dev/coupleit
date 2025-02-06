export const runtime = "edge";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[var(--r1)]">
      <h1 className="text-4xl text-black merienda">
        404
      </h1>
      <div>
        <h2 className="text-black merienda">This page could not be found.</h2>
      </div>
    </div>
  );
}

