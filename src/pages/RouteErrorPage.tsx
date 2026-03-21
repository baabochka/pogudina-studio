import { isRouteErrorResponse, useRouteError } from "react-router-dom";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Container } from "../components/ui/Container";
import { getButtonClassName } from "../components/ui/buttonClassName";

type ErrorFallbackProps = {
  description: string;
  title: string;
};

function getErrorCopy(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return {
      title: `${error.status} ${error.statusText}`,
      description:
        typeof error.data === "string"
          ? error.data
          : "Something went wrong while loading this page.",
    };
  }

  if (error instanceof Error) {
    return {
      title: "Something went wrong",
      description: error.message || "An unexpected error occurred.",
    };
  }

  return {
    title: "Something went wrong",
    description: "An unexpected error occurred.",
  };
}

export function ErrorFallback({ title, description }: ErrorFallbackProps) {
  const homeHref = import.meta.env.BASE_URL || "/";

  return (
    <main className="flex min-h-screen items-center bg-background py-12 text-foreground">
      <Container>
        <Card className="mx-auto max-w-2xl rounded-[var(--radius-2xl)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            App Error
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={homeHref}
              className={getButtonClassName()}
            >
              Go home
            </a>
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
            >
              Reload page
            </Button>
          </div>
        </Card>
      </Container>
    </main>
  );
}

export function RouteErrorPage() {
  const error = useRouteError();
  const { title, description } = getErrorCopy(error);

  return <ErrorFallback title={title} description={description} />;
}
