import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import Button from "~/components/Button";
import Card from "~/components/Card";
import { Heading, Text } from "~/components/Typography";

export const meta = () => [
  { title: "Called to Work | Auth" },
  { description: "Login to your account" },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated]);
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e2030] to-[#24273a]">
      <Card variant="gradient" className="max-w-md w-full">
        <div className="flex flex-col gap-8 items-center text-center">
          <div className="flex flex-col gap-2">
            <Heading level={1}>Welcome</Heading>
            <Text variant="muted">Login to continue your pilgrimage</Text>
          </div>
          <div className="w-full">
            {isLoading ? (
              <Button variant="auth" size="xl" loading>
                Signing you in...
              </Button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <Button variant="auth" size="xl" onClick={auth.signOut}>
                    Logout
                  </Button>
                ) : (
                  <Button variant="auth" size="xl" onClick={auth.signIn}>
                    Sign in
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </Card>
    </main>
  );
};

export default Auth;
