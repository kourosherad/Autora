import { cookies } from "next/headers";
import type { Locale } from "./format";

const en = {
  brand: "Autora", tagline: "Smart vehicle maintenance.", hero: "Never miss your next service.",
  heroBody: "Track your vehicle's maintenance, mileage, service history, expenses, and upcoming reminders in one calm, reliable place.",
  getStarted: "Get started", signIn: "Sign in", signOut: "Sign out", register: "Create account", email: "Email", password: "Password", name: "Name",
  home: "Home", garage: "Garage", maintenance: "Maintenance", history: "History", profile: "Profile", reminders: "Reminders", expenses: "Expenses",
  welcome: "Good to see you", overview: "Your maintenance overview", urgent: "Needs attention", allClear: "Everything is on track", noVehicles: "You haven't added a vehicle yet.", addFirstVehicle: "Add your first vehicle",
  addVehicle: "Add vehicle", vehicleName: "Vehicle name", make: "Make", model: "Model", year: "Year", odometer: "Current odometer", optionalDetails: "Optional details", plate: "Plate number", vin: "VIN", useTemplate: "Add a recommended starter schedule", saveVehicle: "Save vehicle",
  health: "Maintenance health", healthy: "Healthy", dueSoon: "Due soon", due: "Due", overdue: "Overdue", upcoming: "Upcoming maintenance", recent: "Recent service", spending: "Spending", thisMonth: "This month", thisYear: "This year", lifetime: "Lifetime",
  updateMileage: "Update mileage", newMileage: "New odometer", saveMileage: "Save mileage", mileageWarning: "Mileage cannot be lower than the current reading.", km: "km", days: "days", remaining: "remaining", pastDue: "past due",
  schedules: "Maintenance schedules", addMaintenance: "Add maintenance", noMaintenance: "No maintenance schedules yet.", category: "Category", intervalKm: "Distance interval (km)", intervalDays: "Time interval (days)", lastDate: "Last service date", lastOdometer: "Last service odometer", notes: "Notes", saveSchedule: "Save schedule", completeService: "Record service", disable: "Disable", enable: "Enable", delete: "Delete",
  recordService: "Record completed service", serviceDate: "Service date", cost: "Cost", provider: "Service provider", saveService: "Save service", noHistory: "No service history recorded yet.", addExpense: "Add expense", noExpenses: "No expenses recorded yet.", amount: "Amount", description: "Description", date: "Date", saveExpense: "Save expense",
  language: "Language", timezone: "Timezone", appearance: "Appearance", system: "System", light: "Light", dark: "Dark", saveProfile: "Save preferences", settings: "Settings",
  howItWorks: "Maintenance, made simple", stepOne: "Add your vehicle", stepTwo: "Set the schedule", stepThree: "Drive with confidence", featureHistory: "A service history you can trust", featureReminders: "Timely, useful reminders", featureGarage: "Every vehicle, one garage", privacy: "Private by design", ctaTitle: "Your car already has a schedule. Let Autora remember it.",
  viewVehicle: "View vehicle", back: "Back", noReminders: "No active reminders.", starterDisclaimer: "Suggested intervals are editable starting points, not manufacturer-certified advice.",
  invalidCredentials: "Email or password is incorrect.", accountExists: "An account with this email already exists.", formError: "Please review the highlighted information.", created: "Saved successfully.",
} as const;

