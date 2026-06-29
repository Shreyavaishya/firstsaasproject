// app/dashboard/page.tsx
import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome to your Dashboard!</h1>
        {/* Removed afterSignOutUrl - Clerk handles this automatically via your .env or dashboard settings now */}
        <UserButton />
      </div>
      <p>Your beautiful SaaS content goes here.</p>
    </div>
  );
}