import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <SignUp appearance={{ variables: { colorPrimary: "#a855f7" } }} />
    </div>
  );
}