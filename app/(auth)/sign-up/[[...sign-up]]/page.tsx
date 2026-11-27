import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4 [color-scheme:light]">
      <SignUp
        appearance={{
          variables: { colorPrimary: "#6a4df0", colorText: "#111118", borderRadius: "0.5rem" },
          elements: { card: "border border-line shadow-none" },
        }}
      />
    </div>
  );
}
