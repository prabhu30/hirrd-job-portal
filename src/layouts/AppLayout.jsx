import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen container px-12">
        <Header />
        <Outlet />
      </main>
      <div className="text-center pb-6 mt-8">
        Made with 🔥 by Prabhu Kalyan Korivi
      </div>
    </div>
  );
};

export default AppLayout;
