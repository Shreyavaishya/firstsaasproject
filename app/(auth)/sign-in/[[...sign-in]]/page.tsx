import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes"; // 🌟 Import the dark layout baseline

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
      
      {/* Your Custom Silver Aura Frame */}
      <div className="p-0.5 rounded-2xl bg-linear-to-r from-neutral-800 via-slate-400 to-neutral-800 shadow-2xl relative group">
        
        {/* Soft underlying aura blur shadow background */}
        <div className="absolute -inset-1 bg-slate-400/20 rounded-2xl blur-xl opacity-75 pointer-events-none"></div>
        
        {/* The Card Container */}
        <div className="card bg-neutral-900 rounded-2xl overflow-hidden relative z-10">
          <SignIn 
            appearance={{
              baseTheme: dark, // 🚀 Forces Clerk to become completely dark mode natively!
              elements: {
                card: "bg-neutral-900 shadow-none", // Matches your exact panel color
                navbar: "hidden",
                footer: "bg-neutral-900/50",
              },
            }}
          />
        </div>
        
      </div>
    </div>
  );
}