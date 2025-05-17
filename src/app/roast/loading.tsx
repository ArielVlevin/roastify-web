// app/loading.tsx
export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
    </div>
  );
}
