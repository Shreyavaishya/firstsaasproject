import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <SignIn appearance={{ variables: { colorPrimary: "#a855f7" } }} />
    </div>
  );
}