import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-card border border-border rounded-lg shadow-sm",
            },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/auth-redirect"
        />
      </div>
    </div>
  );
};

export default SignInPage;