const fa: Record<keyof typeof en, string> = {
  brand: "اتورا", tagline: "مدیریت هوشمند نگهداری خودرو.", hero: "سرویس بعدی را هرگز فراموش نکنید.",
  heroBody: "سرویس‌ها، کارکرد، تاریخچه، هزینه‌ها و یادآوری‌های خودروی خود را در یک فضای آرام و قابل اعتماد مدیریت کنید.",
  getStarted: "شروع کنید", signIn: "ورود", signOut: "خروج", register: "ساخت حساب", email: "ایمیل", password: "رمز عبور", name: "نام",
  home: "خانه", garage: "گاراژ", maintenance: "نگهداری", history: "تاریخچه", profile: "پروفایل", reminders: "یادآوری‌ها", expenses: "هزینه‌ها",
  welcome: "خوش آمدید", overview: "نمای کلی نگهداری", urgent: "نیازمند توجه", allClear: "همه‌چیز مرتب است", noVehicles: "هنوز خودرویی اضافه نکرده‌اید.", addFirstVehicle: "افزودن اولین خودرو",
  addVehicle: "افزودن خودرو", vehicleName: "نام خودرو", make: "سازنده", model: "مدل", year: "سال", odometer: "کارکرد فعلی", optionalDetails: "جزئیات اختیاری", plate: "شماره پلاک", vin: "شماره شاسی", useTemplate: "افزودن برنامه پیشنهادی اولیه", saveVehicle: "ذخیره خودرو",
  health: "سلامت نگهداری", healthy: "سالم", dueSoon: "نزدیک سرویس", due: "موعد سرویس", overdue: "عقب‌افتاده", upcoming: "سرویس‌های پیش رو", recent: "آخرین سرویس‌ها", spending: "هزینه‌ها", thisMonth: "این ماه", thisYear: "امسال", lifetime: "کل",
  updateMileage: "ثبت کارکرد", newMileage: "کارکرد جدید", saveMileage: "ذخیره کارکرد", mileageWarning: "کارکرد جدید نمی‌تواند از مقدار فعلی کمتر باشد.", km: "کیلومتر", days: "روز", remaining: "باقی‌مانده", pastDue: "گذشته از موعد",
  schedules: "برنامه‌های نگهداری", addMaintenance: "افزودن سرویس", noMaintenance: "هنوز برنامه‌ای ثبت نشده است.", category: "دسته‌بندی", intervalKm: "فاصله کارکرد (کیلومتر)", intervalDays: "فاصله زمانی (روز)", lastDate: "تاریخ آخرین سرویس", lastOdometer: "کارکرد آخرین سرویس", notes: "یادداشت", saveSchedule: "ذخیره برنامه", completeService: "ثبت انجام سرویس", disable: "غیرفعال", enable: "فعال", delete: "حذف",
  recordService: "ثبت سرویس انجام‌شده", serviceDate: "تاریخ سرویس", cost: "هزینه", provider: "مرکز سرویس", saveService: "ذخیره سرویس", noHistory: "هنوز سابقه سرویسی ثبت نشده است.", addExpense: "افزودن هزینه", noExpenses: "هنوز هزینه‌ای ثبت نشده است.", amount: "مبلغ", description: "توضیحات", date: "تاریخ", saveExpense: "ذخیره هزینه",
  language: "زبان", timezone: "منطقه زمانی", appearance: "ظاهر", system: "سیستم", light: "روشن", dark: "تیره", saveProfile: "ذخیره تنظیمات", settings: "تنظیمات",
  howItWorks: "نگهداری، ساده و روشن", stepOne: "خودرو را اضافه کنید", stepTwo: "برنامه سرویس را بسازید", stepThree: "با خیال آسوده رانندگی کنید", featureHistory: "تاریخچه‌ای قابل اعتماد", featureReminders: "یادآوری‌های به‌موقع", featureGarage: "همه خودروها در یک گاراژ", privacy: "حریم خصوصی از پایه", ctaTitle: "خودروی شما برنامه دارد؛ به اتورا بسپارید تا آن را به خاطر بسپارد.",
  viewVehicle: "مشاهده خودرو", back: "بازگشت", noReminders: "یادآوری فعالی ندارید.", starterDisclaimer: "فواصل پیشنهادی قابل ویرایش‌اند و جایگزین توصیه رسمی سازنده نیستند.",
  invalidCredentials: "ایمیل یا رمز عبور نادرست است.", accountExists: "حسابی با این ایمیل وجود دارد.", formError: "اطلاعات واردشده را بررسی کنید.", created: "با موفقیت ذخیره شد.",
};

export const dictionaries = { en, fa };
export type Dictionary = typeof en;

export async function getPublicLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return cookieStore.get("autora-locale")?.value === "fa" ? "fa" : "en";
}

export async function getPublicTheme(): Promise<"system" | "light" | "dark"> {
  const cookieStore = await cookies();
  const value = cookieStore.get("autora-theme")?.value;
  return value === "light" || value === "dark" ? value : "system";
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] as Dictionary;
}
