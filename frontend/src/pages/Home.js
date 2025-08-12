"use client";

import { LoginModal } from "./Login";
import { PublicScheduleModal } from "./PublicSchedule";
import { DetailsModal } from "./Details";
import { getAppointmentColorForStatus } from "../components/GetAppointmentColorForStatus/GetAppointmentColorForStatus";
import { Spinner } from "../components/Spinner/Spinner";
import { AdminPage } from "./Admin";
import { SuccessModal } from "./Success";
import { Toast } from "../components/Toast/Toast";
import { generateTimeSlots } from "../components/GenerateTimeSlots/GenerateTimeSlots";
import { formatPhoneNumber } from "../components/FormatPhoneNumber/FormatPhoneNumber";
import { CleanPhoneNumberForApi } from "../components/CleanPhoneNumberForApi/CleanPhoneNumberForApi";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Calendar,
  Users,
  TrendingUp,
  BookOpen,
  CheckCircle,
  User as UserIcon,
  DollarSign,
  PieChart as PieChartIcon,
  Check,
  Lock,
  Unlock,
} from "lucide-react";

// =================================================================
//                        CONFIGURATION
// =================================================================
const API_URL = "https://akcent-crm-backend.onrender.com";
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz6acdIGTVsZD328JACl0H7DcbKVByoQKRXr4GfMdYaks_HU6isXojfNJ55E6XjbLDl/exec";
const WEBHOOK_URL = "https://api.akcent.online/webhook";
const RESCHEDULE_WEBHOOK_URL = "https://api.akcent.online/reschedule-webhook";

// =================================================================
//                        DEMO DATA & CONSTANTS
// =================================================================
const initialUsers = [
  // Администраторы и РОПы
  {
    id: "1",
    username: "admin",
    password: "Akcent2026",
    role: "admin",
    name: "Admin",
  },
  {
    id: "2",
    username: "fariza",
    password: "password123",
    role: "rop",
    name: "Фариза",
  },
  {
    id: "3",
    username: "ayana",
    password: "password123",
    role: "rop",
    name: "Аяна",
  },
  {
    id: "4",
    username: "aziza",
    password: "password123",
    role: "rop",
    name: "Азиза",
  },
  {
    id: "5",
    username: "sayat",
    password: "password123",
    role: "rop",
    name: "Саят",
  },
  {
    id: "6",
    username: "rasul",
    password: "password123",
    role: "rop",
    name: "Расул",
  },
  {
    id: "7",
    username: "asylbek",
    password: "password123",
    role: "rop",
    name: "Асылбек",
  },
  {
    id: "8",
    username: "miko",
    password: "password123",
    role: "rop",
    name: "Мико",
  },
  {
    id: "9",
    username: "beksultan",
    password: "password123",
    role: "rop",
    name: "Бексұлтан",
  },
  {
    id: "28",
    username: "nurtileu",
    password: "password123",
    role: "rop",
    name: "Нұртілеу",
  },
  {
    id: "30",
    username: "kadir",
    password: "password123",
    role: "rop",
    name: "Қадір",
  },

  // Обновленный список учителей
  {
    id: "10",
    username: "asem",
    password: "password123",
    role: "teacher",
    name: "Асем",
    number: "",
  },
  {
    id: "11",
    username: "nazym",
    password: "password123",
    role: "teacher",
    name: "Назым",
    number: "87002834038",
  },
  {
    id: "12",
    username: "shugyla",
    password: "password123",
    role: "teacher",
    name: "Шуғыла",
    number: "87073157897",
  },
  {
    id: "13",
    username: "nazerke",
    password: "password123",
    role: "teacher",
    name: "Назерке",
    number: "87765260330",
  },
  {
    id: "14",
    username: "zamira",
    password: "password123",
    role: "teacher",
    name: "Замира",
    number: "",
  },
  {
    id: "15",
    username: "aray",
    password: "password123",
    role: "teacher",
    name: "Арай",
    number: "87777690191",
  },
  {
    id: "16",
    username: "aruzhan",
    password: "password123",
    role: "teacher",
    name: "Аружан",
    number: "87777690191",
  },
  {
    id: "17",
    username: "dilnaz",
    password: "password123",
    role: "teacher",
    name: "Дільназ",
    number: "87754752090",
  },
  {
    id: "18",
    username: "abdulla",
    password: "password123",
    role: "teacher",
    name: "Абдулла",
    number: "",
  },
  {
    id: "19",
    username: "mika",
    password: "password123",
    role: "teacher",
    name: "Мика",
    number: "87089670215",
  },
  {
    id: "20",
    username: "aknur",
    password: "password123",
    role: "teacher",
    name: "Ақнұр",
    number: "",
  },
  {
    id: "21",
    username: "tileuberdi",
    password: "password123",
    role: "teacher",
    name: "Тілеуберді",
    number: "87776922795",
  },
  {
    id: "22",
    username: "dinara",
    password: "password123",
    role: "teacher",
    name: "Динара",
    number: "87473821036",
  },
  {
    id: "23",
    username: "aiym",
    password: "password123",
    role: "teacher",
    name: "Айым",
    number: "87074340586",
  },
  {
    id: "24",
    username: "akgul",
    password: "password123",
    role: "teacher",
    name: "Ақгүл",
    number: "",
  },
  {
    id: "25",
    username: "zhuldyz",
    password: "password123",
    role: "teacher",
    name: "Жұлдыз",
    number: "",
  },
  {
    id: "26",
    username: "korlan",
    password: "password123",
    role: "teacher",
    name: "Қорлан",
    number: "87472552129",
  },
  {
    id: "27",
    username: "uki",
    password: "password123",
    role: "teacher",
    name: "Үкі",
    number: "87028199956",
  },
  {
    id: "29",
    username: "laura",
    password: "password123",
    role: "teacher",
    name: "Лаура",
    number: "",
  },
  {
    id: "31",
    username: "sultan",
    password: "password123",
    role: "teacher",
    name: "Султан",
    number: "87760010233",
  },
  {
    id: "32",
    username: "zhansaya",
    password: "password123",
    role: "teacher",
    name: "Жансая",
    number: "87772920274",
  },
  {
    id: "33",
    username: "balnur",
    password: "password123",
    role: "teacher",
    name: "Балнұр",
    number: "",
  },
];

