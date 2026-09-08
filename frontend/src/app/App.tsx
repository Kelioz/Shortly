import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntApp, ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import { HomePage } from "../pages/home/HomePage";
import "./styles.scss";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={ruRU}
        theme={{
          token: {
            colorPrimary: "#6755df",
            borderRadius: 10,
            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          },
        }}
      >
        <AntApp>
          <HomePage />
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
