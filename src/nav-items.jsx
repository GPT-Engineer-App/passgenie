import { Ticket, CreditCard } from "lucide-react";
import Index from "./pages/Index.jsx";
import SavedPasses from "./pages/SavedPasses.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Google Wallet Pass Generator",
    to: "/",
    icon: <Ticket className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Saved Passes",
    to: "/saved-passes",
    icon: <CreditCard className="h-4 w-4" />,
    page: <SavedPasses />,
  },
];