const ALL_SOURCES = [
  "Facebook Tilda-Сайт",
  "Фейсбук Ватсап",
  "Facebook Ген-лид",
  "TikTok Target",
  "Инстаграм сторис",
  "Инстаграм био",
  "Телеграм",
  "Блогер",
  "База-лид",
  "Деңгей анықтау",
];

// =================================================================
//                        VIEW COMPONENTS
// =================================================================

const FormPage = ({
  onFormSubmit,
  ropList,
  showToast,
  onShowRating,
  onShowAdminLogin,
  onShowSchedule,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [phone, setPhone] = useState("");

  const location = useLocation();
  const [card, setCard] = useState(null);
  const [clientName, setClientName] = useState("");
  const [rop, setRop] = useState("");
  const [trialDate, setTrialDate] = useState("");
  const [trialTime, setTrialTime] = useState("");
  const [source, setSource] = useState("");
  const [comment, setComment] = useState("");

  const handlePhoneInputChange = (e) => {
    const rawValue = e.target.value;
    let digits = rawValue.replace(/\D/g, "");

    if (digits.length === 0) {
      setPhone("");
      return;
    }

    if (digits.startsWith("8")) {
      digits = "7" + digits.slice(1);
    }

    if (!digits.startsWith("7")) {
      digits = "7" + digits;
    }

    digits = digits.slice(0, 11);

    let formatted = `+${digits[0]}`;
    if (digits.length > 1) {
      formatted += ` (${digits.slice(1, 4)}`;
    }
    if (digits.length >= 5) {
      formatted += `) ${digits.slice(4, 7)}`;
    }
    if (digits.length >= 8) {
      formatted += `-${digits.slice(7, 9)}`;
    }
    if (digits.length >= 10) {
      formatted += `-${digits.slice(9, 11)}`;
    }

    setPhone(formatted);
  };

  function formatPhone(rawValue) {
    // Extract digits only
    let digits = rawValue.replace(/\D/g, "");

    // Return empty if no digits
    if (digits.length === 0) return "";

    // Normalize to start with 7
    if (digits.startsWith("8")) {
      digits = "7" + digits.slice(1);
    }
    if (!digits.startsWith("7")) {
      digits = "7" + digits;
    }

    // Limit to 11 digits
    digits = digits.slice(0, 11);

    // Format as +7 (XXX) XXX-XX-XX
    let formatted = `+${digits[0]}`;
    if (digits.length > 1) {
      formatted += ` (${digits.slice(1, 4)}`;
    }
    if (digits.length >= 5) {
      formatted += `) ${digits.slice(4, 7)}`;
    }
    if (digits.length >= 8) {
      formatted += `-${digits.slice(7, 9)}`;
    }
    if (digits.length >= 10) {
      formatted += `-${digits.slice(9, 11)}`;
    }

    setPhone(formatted);
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.phone = phone;
    data.clientName = clientName;
    data.rop = rop;
    data.comment = comment;
    data.sourse = source;

    if (!data.rop) {
      showToast("Пожалуйста, выберите РОП", "error");
      setIsSubmitting(false);
      return;
    }

    await onFormSubmit(data);

    setIsSubmitting(false);
    e.target.reset();
    setPhone("");
    setShowSuccess(true);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const clientNameParam = params.get("clientName");
    const phoneParam = params.get("phone");
    const ropParam = params.get("rop");
    const dateParam = params.get("trialDate");
    const timeParam = params.get("trialTime");
    const sourceParam = params.get("sourse");
    const commentParam = params.get("comment");

    if (clientNameParam) setClientName(clientNameParam);
    if (phoneParam) formatPhone(phoneParam);
    if (ropParam) setRop(ropParam);
    if (dateParam) setTrialDate(dateParam);
    if (timeParam) setTrialTime(timeParam);
    if (sourceParam) setSource(sourceParam);
    if (commentParam) setComment(commentParam);

    // Clean URL
    if ([...params.keys()].length > 0) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto pt-12 pb-20 px-6">
        <SuccessModal
          isVisible={showSuccess}
          onClose={() => setShowSuccess(false)}
        />
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Регистрация пробного урока
          </h1>
          <p className="text-gray-600 text-lg"></p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={onShowRating}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            <TrendingUp className="w-5 h-5" />
            Команданың нәтижесі
          </button>
        </div>
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 rounded-t-3xl">
            <h2 className="text-2xl font-bold text-white">Форма регистрации</h2>
            <p className="text-blue-100 mt-2">
              Заполните все поля для записи на урок
            </p>
          </div>
          <form onSubmit={handleFormSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label
                  htmlFor="client-name"
                  className="block text-sm font-bold text-gray-700 mb-3"
                >
                  Имя клиента
                </label>
                <input
                  type="text"
                  id="client-name"
                  name="clientName"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  autoComplete="off"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                  placeholder="Введите полное имя"
                />
              </div>
              <div>
                <label
                  htmlFor="phone-number"
                  className="block text-sm font-bold text-gray-700 mb-3"
                >
                  Номер телефона
                </label>
                <input
                  type="tel"
                  id="phone-number"
                  name="phone"
                  value={phone}
                  onChange={handlePhoneInputChange}
                  placeholder="+7 (___) ___-__-__"
                  required
                  autoComplete="off"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                />
              </div>
              <div>
                <label
                  htmlFor="rop-select"
                  className="block text-sm font-bold text-gray-700 mb-3"
                >
                  РОП
                </label>
                <select
                  id="rop-select"
                  name="rop"
                  required
                  defaultValue=""
                  value={rop}
                  onChange={(e) => setRop(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                >
                  <option value="" disabled>
                    Выберите РОП
                  </option>
                  {ropList.map((rop) => (
                    <option key={rop.id} value={rop.name}>
                      {rop.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="trial-date"
                  className="block text-sm font-bold text-gray-700 mb-3"
                >
                  Дата пробы
                </label>
                <input
                  type="date"
                  id="trial-date"
                  name="trialDate"
                  value={trialDate}
                  onChange={(e) => setTrialDate(e.target.value)}
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                />
              </div>
              <div>
                <label
                  htmlFor="trial-time"
                  className="block text-sm font-bold text-gray-700 mb-3"
                >
                  Время пробы
                </label>
                <input
                  type="time"
                  id="trial-time"
                  name="trialTime"
                  value={trialTime}
                  onChange={(e) => setTrialTime(e.target.value)}
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="source-select"
                  className="block text-sm font-bold text-gray-700 mb-3"
                >
                  Откуда пришел клиент?
                </label>
                <select
                  name="source"
                  id="source-select"
                  required
                  defaultValue=""
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                >
                  <option value="" disabled>
                    Выберите источник
                  </option>
                  {ALL_SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="comment"
                  className="block text-sm font-bold text-gray-700 mb-3"
                >
                  Комментарий
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  name="comment"
                  rows={4}
                  autoComplete="off"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none font-medium"
                  placeholder="Дополнительная информация о целях изучения..."
                />
              </div>
            </div>
            <div className="mt-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-bold py-5 px-8 rounded-2xl transition-all shadow-xl transform ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-2xl hover:-translate-y-0.5"
                } text-white`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Отправка заявки...
                  </div>
                ) : (
                  "Отправить заявку"
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button
            onClick={onShowSchedule}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 transition-all"
          >
            <Calendar className="w-5 h-5" />
            График учителей
          </button>
          <button
            onClick={onShowAdminLogin}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            <Users className="w-5 h-5" />
            Войти в систему
          </button>
        </div>
      </div>
    </div>
  );
};

const TeacherScheduleView = ({
  entries,
  teacherSchedule,
  currentUser,
  onOpenDetails,
  onToggleBlockSlot,
  blockedSlots,
  selectedDate,
  onDateChange,
}) => {
  const myAssignedEntries = useMemo(() => {
    const map = new Map();
    if (currentUser?.name) {
      entries
        .filter(
          (entry) =>
            entry.assignedTeacher === currentUser.name &&
            entry.trialDate === selectedDate
        )
        .forEach((e) => {
          map.set(e.assignedTime, e);
        });
    }
    return map;
  }, [entries, currentUser, selectedDate]);

  const blockedSlotsMap = useMemo(() => {
    const map = new Map();
    blockedSlots
      .filter((s) => s.teacher === currentUser.name && s.date === selectedDate)
      .forEach((slot) => map.set(slot.time, true));
    return map;
  }, [blockedSlots, currentUser, selectedDate]);

  if (!currentUser) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h3 className="font-bold text-xl text-gray-900 flex items-center gap-3">
              <Calendar className="w-6 h-6 text-green-600" />
              Мой график - {currentUser.name}
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all font-medium"
            />
          </div>
          <p className="text-gray-600 mt-2">
            Ваши назначенные уроки на{" "}
            {new Date(selectedDate + "T00:00:00").toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <div className="p-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b-2 border-gray-200 font-bold text-gray-900 text-left w-1/4">
                    Время
                  </th>
                  <th className="p-4 border-b-2 border-gray-200 font-bold text-gray-900 text-left w-3/4">
                    Статус/Ученик
                  </th>
                </tr>
              </thead>
              <tbody>
                {teacherSchedule.timeSlots.map((time) => {
                  const entry = myAssignedEntries.get(time);
                  const isBlocked = blockedSlotsMap.has(time);
                  return (
                    <tr
                      key={time}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 border-b border-gray-100 font-bold text-gray-700">
                        {time}
                      </td>
                      <td
                        className={`p-3 border-b border-gray-100 h-20 cursor-pointer`}
                        onClick={() =>
                          !entry &&
                          onToggleBlockSlot(
                            selectedDate,
                            currentUser.name,
                            currentUser.number,
                            time
                          )
                        }
                      >
                        {entry ? (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenDetails(entry);
                            }}
                            className={`rounded-2xl p-4 transition-all hover:scale-[1.02] shadow-lg transform ${getAppointmentColorForStatus(
                              entry.status
                            )}`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-bold text-lg">
                                  {entry.clientName}
                                </p>
                                <p className="text-sm opacity-90">
                                  {formatPhoneNumber(entry.phone)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm opacity-90 font-semibold">
                                  {entry.rop}
                                </p>
                                {entry.comment && (
                                  <p className="text-xs opacity-75 truncate max-w-[150px]">
                                    {entry.comment}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : isBlocked ? (
                          <div className="h-full bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500 font-semibold">
                            <Lock className="w-5 h-5 mr-2" /> Заблокировано
                          </div>
                        ) : (
                          <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-200 flex items-center justify-center text-blue-400 hover:border-blue-400 hover:bg-blue-100 font-semibold">
                            <Unlock className="w-5 h-5 mr-2" /> Свободно
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
const TeacherAnalyticsView = ({ entries, currentUser }) => {
  const [timeFilter, setTimeFilter] = useState("month"); // 'day', 'week', 'month'

  const filteredEntries = useMemo(() => {
    const now = new Date();
    const teacherEntries = entries.filter(
      (e) => e.assignedTeacher === currentUser.name
    );

    if (timeFilter === "day") {
      const today = now.toISOString().split("T")[0];
      return teacherEntries.filter((e) => e.trialDate === today);
    }
    if (timeFilter === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return teacherEntries.filter((e) => new Date(e.createdAt) > oneWeekAgo);
    }
    if (timeFilter === "month") {
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return teacherEntries.filter(
        (e) => new Date(e.createdAt) >= firstDayOfMonth
      );
    }
    return teacherEntries;
  }, [entries, currentUser, timeFilter]);

  const stats = useMemo(() => {
    const conducted = filteredEntries.filter((e) =>
      ["Проведен", "Оплата"].includes(e.status)
    ).length;
    const payments = filteredEntries.filter(
      (e) => e.status === "Оплата"
    ).length;
    const cash = filteredEntries
      .filter((e) => e.status === "Оплата")
      .reduce((sum, entry) => sum + (Number(entry.paymentAmount) || 0), 0);
    const conversion =
      conducted > 0 ? parseFloat(((payments / conducted) * 100).toFixed(1)) : 0;

    return { conducted, payments, cash, conversion };
  }, [filteredEntries]);

  const StatCard = ({ title, value, icon, gradient }) => (
    <div className={`rounded-3xl p-6 text-white shadow-2xl ${gradient}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="opacity-80 text-lg font-semibold uppercase tracking-wide">
            {title}
          </p>
          <p className="text-5xl font-black mt-2">{value}</p>
        </div>
        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-start gap-2 bg-gray-100 p-2 rounded-2xl">
        <button
          onClick={() => setTimeFilter("day")}
          className={`px-4 py-2 rounded-xl font-semibold ${
            timeFilter === "day"
              ? "bg-white text-blue-600 shadow-md"
              : "text-gray-500"
          }`}
        >
          День
        </button>
        <button
          onClick={() => setTimeFilter("week")}
          className={`px-4 py-2 rounded-xl font-semibold ${
            timeFilter === "week"
              ? "bg-white text-blue-600 shadow-md"
              : "text-gray-500"
          }`}
        >
          Неделя
        </button>
        <button
          onClick={() => setTimeFilter("month")}
          className={`px-4 py-2 rounded-xl font-semibold ${
            timeFilter === "month"
              ? "bg-white text-blue-600 shadow-md"
              : "text-gray-500"
          }`}
        >
          Месяц
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Проведено уроков"
          value={stats.conducted}
          icon={<Check size={40} className="text-white" />}
          gradient="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          title="Оплаты"
          value={stats.payments}
          icon={<CheckCircle size={40} className="text-white" />}
          gradient="bg-gradient-to-r from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Конверсия"
          value={`${stats.conversion}%`}
          icon={<TrendingUp size={40} className="text-white" />}
          gradient="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <StatCard
          title="Касса"
          value={`${stats.cash.toLocaleString("ru-RU")} ₸`}
          icon={<DollarSign size={40} className="text-white" />}
          gradient="bg-gradient-to-r from-green-500 to-green-600"
        />
      </div>
    </div>
  );
};
const TeacherDashboard = (props) => {
  const [teacherTab, setTeacherTab] = useState("schedule");

  return (
    <div className="space-y-6">
      <div className="flex gap-2 bg-gray-100 p-2 rounded-2xl flex-wrap">
        <button
          onClick={() => setTeacherTab("schedule")}
          className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
            teacherTab === "schedule"
              ? "bg-white text-blue-600 shadow-lg"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Мой График
        </button>
        <button
          onClick={() => setTeacherTab("analytics")}
          className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
            teacherTab === "analytics"
              ? "bg-white text-blue-600 shadow-lg"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Моя Аналитика
        </button>
      </div>
      {teacherTab === "schedule" && <TeacherScheduleView {...props} />}
      {teacherTab === "analytics" && <TeacherAnalyticsView {...props} />}
    </div>
  );
};

// =================================================================
//                        MAIN APP COMPONENT
// =================================================================

export default function App() {
  const [view, setView] = useState("form");
  const [adminTab, setAdminTab] = useState("distribution");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [plans, setPlans] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [users, setUsers] = useState(initialUsers);

  const ropList = useMemo(() => users.filter((u) => u.role === "rop"), [users]);
  const teacherList = useMemo(
    () => users.filter((u) => u.role === "teacher").map((t) => t.name),
    [users]
  );
  const teacherObjList = useMemo(
    () => users.filter((u) => u.role === "teacher"),
    [users]
  );
  const [teacherSchedule, setTeacherSchedule] = useState({
    teachers: teacherList,
    timeSlots: generateTimeSlots(),
    teacherObjList: teacherObjList,
  });
  useEffect(() => {
    setTeacherSchedule({
      teachers: teacherList,
      timeSlots: generateTimeSlots(),
      teacherObjList: teacherObjList,
    });
  }, [teacherList]);

  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "",
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isDetailsReadOnly, setIsDetailsReadOnly] = useState(false);

  const showToastMessage = useCallback((message, type = "success") => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), 4000);
  }, []);

  const fetchEntries = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/entries`);
      if (!response.ok) {
        throw new Error("Не удалось загрузить данные заявок с сервера");
      }
      const data = await response.json();
      const formattedData = data.map((entry) => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
      }));
      setEntries(formattedData);
    } catch (error) {
      console.error("Ошибка при загрузке заявок:", error);
      showToastMessage("Не удалось загрузить данные заявок", "error");
    }
  }, [showToastMessage]);

  const fetchBlockedSlots = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/blocked-slots`);
      if (!response.ok) {
        throw new Error("Не удалось загрузить заблокированные слоты");
      }
      const data = await response.json();
      setBlockedSlots(data);
    } catch (error) {
      console.error("Ошибка при загрузке заблокированных слотов:", error);
      showToastMessage("Не удалось загрузить данные о блокировках", "error");
    }
  }, [showToastMessage]);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      const loggedInUser = localStorage.getItem("currentUser");
      if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        setCurrentUser(user);
        setView("dashboard");
      }
      await Promise.all([fetchEntries(), fetchBlockedSlots()]);
      setIsLoading(false);
    };
    loadInitialData();
  }, [fetchEntries, fetchBlockedSlots]);

  useEffect(() => {
    if (window.location.hostname === "akcent-crm-frontend.onrender.com") {
      window.location.href = "https://akcent.online";
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      // Only fetch if user is logged in
      const interval = setInterval(() => {
        fetchEntries();
        fetchBlockedSlots();
      }, 15000); // every 15 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [currentUser, fetchEntries, fetchBlockedSlots]);

  const handleLogin = (username, password) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      const userToStore = { name: user.name, role: user.role };
      localStorage.setItem("currentUser", JSON.stringify(userToStore));
      setCurrentUser(userToStore);
      setShowLoginModal(false);
      showToastMessage(`С возвращением, ${user.name}!`, "success");
      setAdminTab(user.role === "teacher" ? "schedule" : "distribution");
      setView("dashboard");
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setView("form");
    showToastMessage("Вы вышли из системы.", "success");
  };

  const handleUnassignEntry = async (entryId) => {
    const entryToUnassign = entries.find((e) => e.id === entryId);
    if (!entryToUnassign) {
      showToastMessage("Не удалось найти заявку для отмены.", "error");
      return;
    }

    if (
      window.confirm(
        "Вы уверены, что хотите вернуть эту заявку в список ожидания?"
      )
    ) {
      // Use your existing update function to reset the assignment fields
      await handleUpdateEntry(entryId, {
        assignedTeacher: null,
        assignedTeacherPhone: "",
        assignedTime: null,
        status: "Ожидает", // Reset the status to its default
      });

      // Close the modal after the action is complete
      handleCloseDetails();
      showToastMessage("Заявка возвращена в список ожидания.", "success");
    }
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedEntry(null);
  };

  const handleOpenDetails = (entry, readOnly = false) => {
    if (!entry?.id) {
      showToastMessage("Ошибка: данные записи повреждены", "error");
      return;
    }

    setSelectedEntry(entry);
    let isModalReadOnly = readOnly;
    if (currentUser) {
      if (
        currentUser.role === "admin" ||
        (currentUser.role === "teacher" &&
          entry.assignedTeacher === currentUser.name)
      ) {
        isModalReadOnly = false;
      } else {
        isModalReadOnly = true;
      }
    } else {
      isModalReadOnly = true;
    }
    setIsDetailsReadOnly(isModalReadOnly);
    setShowDetailsModal(true);
  };

  const handleSavePlans = async (newPlans) => {
    setPlans(newPlans);
    showToastMessage("Планы сохранены (локально)", "success");
  };

  const handleWebhook = async (originalEntry, updatedEntry) => {
    const wasAssigned =
      originalEntry.assignedTeacher && originalEntry.assignedTime;
    const isNowAssigned =
      updatedEntry.assignedTeacher && updatedEntry.assignedTime;

    const cleanedPhone = CleanPhoneNumberForApi(originalEntry.phone);

    // Случай 1: Отмена или перенос назначенного урока
    if (
      wasAssigned &&
      (!isNowAssigned ||
        ["Перенос", "Клиент отказ", "Каспий отказ"].includes(
          updatedEntry.status
        ))
    ) {
      const lessonIdentifier = `${originalEntry.assignedTeacher}-${cleanedPhone}-${originalEntry.assignedTime}`;
      const payload = {
        lessonIdentifier,
        action: "cancel",
      };
      try {
        await fetch(RESCHEDULE_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        showToastMessage("Уведомление об отмене урока отправлено", "info");
      } catch (e) {
        console.error("Ошибка при отправке вебхука отмены:", e);
        showToastMessage("Ошибка отправки вебхука отмены", "error");
      }
    }

    if (!wasAssigned && isNowAssigned) {
      const payload = {
        teacherName: updatedEntry.assignedTeacher,
        phone: cleanedPhone,
        lessonTime: updatedEntry.assignedTime,
        teacherPhone: updatedEntry.assignedTeacherPhone || "",
        studentName: updatedEntry.clientName || "",
      };
      try {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        showToastMessage("Уведомление о новом уроке отправлено", "info");
      } catch (e) {
        console.error("Ошибка при отправке вебхука назначения:", e);
        showToastMessage("Ошибка отправки вебхука назначения", "error");
      }
    }

    // Случай 3: Перенос назначенного урока на другое время/дату
    if (
      wasAssigned &&
      isNowAssigned &&
      (originalEntry.assignedTime !== updatedEntry.assignedTime ||
        originalEntry.trialDate !== updatedEntry.trialDate)
    ) {
      const lessonIdentifier = `${originalEntry.assignedTeacher}-${cleanedPhone}-${originalEntry.assignedTime}`;
      const payload = {
        lessonIdentifier,
        action: "reschedule",
        newLessonTime: updatedEntry.assignedTime,
        studentName: updatedEntry.clientName || "",
        teacherPhone: updatedEntry.assignedTeacherPhone || "",
      };
      try {
        await fetch(RESCHEDULE_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        showToastMessage("Уведомление о переносе урока отправлено", "info");
      } catch (e) {
        console.error("Ошибка при отправке вебхука переноса:", e);
        showToastMessage("Ошибка отправки вебхука переноса", "error");
      }
    }
  };

  const handleUpdateEntry = async (entryId, dataToUpdate) => {
    const originalEntry = entries.find((e) => e.id === entryId);
    if (!originalEntry) {
      showToastMessage(
        "Не удалось найти исходную запись для обновления.",
        "error"
      );
      return;
    }

    // Оптимистичное обновление
    const updatedEntries = entries.map((entry) =>
      entry.id === entryId ? { ...entry, ...dataToUpdate } : entry
    );
    setEntries(updatedEntries);

    try {
      // 1. Обновляем основную базу данных
      const response = await fetch(`${API_URL}/api/entries/${entryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToUpdate),
      });

      if (!response.ok) {
        throw new Error("Ошибка при обновлении на сервере");
      }
      showToastMessage("Данные успешно обновлены!", "success");

      // 2. Логика вебхуков
      await handleWebhook(originalEntry, dataToUpdate);

      // 3. Обновляем Google Sheets
      const sheetUpdateData = {
        action: "update",
        phone: dataToUpdate.phone,
        status: dataToUpdate.status,
      };
      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(sheetUpdateData),
      }).catch((err) =>
        console.error("Ошибка при обновлении статуса в Google Sheets:", err)
      );
    } catch (error) {
      console.error("Ошибка при обновлении заявки:", error);
      showToastMessage("Не удалось обновить данные на сервере", "error");
      setEntries(entries); // Откат оптимистичного обновления
    }
  };

  const handleSaveDetails = async (entryId, dataToUpdate) => {
    await handleUpdateEntry(entryId, dataToUpdate);
  };

  const handleFormSubmit = async (data) => {
    const creationDate = new Date();
    const newEntryData = {
      ...data,
      createdAt: creationDate.toISOString(),
      status: "Ожидает",
    };

    try {
      const response = await fetch(`${API_URL}/api/entries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntryData),
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке на сервер");
      }

      const savedEntry = await response.json();

      setEntries((prev) => [
        { ...savedEntry, createdAt: new Date(savedEntry.createdAt) },
        ...prev,
      ]);

      showToastMessage("Заявка успешно сохранена на сервере!", "success");

      const sheetData = { ...newEntryData };

      fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(sheetData),
      }).catch((err) =>
        console.error("Ошибка при отправке в Google Sheets:", err)
      );
    } catch (error) {
      console.error("Ошибка при сохранении заявки:", error);
      showToastMessage("Не удалось сохранить заявку на сервере", "error");
    }
  };

  const handleToggleBlockSlot = async (date, teacher, time) => {
    const docId = `${date}_${teacher}_${time}`;
    const isBlocked = blockedSlots.some((slot) => slot.id === docId);

    const originalSlots = [...blockedSlots];
    if (isBlocked) {
      setBlockedSlots((prev) => prev.filter((slot) => slot.id !== docId));
    } else {
      setBlockedSlots((prev) => [...prev, { id: docId, date, teacher, time }]);
    }

    try {
      if (isBlocked) {
        const response = await fetch(`${API_URL}/api/blocked-slots/${docId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Ошибка при разблокировке");
        showToastMessage("Слот разблокирован", "success");
      } else {
        const response = await fetch(`${API_URL}/api/blocked-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: docId, date, teacher, time }),
        });
        if (!response.ok) throw new Error("Ошибка при блокировке");
        showToastMessage("Слот заблокирован", "success");
      }
    } catch (error) {
      console.error("Ошибка при изменении блокировки:", error);
      showToastMessage("Не удалось изменить статус слота", "error");
      setBlockedSlots(originalSlots);
    }
  };

  const handleSaveUser = (userData) => {
    if (userData.id) {
      setUsers(
        users.map((u) =>
          u.id === userData.id
            ? { ...u, ...userData, password: userData.password || u.password }
            : u
        )
      );
      showToastMessage("Пользователь обновлен!", "success");
    } else {
      const newUser = { ...userData, id: Date.now().toString() };
      setUsers([...users, newUser]);
      showToastMessage("Пользователь добавлен!", "success");
    }
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter((u) => u.id !== userId));
    showToastMessage("Пользователь удален!", "success");
  };

  const dashboardTabs = [
    { id: "distribution", label: "Распределение", adminOnly: true },
    { id: "trials-list", label: "Список пробных", adminOnly: false },
    { id: "leaderboard", label: "Рейтинг", adminOnly: false },
    { id: "conversion", label: "Конверсия", adminOnly: true },
    { id: "analytics", label: "Аналитика", adminOnly: true },
    { id: "users", label: "Пользователи", adminOnly: true },
    { id: "notifications", label: "Уведомления", adminOnly: true },
  ];

  const publicUser = { name: "Guest", role: "public" };

  const renderHeader = () => {
    if (!currentUser) return null;
    return (
      <header className="mb-8 p-4 md:p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">
              Панель управления
            </h2>
            <p className="text-gray-600 mt-2 font-medium">
              {currentUser.name} •{" "}
              {currentUser.role === "admin"
                ? "Администратор"
                : currentUser.role === "teacher"
                ? "Преподаватель"
                : "РОП"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl shadow-lg hover:from-red-600 hover:to-red-700 transition-all"
          >
            Выйти
          </button>
        </div>
      </header>
    );
  };

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex justify-center items-center">
          <Spinner />
        </div>
      );
    }

    switch (view) {
      case "form":
        return (
          <FormPage
            onFormSubmit={handleFormSubmit}
            ropList={ropList}
            showToast={showToastMessage}
            onShowRating={() => setView("rating")}
            onShowSchedule={() => setView("schedule")}
            onShowAdminLogin={() => setShowLoginModal(true)}
          />
        );
      case "rating":
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
            <AdminPage
              readOnly={true}
              tabs={dashboardTabs.filter((t) => !t.adminOnly)}
              activeTab="leaderboard"
              setActiveTab={() => {}}
              currentUser={publicUser}
              onBack={() => setView("form")}
              entries={entries}
              ropList={ropList}
              onOpenDetails={handleOpenDetails}
              teacherSchedule={teacherSchedule}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              plans={plans}
              onSavePlans={handleSavePlans}
              blockedSlots={blockedSlots}
              onToggleBlockSlot={handleToggleBlockSlot}
              onUpdateEntry={handleUpdateEntry}
            />
          </div>
        );
      case "schedule":
        return (
          <PublicScheduleModal
            onClose={() => setView("form")}
            initialDate={selectedDate}
            entries={entries}
            teacherSchedule={teacherSchedule}
            blockedSlots={blockedSlots}
            onOpenDetails={handleOpenDetails}
            onToggleBlockSlot={handleToggleBlockSlot} // Pass to PublicScheduleModal
          />
        );

      case "dashboard":
        if (!currentUser) {
          setView("form");
          return null;
        }
        const commonProps = {
          entries,
          blockedSlots,
          onToggleBlockSlot: handleToggleBlockSlot,
          ropList,
          teacherSchedule,
          showToast: showToastMessage,
          onOpenDetails: handleOpenDetails,
          selectedDate,
          onDateChange: setSelectedDate,
          plans,
          onSavePlans: handleSavePlans,
          currentUser,
          onUpdateEntry: handleUpdateEntry,
          users,
          onSaveUser: handleSaveUser,
          onDeleteUser: handleDeleteUser,
        };

        const dashboardContent = (() => {
          switch (currentUser.role) {
            case "admin":
              return (
                <AdminPage
                  {...commonProps}
                  tabs={dashboardTabs}
                  activeTab={adminTab}
                  setActiveTab={setAdminTab}
                />
              );
            case "teacher":
              return <TeacherDashboard {...commonProps} />;
            case "rop":
              return (
                <AdminPage
                  {...commonProps}
                  readOnly={true}
                  tabs={dashboardTabs.filter((t) => !t.adminOnly)}
                  activeTab={adminTab}
                  setActiveTab={setAdminTab}
                />
              );
            default:
              handleLogout();
              return null;
          }
        })();

        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
              {renderHeader()}
              {dashboardContent}
            </div>
          </div>
        );
      default:
        return (
          <FormPage
            onFormSubmit={handleFormSubmit}
            ropList={ropList}
            showToast={showToastMessage}
            onShowRating={() => setView("rating")}
            onShowSchedule={() => setView("schedule")}
            onShowAdminLogin={() => setShowLoginModal(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white font-sans">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
      />
      <LoginModal
        isVisible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
      <DetailsModal
        entry={selectedEntry}
        onClose={handleCloseDetails}
        onSave={handleSaveDetails}
        readOnly={isDetailsReadOnly}
        showToast={showToastMessage}
        onUnassign={handleUnassignEntry}
      />
      {renderView()}
    </div>
  );
}
