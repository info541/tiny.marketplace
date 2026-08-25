export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-12 md:px-8" aria-hidden>
      <div className="h-3 w-24 bg-mist" />
      <div className="mt-3 h-10 w-48 bg-mist sm:h-12" />
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="h-24 bg-mist" />
        <div className="h-24 bg-mist" />
        <div className="h-24 bg-mist" />
      </div>
    </div>
  );
}
