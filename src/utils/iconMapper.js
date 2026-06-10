// src/utils/iconMapper.js
import {
  FiShoppingBag,
  FiUsers,
  FiMapPin,
  FiGrid,
  FiHome,
  FiSettings,
  FiLogOut,
  FiUser,
  FiStar,
  FiHeart,
  FiZap,
  FiRefreshCw,
  FiDownload,
  FiUpload,
  FiSave,
  FiEdit,
  FiTrash,
  FiPlus,
  FiMinus,
  FiCheck,
  FiX,
  FiSearch,
  FiArrowRight,
  FiArrowLeft,
  FiChevronDown,
  FiChevronUp,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiPackage,
  FiBox,
  FiLayers,
  FiBook,
  FiAward,
  FiCalendar,
  FiClock,
  FiPhone,
  FiGlobe,
  FiMonitor,
  FiCode,
  FiLayout,
} from "react-icons/fi";

// Import from react-icons/io
import { IoMdColorFill, IoIosColorPalette, IoIosSave, IoIosTrophy } from "react-icons/io";
import { FaArrowsRotate, FaGraduationCap } from "react-icons/fa6";
import { FaBookOpen, FaFolder  } from "react-icons/fa";
import { SlNotebook } from "react-icons/sl";


// Icon mapping object
const iconMap = {
  // Shopping & Stats Icons
  "FiShoppingBag": FiShoppingBag,
  "FiUsers": FiUsers,
  "FiMapPin": FiMapPin,

  // Navigation Icons
  "FiGrid": FiGrid,
  "FiHome": FiHome,
  "FiSettings": FiSettings,
  "FiLogOut": FiLogOut,
  "FiUser": FiUser,

  // Action Icons
  "FiStar": FiStar,
  "FiHeart": FiHeart,
  "FiZap": FiZap,
  "FiRefreshCw": FiRefreshCw,
  "FiDownload": FiDownload,
  "FiUpload": FiUpload,
  "FiSave": FiSave,
  "FiEdit": FiEdit,
  "FiTrash": FiTrash,
  "FiPlus": FiPlus,
  "FiMinus": FiMinus,
  "FiCheck": FiCheck,
  "FiX": FiX,
  "FiSearch": FiSearch,

  // Arrow Icons
  "FiArrowRight": FiArrowRight,
  "FiArrowLeft": FiArrowLeft,
  "FiChevronDown": FiChevronDown,
  "FiChevronUp": FiChevronUp,
  "FaArrowsRotate": FaArrowsRotate,

  // Form Icons
  "FiMail": FiMail,
  "FiLock": FiLock,
  "FiEye": FiEye,
  "FiEyeOff": FiEyeOff,

  // Design Icons
  "FiPackage": FiPackage,
  "FiBox": FiBox,
  "FiLayers": FiLayers,
  "FiLayout": FiLayout,
  "FiBook": FiBook,
  "FiAward": FiAward,

  // Media & Location
  "FiCalendar": FiCalendar,
  "FiClock": FiClock,
  "FiPhone": FiPhone,
  "FiGlobe": FiGlobe,
  "FiMonitor": FiMonitor,
  "FiCode": FiCode,

  // React Icons IO
  "IoMdColorFill": IoMdColorFill,
  "IoIosColorPalette": IoIosColorPalette,
  "IoIosSave": IoIosSave,
  "IoIosTrophy": IoIosTrophy,
  // React Icons FA
  "FaGraduationCap": FaGraduationCap,
  "FaArrowsRotate": FaArrowsRotate,
  "FaBookOpen": FaBookOpen,
   "FaFolder": FaFolder,
  // React Icons SI
  "SlNotebook": SlNotebook,


};

// Function to get icon component by name
export const getIcon = (iconName) => {
  if (!iconName) return null;
  return iconMap[iconName] || null;
};

// Predefined icon names
export const ICONS = {
  SHOPPING_BAG: "FiShoppingBag",
  USERS: "FiUsers",
  MAP_PIN: "FiMapPin",
  GRID: "FiGrid",
  HOME: "FiHome",
  SETTINGS: "FiSettings",
  LOGOUT: "FiLogOut",
  USER: "FiUser",
  STAR: "FiStar",
  HEART: "FiHeart",
  ZAP: "FiZap",
  REFRESH: "FiRefreshCw",
  DOWNLOAD: "FiDownload",
  UPLOAD: "FiUpload",
  SAVE: "FiSave",
  EDIT: "FiEdit",
  DELETE: "FiTrash",
  PLUS: "FiPlus",
  MINUS: "FiMinus",
  CHECK: "FiCheck",
  CLOSE: "FiX",
  SEARCH: "FiSearch",
  ARROW_RIGHT: "FiArrowRight",
  ARROW_LEFT: "FiArrowLeft",
  CHEVRON_DOWN: "FiChevronDown",
  CHEVRON_UP: "FiChevronUp",
  MAIL: "FiMail",
  LOCK: "FiLock",
  EYE: "FiEye",
  EYE_OFF: "FiEyeOff",
  PACKAGE: "FiPackage",
  BOX: "FiBox",
  LAYERS: "FiLayers",
  LAYOUT: "FiLayout",
  BOOK: "FiBook",
  COLOR_FILL: "IoMdColorFill",
  COLOR_PALETTE: "IoIosColorPalette",
  ARROWS_ROTATE: "FaArrowsRotate",
  SAVE: "IoIosSave",
  TROPHY: "IoIosTrophy",
  GRADUATION_CAP: "FaGraduationCap",
  BOOK_OPEN: "FaBookOpen",
  NOTEBOOK: "SlNotebook",
  FOLDER: "FaFolder",

};

export default { getIcon, ICONS };