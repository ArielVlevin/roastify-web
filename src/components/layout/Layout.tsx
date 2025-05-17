import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

type Layoutrops = {
  children: React.ReactNode;
};

function Layout({ children }: Layoutrops) {
  return (
    <div className="flex flex-col  ">
      <Header />
      <div className="w-full min-h-screen bg-gradient-to-b from-bg-primary-light/20 to-bg-primary   dark:bg-gradient-to-b dark:from-muted-light dark:via-muted dark:to-background   ">
        <main className="container mx-auto w-full flex-1 px-4 py-6">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
