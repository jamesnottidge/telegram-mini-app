import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    WebApp.ready();
  }, []);

  return <div>Hello</div>;
}
