import { render } from "solid-js/web";
import { QueryClient, QueryClientProvider } from "@adeora/solid-query";

import "./index.css";
import App from "./App";

const client = new QueryClient();

render(
  () => (
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  ),
  document.getElementById("root") as HTMLElement
);
