import { calculateDate } from "../utils/calculateDate";
import {
  ChartPie,
  LayoutGrid,
  Users,
  CircleDollarSign,
  ContactRound,
  BellRing,
  Settings,
  History,
  UserCog,
  FileText,
  MonitorCog,
  BellDot,
  Wallet,
  ShieldAlert,
} from "lucide-react";

// sidebar navigation links
export const navigation = [
  {
    id: 1,
    icon: ChartPie,
    location: "Overview",
    link: "/",
  },
  {
    id: 2,
    icon: LayoutGrid,
    location: "Management",
    link: "/management",
  },
  {
    id: 3,
    icon: Users,
    location: "Team Members",
    link: "/team-members",
  },
  {
    id: 4,
    icon: CircleDollarSign,
    location: "Revenue",
    link: "/revenue",
  },
  {
    id: 5,
    icon: ContactRound,
    location: "Client & Message",
    link: "/clients",
  },
  {
    id: 6,
    icon: BellRing,
    location: "Notifications",
    link: "/notification",
  },
  {
    id: 7,
    icon: History,
    location: "Activity Log",
    link: "/activity-log",
  },
  {
    id: 8,
    icon: Settings,
    location: "Settings",
    link: "/setting",
  },
];

// withdrawl history - transfers data
export const transfers = [
  {
    id: 1,
    method: "bank",
    ammount: 87,
    date: calculateDate(2, "-"),
    number: 7487548748754,
  },
  {
    id: 2,
    method: "card",
    ammount: 120,
    date: calculateDate(5, "-"),
    number: 4532765412879632,
  },
  {
    id: 3,
    method: "bank",
    ammount: 340,
    date: calculateDate(7, "-"),
    number: 8547123698741,
  },
  {
    id: 4,
    method: "card",
    ammount: 59,
    date: calculateDate(1, "-"),
    number: 5298741236547896,
  },
  {
    id: 5,
    method: "card",
    ammount: 450,
    date: calculateDate(10, "-"),
    number: 9632587412587,
  },
  {
    id: 6,
    method: "card",
    ammount: 210,
    date: calculateDate(3, "-"),
    number: 4123987654123654,
  },
  {
    id: 7,
    method: "bank",
    ammount: 78,
    date: calculateDate(4, "-"),
    number: 7412589632147,
  },
  {
    id: 8,
    method: "card",
    ammount: 180,
    date: calculateDate(8, "-"),
    number: 5487123698741236,
  },
];

// setting page - sub routers
export const settingRouteMap = {
  "/setting": {
    title: "Settings",
    icon: Settings,
  },

  "/setting/profile-setting": {
    title: "Admin Setting",
    icon: UserCog,
  },

  "/setting/data-center": {
    title: "Data Center",
    icon: FileText,
  },

  "/setting/system": {
    title: "System",
    icon: MonitorCog,
  },

  "/setting/notification": {
    title: "Notification",
    icon: BellDot,
  },

  "/setting/asset-manager": {
    title: "Asset Manager",
    icon: Wallet,
  },

  "/setting/security": {
    title: "Security",
    icon: ShieldAlert,
  },
};