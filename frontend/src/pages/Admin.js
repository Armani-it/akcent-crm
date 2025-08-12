import {
  ArrowLeft,
  BookCopy,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronsDown,
  Clock,
  DollarSign,
  Edit,
  Filter,
  History,
  Lock,
  PieChartIcon,
  Plus,
  Search,
  Target,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { TeacherNotificationSender } from "../components/TeacherSendNotification/TeacherNotificationSender";
import { useEffect, useMemo, useState } from "react";
import { UserModal } from "./User";
import { formatPhoneNumber } from "../components/FormatPhoneNumber/FormatPhoneNumber";
import { PlanModal } from "./Plan";
import { StatCard } from "../components/StatCard/StatCard";
import { FunnelStatCard } from "../components/FunnelStatCard/FunnelStatCard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAppointmentColorForStatus } from "../components/GetAppointmentColorForStatus/GetAppointmentColorForStatus";

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

const getRankColor = (index) =>
  [
    "from-yellow-400 to-yellow-600",
    "from-gray-400 to-gray-600",
    "from-orange-400 to-orange-600",
  ][index] || "from-blue-400 to-blue-600";
const getRankIcon = (index) => ["👑", "🥈", "🥉"][index] || index + 1;

const UserManagementView = ({ users, onSaveUser, onDeleteUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState(null);

  const handleAddNew = () => {
    setCurrentUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setCurrentUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleSave = (userData) => {
    onSaveUser(userData);
    setIsModalOpen(false);
  };

  const handleDelete = (userId) => {
    // Replace with a custom modal in a real app
    const isConfirmed = window.confirm(
      "Вы уверены, что хотите удалить этого пользователя?"
    );
    if (isConfirmed) {
      onDeleteUser(userId);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Управление пользователями
        </h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all"
        >
          <Plus size={18} />
          Добавить пользователя
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 font-bold text-gray-600">Имя</th>
              <th className="p-4 font-bold text-gray-600">Логин</th>
              <th className="p-4 font-bold text-gray-600">Роль</th>
              <th className="p-4 font-bold text-gray-600 text-right">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-4 font-medium text-gray-900">{user.name}</td>
                <td className="p-4 text-gray-600">{user.username}</td>
                <td className="p-4 text-gray-600">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-700"
                        : user.role === "rop"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <UserModal
          user={currentUserToEdit}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const TrialsListView = ({
  entries,
  ropList,
  onOpenDetails,
  readOnly = false,
  onFilterBySource,
}) => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    rop: "",
    source: "",
    status: "",
    paymentType: "",
  });

  const sourceCounts = useMemo(() => {
    const counts = {};
    ALL_SOURCES.forEach((source) => {
      counts[source] = 0;
    });
    entries.forEach((entry) => {
      if (counts[entry.source] !== undefined) {
        counts[entry.source]++;
      }
    });
    return counts;
  }, [entries]);

  const [visibleCount, setVisibleCount] = useState(50);

  const filteredEntries = useMemo(() => {
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    return entries.filter((entry) => {
      // Prioritize the actual trial date for filtering, but fall back to creation date
      const entryDate = entry.trialDate
        ? new Date(entry.trialDate)
        : new Date(entry.createdAt);
      const dateMatch =
        (!start || entryDate >= start) && (!end || entryDate <= end);
      const sourceMatch = !filters.source || entry.source === filters.source;
      const ropMatch = !filters.rop || entry.rop === filters.rop;
      return dateMatch && sourceMatch && ropMatch;
    });
  }, [entries, filters]);

  // NEW: A separate memo to slice the visible entries
  const visibleEntries = useMemo(() => {
    return filteredEntries.slice(0, visibleCount);
  }, [filteredEntries, visibleCount]);

  // NEW: Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(50);
  }, [filters]);

  // NEW: Handler for the "Show More" button
  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 50);
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSourceButtonClick = (source) => {
    setFilters((prev) => ({ ...prev, source: source }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Ожидает: {
        bg: "bg-gradient-to-r from-yellow-400 to-orange-500",
        text: "text-white",
      },
      Назначен: {
        bg: "bg-gradient-to-r from-blue-400 to-blue-600",
        text: "text-white",
      },
      Проведен: {
        bg: "bg-gradient-to-r from-green-400 to-green-600",
        text: "text-white",
      },
      Оплата: {
        bg: "bg-gradient-to-r from-emerald-400 to-emerald-600",
        text: "text-white",
      },
      Перенос: {
        bg: "bg-gradient-to-r from-orange-400 to-orange-600",
        text: "text-white",
      },
      "Клиент отказ": {
        bg: "bg-gradient-to-r from-red-400 to-red-600",
        text: "text-white",
      },
      "Каспий отказ": {
        bg: "bg-gradient-to-r from-red-400 to-red-600",
        text: "text-white",
      },
    };
    const config = statusConfig[status] || statusConfig["Ожидает"];
    return `${config.bg} ${config.text}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="font-bold text-xl text-gray-900 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-blue-600" />
          Список пробных уроков
          <span className="ml-auto bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold px-4 py-2 rounded-full">
            {filteredEntries.length} из {entries.length}
          </span>
        </h3>
      </div>
      <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleSourceButtonClick("")}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
              !filters.source
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            Все ({entries.length})
          </button>
          {ALL_SOURCES.map((source) => (
            <button
              key={source}
              onClick={() => handleSourceButtonClick(source)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                filters.source === source
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
            >
              {source} ({sourceCounts[source]})
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Начало периода
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Конец периода
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              РОП
            </label>
            <select
              name="rop"
              value={filters.rop}
              onChange={handleFilterChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="">Все РОП</option>
              {ropList.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Статус
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="">Все статусы</option>
              {[
                "Ожидает",
                "Назначен",
                "Проведен",
                "Перенос",
                "Оплата",
                "Клиент отказ",
                "Каспий отказ",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              {[
                "Клиент",
                "Телефон",
                "Дата/Время",
                "РОП",
                "Преподаватель",
                "Статус",
                "Оплата",
              ].map((header) => (
                <th
                  key={header}
                  className="px-3 py-2 md:px-8 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {visibleEntries.map((entry, index) => (
              <tr
                key={entry.id}
                onClick={() => onOpenDetails(entry, readOnly)}
                className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-3 py-3 md:px-8 md:py-6 whitespace-nowrap">
                  <div className="font-semibold text-gray-900">
                    {entry.clientName}
                  </div>
                </td>
                <td className="px-3 py-3 md:px-8 md:py-6 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {formatPhoneNumber(entry.phone)}
                </td>
                <td className="px-3 py-3 md:px-8 md:py-6 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {entry.trialDate} {entry.trialTime}
                </td>
                <td className="px-3 py-3 md:px-8 md:py-6 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {entry.rop}
                </td>
                <td className="px-3 py-3 md:px-8 md:py-6 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {entry.assignedTeacher || "---"}
                </td>
                <td className="px-3 py-3 md:px-7 md:py-6 whitespace-nowrap">
                  <span
                    className={`inline-flex p-2 text-xs font-bold rounded-full shadow-sm ${getStatusBadge(
                      entry.status || "Ожидает"
                    )}`}
                  >
                    {entry.status || "Ожидает"}
                  </span>
                </td>
                <td className="px-3 py-3 md:px-8 md:py-6 whitespace-nowrap text-sm font-bold">
                  {entry.paymentAmount > 0 ? (
                    <span className="text-green-600">
                      {entry.paymentAmount.toLocaleString("ru-RU")} ₸
                    </span>
                  ) : (
                    <span className="text-gray-400">---</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 text-center">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-semibold text-lg">
              Записи не найдены
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Попробуйте изменить фильтры поиска
            </p>
          </div>
        ) : visibleCount < filteredEntries.length ? (
          <button
            onClick={handleShowMore}
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm md:text-base md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            <ChevronsDown size={18} />
            Показать еще 50
          </button>
        ) : (
          <p className="text-gray-500 font-semibold">
            Всего записей: {filteredEntries.length}
          </p>
        )}
      </div>
    </div>
  );
};

const LeaderboardView = ({
  entries,
  ropList,
  currentUser,
  plans,
  onSavePlans,
}) => {
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const toDateString = (date) => date.toISOString().split("T")[0];
  const [dateRange, setDateRange] = useState({
    startDate: toDateString(new Date()),
    endDate: toDateString(new Date()),
  });

  const handleDateChange = (e) => {
    setDateRange((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filteredEntries = useMemo(() => {
    const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
    const end = dateRange.endDate ? new Date(dateRange.endDate) : null;
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    return entries.filter((entry) => {
      const entryDate = new Date(entry.createdAt);
      return (!start || entryDate >= start) && (!end || entryDate <= end);
    });
  }, [entries, dateRange]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const leaderboardData = useMemo(() => {
    if (!ropList || ropList.length === 0) return [];
    const stats = {};
    ropList.forEach((rop) => {
      stats[rop.name] = {
        trials: 0,
        cash: 0,
        plan: plans[rop.name] || 0,
        trialPlan: plans[`${rop.name}_trial`] || 0,
      };
    });
    filteredEntries.forEach((entry) => {
      if (stats[entry.rop]) {
        stats[entry.rop].trials += 1;
        if (entry.status === "Оплата") {
          stats[entry.rop].cash += Number(entry.paymentAmount) || 0;
        }
      }
    });

    const dataForSorting = Object.entries(stats).map(([name, data]) => ({
      name,
      ...data,
      cashProgress:
        data.plan > 0 ? Math.min((data.cash / data.plan) * 100, 100) : 0,
      trialProgress:
        data.trialPlan > 0
          ? Math.min((data.trials / data.trialPlan) * 100, 100)
          : 0,
      cashRemaining: Math.max(data.plan - data.cash, 0),
      trialRemaining: Math.max(data.trialPlan - data.trials, 0),
    }));

    const totalCashInPeriod = dataForSorting.reduce(
      (sum, rop) => sum + rop.cash,
      0
    );

    if (totalCashInPeriod > 0) {
      return dataForSorting.sort((a, b) => b.cash - a.cash);
    } else {
      return dataForSorting.sort((a, b) => b.trials - a.trials);
    }
  }, [filteredEntries, ropList, plans]);

  const hourlyProgress = useMemo(() => {
    const now = currentTime;
    const today = now.toISOString().split("T")[0];

    const todayEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.createdAt);
      return entryDate.toISOString().split("T")[0] === today;
    });

    const hourlyCounts = Array(24).fill(0);
    todayEntries.forEach((entry) => {
      const entryHour = new Date(entry.createdAt).getHours();
      hourlyCounts[entryHour]++;
    });

    const hourlyTarget = 12;
    const currentHour = now.getHours();
    const currentHourEntries = hourlyCounts[currentHour];
    const progress = Math.min((currentHourEntries / hourlyTarget) * 100, 100);

    return {
      current: currentHourEntries,
      target: hourlyTarget,
      progress: progress,
      remaining: Math.max(hourlyTarget - currentHourEntries, 0),
    };
  }, [entries, currentTime]);

  const totalTrials = filteredEntries.length;
  const totalCash = leaderboardData.reduce((sum, rop) => sum + rop.cash, 0);
  const totalPlan = leaderboardData.reduce((sum, rop) => sum + rop.plan, 0);
  const totalTrialPlan = leaderboardData.reduce(
    (sum, rop) => sum + rop.trialPlan,
    0
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div
        className={`flex items-center ${
          currentUser?.role === "public" ? "justify-center" : "justify-end"
        }`}
      >
        {currentUser?.role === "public" && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-3xl mb-6 shadow-2xl">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Команданың нәтижесі
            </h2>
            <p className="text-gray-600 text-lg">
              Результаты работы по пробным урокам
            </p>
          </div>
        )}
        {currentUser?.role === "admin" && (
          <button
            onClick={() => setShowPlanModal(true)}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all font-bold shadow-lg"
          >
            <Target className="w-5 h-5" />
            Установить планы
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Фильтр по дате</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Начальная дата
            </label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Конечная дата
            </label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-medium"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-semibold uppercase tracking-wide">
                Жалпы пробный
              </p>
              <p className="text-2xl md:text-3xl font-black mt-2">
                {totalTrials}
              </p>
              {totalTrialPlan > 0 && (
                <p className="text-blue-200 text-sm mt-1">
                  План: {totalTrialPlan}
                </p>
              )}
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-400 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-6 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-semibold uppercase tracking-wide">
                Жалпы касса
              </p>
              <p className="text-2xl md:text-3xl font-black mt-2">
                {totalCash.toLocaleString("ru-RU")} ₸
              </p>
              {totalPlan > 0 && (
                <p className="text-green-200 text-sm mt-1">
                  План: {totalPlan.toLocaleString("ru-RU")} ₸
                </p>
              )}
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-green-400 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-semibold uppercase tracking-wide">
                Касса осталось
              </p>
              <p className="text-2xl md:text-3xl font-black mt-2">
                {Math.max(totalPlan - totalCash, 0).toLocaleString("ru-RU")} ₸
              </p>
              <p className="text-purple-200 text-sm mt-1">
                {totalPlan > 0
                  ? `${Math.round((totalCash / totalPlan) * 100)}%`
                  : "0%"}{" "}
                выполнено
              </p>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-semibold uppercase tracking-wide">
                Пробный осталось
              </p>
              <p className="text-2xl md:text-3xl font-black mt-2">
                {Math.max(totalTrialPlan - totalTrials, 0)}
              </p>
              <p className="text-orange-200 text-sm mt-1">
                {totalTrialPlan > 0
                  ? `${Math.round((totalTrials / totalTrialPlan) * 100)}%`
                  : "0%"}{" "}
                выполнено
              </p>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100">
        <div className="p-8 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">
            Рейтинг с прогрессом по планам
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {leaderboardData.map((rop, index) => (
            <div
              key={rop.name}
              className="p-5 md:p-8 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3 md:mb-6">
                <div className="flex items-center gap-4 md:gap-6">
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r ${getRankColor(
                      index
                    )} rounded-2xl flex items-center justify-center text-white font-black shadow-lg`}
                  >
                    {typeof getRankIcon(index) === "string" &&
                    getRankIcon(index).length > 1 ? (
                      <span className="text-2xl">{getRankIcon(index)}</span>
                    ) : (
                      <span className="text-xl">{getRankIcon(index)}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-900">
                      {rop.name}
                    </h4>
                    <div className="flex gap-4 text-sm text-gray-500 font-medium">
                      <span>{rop.trials} пробных уроков</span>
                      {rop.trialPlan > 0 && <span>План: {rop.trialPlan}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl md:text-3xl font-semibold md:font-black text-green-600">
                    {rop.cash.toLocaleString("ru-RU")} ₸
                  </p>
                  {rop.plan > 0 && (
                    <p className="text-sm text-gray-500 font-medium">
                      Осталось: {rop.cashRemaining.toLocaleString("ru-RU")} ₸
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                {rop.plan > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        Прогресс по кассе
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        {Math.round(rop.cashProgress)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${rop.cashProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {rop.trialPlan > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        Прогресс по пробным
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        {Math.round(rop.trialProgress)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${rop.trialProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-3">
              <Clock className="w-8 h-8" />
              Почасовой прогресс
            </h3>
            <p className="text-sm md:text-base text-indigo-100">
              Цель: {hourlyProgress.target} пробных уроков в час
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl md:text-4xl font-black">
              {hourlyProgress.current}/{hourlyProgress.target}
            </p>
            <p className="text-indigo-200 text-sm">
              Текущий час: {currentTime.getHours()}:00
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-indigo-100 font-semibold">
              Прогресс за текущий час
            </span>
            <span className="text-white font-bold text-lg">
              {Math.round(hourlyProgress.progress)}%
            </span>
          </div>
          <div className="w-full bg-indigo-400 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-1000 shadow-lg"
              style={{ width: `${hourlyProgress.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-indigo-200">
            <span>Зарегистрировано: {hourlyProgress.current}</span>
            <span>Осталось: {hourlyProgress.remaining}</span>
          </div>
        </div>
      </div>

      <PlanModal
        isVisible={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        ropList={ropList}
        plans={plans}
        onSavePlans={onSavePlans}
      />
    </div>
  );
};

const ConversionView = ({ entries, teacherSchedule }) => {
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filteredEntries = useMemo(() => {
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    if (startDate) startDate.setUTCHours(0, 0, 0, 0);

    const endDate = filters.endDate ? new Date(filters.endDate) : null;
    if (endDate) endDate.setUTCHours(23, 59, 59, 999);

    return entries.filter((entry) => {
      const entryDate = new Date(entry.createdAt);
      let dateMatch = true;

      if (startDate && endDate) {
        dateMatch = entryDate && entryDate >= startDate && entryDate <= endDate;
      } else if (startDate) {
        dateMatch = entryDate && entryDate >= startDate;
      } else if (endDate) {
        dateMatch = entryDate && entryDate <= endDate;
      }

      return dateMatch;
    });
  }, [entries, filters]);

  const conversionData = useMemo(() => {
    if (!teacherSchedule?.teachers?.length) return [];
    const stats = {};
    teacherSchedule.teachers.forEach((teacher) => {
      stats[teacher] = { name: teacher, conducted: 0, payments: 0 };
    });
    filteredEntries.forEach((entry) => {
      if (entry.assignedTeacher && stats[entry.assignedTeacher]) {
        if (["Проведен", "Оплата"].includes(entry.status)) {
          stats[entry.assignedTeacher].conducted += 1;
        }
        if (entry.status === "Оплата") {
          stats[entry.assignedTeacher].payments += 1;
        }
      }
    });
    return Object.values(stats)
      .map((data) => ({
        ...data,
        conversion:
          data.conducted > 0
            ? parseFloat(((data.payments / data.conducted) * 100).toFixed(1))
            : 0,
      }))
      .sort((a, b) => b.conversion - a.conversion);
  }, [filteredEntries, teacherSchedule?.teachers]);
  const getConversionColor = (conversion) => {
    if (conversion >= 70)
      return "text-green-600 bg-gradient-to-r from-green-100 to-green-200";
    if (conversion >= 50)
      return "text-yellow-600 bg-gradient-to-r from-yellow-100 to-yellow-200";
    if (conversion >= 30)
      return "text-orange-600 bg-gradient-to-r from-orange-100 to-orange-200";
    return "text-red-600 bg-gradient-to-r from-red-100 to-red-200";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <h3 className="font-bold text-xl text-gray-900 flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          Конверсия учителей
        </h3>
        <p className="text-gray-600 mt-2">
          Эффективность преобразования пробных уроков в оплаты
        </p>
      </div>
      <div className="p-8 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Начало периода
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Конец периода
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 font-medium"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ startDate: "", endDate: "" })}
              className="w-full px-4 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all font-bold"
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Преподаватель
              </th>
              <th className="px-8 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Проведено уроков
              </th>
              <th className="px-8 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Оплаты
              </th>
              <th className="px-8 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Конверсия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {conversionData.map((teacher, index) => (
              <tr
                key={teacher.name}
                className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all"
              >
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg ${
                        index < 3
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="font-bold text-gray-900">
                      {teacher.name}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-center">
                  <span className="font-bold text-gray-900 text-lg">
                    {teacher.conducted}
                  </span>
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-center">
                  <span className="font-bold text-green-600 text-lg">
                    {teacher.payments}
                  </span>
                </td>
                <td className="px-8 py-6 whitespace-nowrap text-center">
                  <span
                    className={`inline-flex px-4 py-2 text-sm font-bold rounded-full shadow-lg ${getConversionColor(
                      teacher.conversion
                    )}`}
                  >
                    {teacher.conversion}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {conversionData.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 font-semibold text-lg">
            Нет данных для отображения
          </p>
        </div>
      )}
    </div>
  );
};

const DistributionView = ({
  entries,
  teacherSchedule,
  showToast,
  onOpenDetails,
  onUpdateEntry,
  readOnly = false,
  selectedDate,
  onDateChange,
  blockedSlots,
  onToggleBlockSlot,
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverCell, setDragOverCell] = useState(null);
  const [selectedEntryForMobile, setSelectedEntryForMobile] = useState(null);
  const [cellToBlock, setCellToBlock] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isResheduledEntriesOn, setIsResheduledEntriesOn] = useState(false);

  const isMobile = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  }, []);

  const handleToggleIsResheduledEntriesOn = () => {
    setIsResheduledEntriesOn((prev) => !prev);
  };

  const handleReturnToBucket = async (e) => {
    e.preventDefault(); // Prevent default browser behavior
    if (!draggedItem || readOnly || isMobile) return;

    // Call the update function to "un-assign" the item
    onUpdateEntry(draggedItem.id, {
      ...draggedItem,
      assignedTeacher: null,
      assignedTeacherPhone: "",
      assignedTime: null,
      status: "Ожидает", // Reset the status to its default unassigned state
    });

    // Clear the dragged item state
    setDraggedItem(null);
  };

  const handleDragStart = (e, entry) => {
    if (readOnly || isMobile) return;
    setDraggedItem(entry);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", entry.id);
  };

  const handleDrop = async (e, teacher, time) => {
    e.preventDefault();
    setDragOverCell(null);
    if (!draggedItem || readOnly || isMobile) return;
    const cellKey = `${selectedDate}_${teacher.name}_${time}`;
    if (blockedSlots.some((slot) => slot.id === cellKey)) {
      showToast("Этот слот заблокирован", "error");
      return;
    }

    onUpdateEntry(draggedItem.id, {
      ...draggedItem,
      assignedTeacher: teacher.name,
      assignedTeacherPhone: teacher.number || "",
      assignedTime: time,
      status: "Назначен",
      trialDate: selectedDate || draggedItem.trialDate,
    });
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    if (!readOnly && !isMobile) e.preventDefault();
  };

  const handleDragEnter = (e, teacher, time) => {
    if (!readOnly && !isMobile) setDragOverCell(`${teacher.name}-${time}`);
  };

  const handleDragLeave = (e) => {
    if (!readOnly && !isMobile) setDragOverCell(null);
  };

  const handleEntryClick = (entry) => {
    if (readOnly) return;
    if (isMobile) {
      if (selectedEntryForMobile?.id === entry.id) {
        setSelectedEntryForMobile(null); // Deselect
      } else {
        setSelectedEntryForMobile(entry); // Select
      }
    } else {
    }
  };

  const handleCellClick = (teacher, time) => {
    if (readOnly) return;
    const cellKey = `${selectedDate}_${teacher.name}_${time}`;
    const isCellBlocked = blockedSlots.some((slot) => slot.id === cellKey);
    const isCellOccupied = entries.some(
      (e) =>
        e.assignedTeacher === teacher.name &&
        e.assignedTime === time &&
        e.trialDate === selectedDate
    );

    if (isMobile) {
      if (selectedEntryForMobile) {
        // Logic for placing an entry
        if (!isCellBlocked && !isCellOccupied) {
          onUpdateEntry(selectedEntryForMobile.id, {
            ...selectedEntryForMobile,
            assignedTeacher: teacher.name,
            assignedTime: time,
            status: "Назначен",
            trialDate: selectedDate,
          });
          setSelectedEntryForMobile(null);
          setCellToBlock(null);
        }
      } else {
        // Logic for blocking a cell (double tap)
        if (!isCellOccupied) {
          if (cellToBlock === cellKey) {
            onToggleBlockSlot(selectedDate, teacher.name, time);
            setCellToBlock(null);
          } else {
            setCellToBlock(cellKey);
            showToast("Нажмите еще раз для блокировки", "info");
            setTimeout(() => {
              setCellToBlock((prev) => (prev === cellKey ? null : prev));
            }, 3000);
          }
        }
      }
    } else {
      // Desktop logic (single click to block)
      if (!isCellOccupied) {
        onToggleBlockSlot(selectedDate, teacher.name, time);
      }
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const filteredBaseEntries = useMemo(() => {
    if (!searchQuery) return entries;
    const lowercasedQuery = searchQuery.toLowerCase();
    return entries.filter(
      (entry) =>
        entry.clientName.toLowerCase().includes(lowercasedQuery) ||
        (entry.phone &&
          entry.phone
            .replace(/\D/g, "")
            .includes(lowercasedQuery.replace(/\D/g, "")))
    );
  }, [entries, searchQuery]);

  const unassignedEntries = useMemo(() => {
    return filteredBaseEntries.filter((e) => {
      const isUnassigned = !e.assignedTeacher;
      const hasNoStatusOrPending = !e.status || e.status === "Ожидает";
      const isFutureOrToday = !e.trialDate || e.trialDate >= today;
      return isUnassigned && hasNoStatusOrPending && isFutureOrToday;
    });
  }, [filteredBaseEntries, today]);

  const rescheduledEntries = useMemo(() => {
    return filteredBaseEntries.filter((e) => {
      const isRescheduled = e.status === "Перенос";
      const isNaNStatus = e.status === "Статус жоқ";
      const isPastAndUnassigned =
        !isNaNStatus &&
        !e.assignedTeacher &&
        e.trialDate &&
        e.trialDate < today;
      return isRescheduled || isPastAndUnassigned;
    });
  }, [filteredBaseEntries, today]);

  const assignedEntriesMap = useMemo(() => {
    const map = new Map();
    entries
      .filter(
        (e) =>
          e.assignedTeacher && e.assignedTime && e.trialDate === selectedDate
      )
      .forEach((e) => {
        map.set(`${e.assignedTeacher}-${e.assignedTime}`, e);
      });
    return map;
  }, [entries, selectedDate]);

  const blockedSlotsMap = useMemo(() => {
    const map = new Map();
    blockedSlots.forEach((slot) => map.set(slot.id, true));
    return map;
  }, [blockedSlots]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-bold text-lg text-gray-900">Фильтр по дате</h3>
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {!readOnly && (
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6 max-h-[calc(100vh-7rem)] overflow-y-auto p-1 rounded-2xl">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Поиск по имени или телефону..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              {!isResheduledEntriesOn && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                      Новые заявки
                      <span className="ml-auto bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                        {unassignedEntries.length}
                      </span>
                    </h3>
                  </div>
                  <div
                    className="p-6"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleReturnToBucket}
                  >
                    <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                      {unassignedEntries.length > 0 ? (
                        unassignedEntries.map((entry) => (
                          <div
                            key={entry.id}
                            draggable={!readOnly && !isMobile}
                            onDragStart={(e) => handleDragStart(e, entry)}
                            onClick={() => handleEntryClick(entry)}
                            className={`p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 rounded-xl transition-all ${
                              !readOnly ? "cursor-pointer" : ""
                            } ${
                              !readOnly && !isMobile
                                ? "cursor-grab active:cursor-grabbing hover:shadow-lg hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transform hover:-translate-y-1"
                                : ""
                            } ${
                              draggedItem?.id === entry.id
                                ? "opacity-50 scale-95 rotate-2"
                                : ""
                            }
                            ${
                              selectedEntryForMobile?.id === entry.id
                                ? "border-blue-500 ring-2 ring-blue-500"
                                : "border-blue-200"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-bold text-gray-900 text-sm">
                                {entry.clientName}
                              </p>
                              <div className="text-gray-400">
                                <ArrowLeft className="w-4 h-4" />
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {entry.trialDate} {entry.trialTime}
                            </p>
                            <p className="text-xs text-blue-700 bg-blue-200 px-2 py-1 rounded-full inline-flex items-center gap-1 font-semibold">
                              <Users className="w-3 h-3" />
                              {entry.rop}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium text-sm">
                            Нет новых заявок
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div
                  onClick={handleToggleIsResheduledEntriesOn}
                  className="p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50"
                >
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse"></div>
                    Перенесенные
                    <span className="ml-auto bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {rescheduledEntries.length}
                    </span>
                  </h3>
                </div>

                {isResheduledEntriesOn && (
                  <div
                    className="p-4"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleReturnToBucket}
                  >
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                      {rescheduledEntries.length > 0 ? (
                        rescheduledEntries.map((entry) => (
                          <div
                            key={entry.id}
                            draggable={!readOnly && !isMobile}
                            onDragStart={(e) => handleDragStart(e, entry)}
                            onClick={() => handleEntryClick(entry)}
                            className={`p-4 bg-gradient-to-br from-red-50 to-orange-50 border-2 rounded-xl transition-all ${
                              !readOnly ? "cursor-pointer" : ""
                            } ${
                              !readOnly && !isMobile
                                ? "cursor-grab active:cursor-grabbing hover:shadow-lg hover:from-red-100 hover:to-orange-100 hover:border-red-300 transform hover:-translate-y-1"
                                : ""
                            } ${
                              draggedItem?.id === entry.id
                                ? "opacity-50 scale-95 rotate-2"
                                : ""
                            }
                            ${
                              selectedEntryForMobile?.id === entry.id
                                ? "border-red-500 ring-2 ring-red-500"
                                : "border-red-200"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-bold text-gray-900 text-sm">
                                {entry.clientName}
                              </p>
                              <div className="text-gray-400">
                                <ArrowLeft className="w-4 h-4" />
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {entry.trialDate} {entry.trialTime}
                            </p>
                            <p className="text-xs text-red-700 bg-red-200 px-2 py-1 rounded-full inline-flex items-center gap-1 font-semibold">
                              <Users className="w-3 h-3" />
                              {entry.rop}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <History className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium text-sm">
                            Нет перенесенных заявок
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className={readOnly ? "lg:col-span-4" : "lg:col-span-3"}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="p-3 md:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                График преподавателей
                {selectedDate && (
                  <span className="text-sm text-blue-600 bg-blue-100 text-center md:px-3 py-1 rounded-full font-semibold">
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                      "ru-RU",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>
                )}
              </h3>
            </div>
            <div className="p-3 md:p-6">
              <div className="overflow-auto max-h-[70vh]">
                <table className="w-full border-collapse relative">
                  <thead>
                    <tr>
                      <th className="sticky top-0 left-0 bg-gray-100 p-3 border-b-2 border-gray-200 font-bold text-gray-900 text-left min-w-[60px] md:min-w-[80px] z-30 text-sm">
                        Время
                      </th>
                      {teacherSchedule.teacherObjList.map((teacher) => (
                        <th
                          key={teacher.name}
                          className="sticky top-0 bg-gray-100 p-3 border-b-2 border-gray-200 font-bold text-gray-900 min-w-[90px] md:min-w-[120px] text-center text-sm z-20"
                        >
                          {teacher.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {teacherSchedule.timeSlots.map((time) => (
                      <tr
                        key={time}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="sticky left-0 bg-white p-3 border-b border-gray-100 font-bold text-xs text-gray-700 z-10">
                          {time}
                        </td>
                        {teacherSchedule.teacherObjList.map((teacher) => {
                          const assignedEntry = assignedEntriesMap.get(
                            `${teacher.name}-${time}`
                          );
                          const cellKey = `${selectedDate}_${teacher.name}_${time}`;
                          const isBlocked = blockedSlotsMap.has(cellKey);
                          const isDragOver =
                            dragOverCell === `${teacher.name}-${time}`;
                          const isPrimedForBlock = cellToBlock === cellKey;

                          let cellClasses =
                            "p-1.5 md:p-2 border-b border-gray-100 h-14 md:h-16 transition-all";
                          if (!readOnly && !assignedEntry) {
                            cellClasses += " cursor-pointer";
                          }

                          if (isBlocked) {
                            cellClasses += " bg-gray-200 hover:bg-gray-300";
                          } else if (!assignedEntry && !readOnly) {
                            if (isDragOver && !isMobile) {
                              cellClasses +=
                                " bg-gradient-to-br from-green-200 to-emerald-200 border-green-400 animate-pulse scale-105 border-2 border-dashed";
                            } else if (selectedEntryForMobile && isMobile) {
                              cellClasses +=
                                " bg-blue-200 border-blue-400 border-2 border-dashed";
                            } else if (isPrimedForBlock && isMobile) {
                              cellClasses +=
                                " bg-yellow-200 border-yellow-400 border-2 border-dashed";
                            } else {
                              cellClasses +=
                                " bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-dashed border-green-300";
                            }
                          }

                          return (
                            <td
                              key={cellKey}
                              onDragOver={handleDragOver}
                              onDragEnter={(e) =>
                                handleDragEnter(e, teacher, time)
                              }
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, teacher, time)}
                              onClick={() => handleCellClick(teacher, time)}
                              className={cellClasses}
                            >
                              {assignedEntry ? (
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenDetails(assignedEntry, readOnly);
                                  }}
                                  draggable={!readOnly && !isMobile}
                                  onDragStart={(e) =>
                                    handleDragStart(e, assignedEntry)
                                  }
                                  className={`w-full h-full flex items-center justify-center text-white rounded-lg p-2 text-xs font-semibold cursor-pointer transition-all hover:scale-105 shadow-lg transform ${getAppointmentColorForStatus(
                                    assignedEntry.status
                                  )} ${
                                    draggedItem?.id === assignedEntry.id
                                      ? "opacity-50 scale-95 rotate-1"
                                      : ""
                                  }`}
                                >
                                  <p className="font-bold truncate text-xs">
                                    {assignedEntry.clientName}
                                  </p>
                                </div>
                              ) : isBlocked ? (
                                <div className="h-full flex items-center justify-center text-gray-500">
                                  <Lock className="w-5 h-5" />
                                </div>
                              ) : !readOnly ? (
                                <div className="h-full flex items-center justify-center text-green-400 font-semibold">
                                  <Plus className="w-5 h-5" />
                                </div>
                              ) : null}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalyticsView = ({ entries, ropList }) => {
  const toDateString = (date) => date.toISOString().slice(0, 10);

  const getInitialDateRange = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      startDate: toDateString(startOfMonth),
      endDate: toDateString(today),
    };
  };

  const [filters, setFilters] = useState({
    ...getInitialDateRange(),
    source: "",
    rop: "",
    activeQuickFilter: "month",
  });

  const filteredEntries = useMemo(() => {
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    return entries.filter((entry) => {
      const entryDate = new Date(entry.createdAt);
      const dateMatch =
        (!start || entryDate >= start) && (!end || entryDate <= end);
      const sourceMatch = !filters.source || entry.source === filters.source;
      const ropMatch = !filters.rop || entry.rop === filters.rop;
      return dateMatch && sourceMatch && ropMatch;
    });
  }, [entries, filters]);

  const {
    totalCash,
    averageCheck,
    sourceStats,
    ropStats,
    funnelStats,
    correlationData,
    reachabilityStats,
    trialSourceStats,
  } = useMemo(() => {
    const paidEntries = filteredEntries.filter(
      (entry) => entry.status === "Оплата"
    );
    const cash = paidEntries.reduce(
      (sum, entry) => sum + (Number(entry.paymentAmount) || 0),
      0
    );
    const paymentsCount = paidEntries.length;
    const avgCheck = paymentsCount > 0 ? cash / paymentsCount : 0;

    const tempSourceStats = {};
    const tempRopStats = {};
    const tempTrialSourceStats = {};

    filteredEntries.forEach((entry) => {
      if (entry.source) {
        tempTrialSourceStats[entry.source] =
          (tempTrialSourceStats[entry.source] || 0) + 1;
      }
      if (entry.status === "Оплата") {
        const amount = Number(entry.paymentAmount) || 0;
        if (entry.source)
          tempSourceStats[entry.source] =
            (tempSourceStats[entry.source] || 0) + amount;
        if (entry.rop)
          tempRopStats[entry.rop] = (tempRopStats[entry.rop] || 0) + amount;
      }
    });

    const scheduledTrials = filteredEntries.filter((e) =>
      ["Назначен", "Проведен", "Оплата"].includes(e.status)
    ).length;
    const conductedTrials = filteredEntries.filter((e) =>
      ["Проведен", "Оплата"].includes(e.status)
    ).length;

    const funnel = {
      total: filteredEntries.length,
      conducted: conductedTrials,
      paid: paymentsCount,
      refused: filteredEntries.filter((e) =>
        ["Клиент отказ", "Каспий отказ"].includes(e.status)
      ).length,
      rescheduled: filteredEntries.filter((e) => e.status === "Перенос").length,
    };

    const dataByDay = {};
    const start = new Date(filters.startDate + "T00:00:00");
    const end = new Date(filters.endDate + "T00:00:00");
    if (start <= end) {
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const day = toDateString(d);
        dataByDay[day] = { trials: 0, cash: 0 };
      }

      filteredEntries.forEach((entry) => {
        const day = toDateString(new Date(entry.createdAt));
        if (dataByDay[day]) {
          dataByDay[day].trials += 1;
          if (entry.status === "Оплата") {
            dataByDay[day].cash += Number(entry.paymentAmount) || 0;
          }
        }
      });
    }
    const sortedDays = Object.keys(dataByDay).sort();
    const correlation = {
      labels: sortedDays.map((day) =>
        new Date(day + "T00:00:00").toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "short",
        })
      ),
      trials: sortedDays.map((day) => dataByDay[day].trials),
      cash: sortedDays.map((day) => dataByDay[day].cash),
    };

    const reachability = {
      scheduled: scheduledTrials,
      conducted: conductedTrials,
      rate: scheduledTrials > 0 ? (conductedTrials / scheduledTrials) * 100 : 0,
    };

    return {
      totalCash: cash,
      averageCheck: avgCheck,
      sourceStats: Object.entries(tempSourceStats)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount),
      ropStats: Object.entries(tempRopStats)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount),
      trialSourceStats: Object.entries(tempTrialSourceStats)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count), // Corrected this line
      funnelStats: funnel,
      correlationData: correlation,
      reachabilityStats: reachability,
    };
  }, [filteredEntries, filters.startDate, filters.endDate]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      activeQuickFilter: "",
    }));
  };

  const handleQuickFilter = (period) => {
    const today = new Date();
    let startDate;
    if (period === "day") {
      startDate = today;
    } else if (period === "week") {
      startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 6
      );
    } else if (period === "month") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }
    setFilters((prev) => ({
      ...prev,
      startDate: toDateString(startDate),
      endDate: toDateString(today),
      activeQuickFilter: period,
    }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-y-4">
          <h3 className="font-bold text-xl text-gray-900 flex items-center gap-3 w-full sm:w-auto">
            <Filter className="w-6 h-6 text-blue-600" />
            Фильтры аналитики
          </h3>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            {["day", "week", "month"].map((period) => (
              <button
                key={period}
                onClick={() => handleQuickFilter(period)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  filters.activeQuickFilter === period
                    ? "bg-white text-blue-600 shadow"
                    : "text-gray-500"
                }`}
              >
                {period === "day"
                  ? "День"
                  : period === "week"
                  ? "Неделя"
                  : "Месяц"}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Начало периода
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Конец периода
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Источник
            </label>
            <select
              name="source"
              value={filters.source}
              onChange={handleFilterChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-medium"
            >
              <option value="">Все источники</option>
              {ALL_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              РОП
            </label>
            <select
              name="rop"
              value={filters.rop}
              onChange={handleFilterChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl font-medium"
            >
              <option value="">Все РОП</option>
              {ropList.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-xl md:text-2xl text-gray-900 mb-4">
          Воронка за период
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <FunnelStatCard
            title="Всего заявок"
            count={funnelStats.total}
            total={funnelStats.total}
            icon={<BookCopy size={18} />}
            colorClass="bg-gray-500 border-gray-600"
          />
          <FunnelStatCard
            title="Проведено"
            count={funnelStats.conducted}
            total={funnelStats.total}
            icon={<UserCheck size={20} />}
            colorClass="bg-blue-500 border-blue-600"
          />
          <FunnelStatCard
            title="Оплаты"
            count={funnelStats.paid}
            total={funnelStats.total}
            icon={<CheckCircle size={20} />}
            colorClass="bg-green-500 border-green-600"
          />
          <FunnelStatCard
            title="Отказы"
            count={funnelStats.refused}
            total={funnelStats.total}
            icon={<XCircle size={20} />}
            colorClass="bg-red-500 border-red-600"
          />
          <FunnelStatCard
            title="Переносы"
            count={funnelStats.rescheduled}
            total={funnelStats.total}
            icon={<History size={20} />}
            colorClass="bg-orange-500 border-orange-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          title="Общая касса"
          value={`${totalCash.toLocaleString("ru-RU")} ₸`}
          icon={<DollarSign className="w-6 h-6 md:w-8 md:h-8 text-white" />}
          gradient="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatCard
          title="Средний чек"
          value={`${averageCheck.toLocaleString("ru-RU", {
            maximumFractionDigits: 0,
          })} ₸`}
          icon={<PieChartIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />}
          gradient="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <ReachabilityChart stats={reachabilityStats} />
      </div>

      <CombinedCashTrialsChart data={correlationData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BreakdownList title="Касса по источникам" data={sourceStats} />
        <BreakdownList title="Касса по РОП" data={ropStats} />
      </div>

      <div className="mt-8">
        <TrialSourceChart
          title="Количество пробных по источникам"
          data={trialSourceStats}
        />
      </div>
    </div>
  );
};

// =================================================================
//                        REFACTORED ANALYTICS COMPONENTS
// =================================================================

const BreakdownList = ({ title, data }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
    <h3 className="font-bold text-xl text-gray-900 mb-6">{title}</h3>
    <div className="w-full overflow-x-auto">
      <div
        className="w-full"
        style={{
          height: `${Math.max(120, data.length * 45)}px`,
          minWidth: "600px",
        }}
      >
        {data.length > 0 ? (
          <ResponsiveContainer>
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                yAxisId={0}
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                width={100}
                style={{ fontSize: "12px" }}
              />
              <YAxis
                yAxisId={1}
                orientation="right"
                dataKey="amount"
                type="category"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value.toLocaleString("ru-RU")} ₸`}
                style={{ fontSize: "12px", fill: "#6b7280" }}
              />
              <Tooltip
                formatter={(value) => `${value.toLocaleString("ru-RU")} ₸`}
              />
              <Bar
                yAxisId={0}
                dataKey="amount"
                name="Касса"
                fill="#3b82f6"
                radius={[0, 4, 4, 0]}
                maxBarSize={25}
              >
                <LabelList
                  dataKey="name"
                  position="insideLeft"
                  style={{
                    fill: "white",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center py-8">
              Нет данных для отображения.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const TrialSourceChart = ({ title, data }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
    <h3 className="font-bold text-xl text-gray-900 mb-6">{title}</h3>
    <div className="w-full overflow-x-auto">
      <div
        className="w-full"
        style={{
          height: `${Math.max(120, data.length * 45)}px`,
          minWidth: "600px",
        }}
      >
        {data.length > 0 ? (
          <ResponsiveContainer>
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                yAxisId={0}
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                width={120}
                style={{ fontSize: "12px" }}
              />
              <YAxis
                yAxisId={1}
                orientation="right"
                dataKey="count"
                type="category"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}`}
                style={{ fontSize: "12px", fill: "#6b7280" }}
              />
              <Tooltip
                formatter={(value, name) => [`${value} пробных`, "Количество"]}
              />
              <Bar
                yAxisId={0}
                dataKey="count"
                name="Пробные"
                fill="#8884d8"
                radius={[0, 4, 4, 0]}
                maxBarSize={25}
              >
                <LabelList
                  dataKey="name"
                  position="insideLeft"
                  style={{
                    fill: "white",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center py-8">
              Нет данных для отображения.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const CombinedCashTrialsChart = ({ data }) => {
  const chartData = data.labels.map((label, i) => ({
    name: label,
    trials: data.trials[i],
    cash: data.cash[i],
  }));

  const formatCashTick = (tick) => {
    if (tick >= 1000000) return `${(tick / 1000000).toFixed(1)}m`;
    if (tick >= 1000) return `${(tick / 1000).toFixed(0)}k`;
    return tick;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <h3 className="font-bold text-xl text-gray-900">
        График: Пробный сабақ и Касса
      </h3>
      <p className="text-gray-500 text-sm mb-4">
        Динамика пробных уроков и кассы за выбранный период
      </p>
      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: 700, height: 450 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                angle={-30}
                textAnchor="end"
                height={50}
                interval="preserveStartEnd"
              />
              <YAxis
                yAxisId="left"
                stroke="#f97316"
                label={{
                  value: "Пробные",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#f97316",
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#4ade80"
                tickFormatter={formatCashTick}
                label={{
                  value: "Касса (₸)",
                  angle: -90,
                  position: "insideRight",
                  fill: "#4ade80",
                }}
              />
              <Tooltip
                formatter={(value, name) =>
                  name === "Касса"
                    ? `${value.toLocaleString("ru-RU")} ₸`
                    : value
                }
              />
              <Legend />
              <Bar
                yAxisId="right"
                dataKey="cash"
                name="Касса"
                fill="#4ade80"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="trials"
                name="Пробные"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const ReachabilityChart = ({ stats }) => {
  const { scheduled, conducted, rate } = stats;
  const data = [{ name: "Доходимость", value: rate }];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center">
      <h3 className="font-bold text-xl text-gray-900 mb-4">
        Доходимость уроков
      </h3>
      <div className="relative w-40 h-40">
        <ResponsiveContainer>
          <RadialBarChart
            innerRadius="80%"
            outerRadius="100%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              background
              clockWise
              dataKey="value"
              fill="#10b981"
              cornerRadius={10}
            />
            <Tooltip />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-3xl font-black text-teal-600"
            >
              {`${rate.toFixed(1)}%`}
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 text-lg font-bold text-gray-800">
        Проведено: {conducted} из {scheduled}
      </p>
      <p className="text-sm text-gray-500">назначенных уроков</p>
    </div>
  );
};

export const AdminPage = ({
  tabs,
  activeTab,
  setActiveTab,
  currentUser,
  onBack,
  readOnly,
  selectedDate,
  onDateChange,
  plans,
  onSavePlans,
  ...props
}) => {
  const renderAdminView = () => {
    switch (activeTab) {
      case "trials-list":
        return (
          <TrialsListView
            {...props}
            onOpenDetails={props.onOpenDetails}
            readOnly={readOnly}
          />
        );
      case "leaderboard":
        return (
          <LeaderboardView
            {...props}
            currentUser={currentUser}
            plans={plans}
            onSavePlans={onSavePlans}
          />
        );
      case "conversion":
        return (
          <ConversionView {...props} teacherSchedule={props.teacherSchedule} />
        );
      case "analytics":
        return <AnalyticsView {...props} />;
      case "users":
        return <UserManagementView {...props} />;
      case "notifications": // Новая вкладка
        return <TeacherNotificationSender />;
      case "distribution":
      default:
        return (
          <DistributionView
            {...props}
            readOnly={readOnly}
            onOpenDetails={props.onOpenDetails}
            selectedDate={selectedDate}
            onDateChange={onDateChange}
          />
        );
    }
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-3 text-blue-600 hover:text-blue-800 font-bold transition-colors bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100"
          >
            <ArrowLeft size={20} />
            Назад
          </button>
        )}
        <div className="flex gap-2 bg-gray-100 p-2 rounded-2xl flex-wrap">
          {tabs
            .filter(
              (tab) =>
                !readOnly && (currentUser.role === "admin" || !tab.adminOnly)
            )
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-lg transform scale-105"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
        </div>
        <div className="text-sm text-gray-600 font-bold bg-gray-100 px-4 py-2 rounded-xl">
          {new Date().toLocaleDateString("ru-RU", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
      {renderAdminView()}
    </section>
  );
};
