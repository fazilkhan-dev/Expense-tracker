import {
  LayoutDashboard,
  Wallet,
  PieChart,
  PiggyBank,
  Settings,
} from "lucide-react";
  
  import { motion } from "framer-motion";
  
  function Sidebar({
    activeSection,
    setActiveSection,
  }) {
    const menuItems = [
      {
        id: "dashboard",
        icon: <LayoutDashboard size={24} />,
        label: "Dashboard",
      },
  
      {
        id: "transactions",
        icon: <Wallet size={24} />,
        label: "Transactions",
      },
  
      {
        id: "analytics",
        icon: <PieChart size={24} />,
        label: "Analytics",
      },
      {
        id: "budget",
        icon: <PiggyBank size={24} />,
        label: "Budget",
      },
  
      {
        id: "settings",
        icon: <Settings size={24} />,
        label: "Settings",
      },
    ];
  
    return (
      <motion.div
        initial={{
          x: -80,
          opacity: 0,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        className="sidebar"
      >
        <div className="sidebar-logo">
          <h2>ET</h2>
        </div>
  
        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{
                scale: 1.08,
              }}
              onClick={() =>
                setActiveSection(item.id)
              }
              className={`sidebar-item ${
                activeSection === item.id
                  ? "active-sidebar"
                  : ""
              }`}
            >
              {item.icon}
  
              <span>{item.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }
  
  export default Sidebar;