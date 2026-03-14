import { isRouteErrorResponse, useRouteError } from "react-router-dom";

import { Container } from "../components/ui/Container";

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
    <div className="flex min-h-screen items-center bg-background py-12 text-foreground">
      <Container>
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-border bg-surface p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-10">
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
              className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
            >
              Go home
            </a>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
            >
              Reload page
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}

export function RouteErrorPage() {
  const error = useRouteError();
  const { title, description } = getErrorCopy(error);

  return <ErrorFallback title={title} description={description} />;
}
