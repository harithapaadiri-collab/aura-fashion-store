import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AnnouncementBar from "./components/layout/AnnouncementBar";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import { CartProvider } from "./context/CartContext";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import CatalogPage from "./pages/CatalogPage";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";

const queryClient = new QueryClient();

// Root layout
function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar />
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

// Routes
const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalog",
  component: CatalogPage,
  validateSearch: (search: Record<string, unknown>) => ({
    gender: typeof search.gender === "string" ? search.gender : undefined,
    type: typeof search.type === "string" ? search.type : undefined,
    brand: typeof search.brand === "string" ? search.brand : undefined,
    sale: typeof search.sale === "string" ? search.sale : undefined,
    view: typeof search.view === "string" ? search.view : undefined,
  }),
});

const womenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/women",
  component: () => <CatalogPage />,
});

const menRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/men",
  component: () => <CatalogPage />,
});

const kidsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/kids",
  component: () => <CatalogPage />,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
  component: ProductDetailPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  catalogRoute,
  womenRoute,
  menRoute,
  kidsRoute,
  productRoute,
  cartRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </QueryClientProvider>
  );
}
