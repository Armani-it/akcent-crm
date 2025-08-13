import { Calendar, Check, Lock, X } from "lucide-react";
import { getAppointmentColorForStatus } from "../components/GetAppointmentColorForStatus/GetAppointmentColorForStatus";
import { Modal } from "../components/Modal/Modal";
import { useMemo, useState } from "react";

export const PublicScheduleModal = ({ onClose, initialDate, ...props }) => {
  const [localDate, setLocalDate] = useState(initialDate);

  const assignedEntriesMap = useMemo(() => {
    const map = new Map();
    props.entries.forEach((e) => {
      if (e.assignedTeacher && e.assignedTime && e.trialDate) {
        // Ensure trialDate exists
        map.set(`${e.assignedTeacher}-${e.trialDate}-${e.assignedTime}`, e);
      }
    });
    return map;
  }, [props.entries]); // Depend only on entries, localDate is not needed here

  const blockedSlotsMap = useMemo(() => {
    const map = new Map();
    props.blockedSlots.forEach((slot) => {
      if (slot.teacher && slot.date && slot.time) {
        // Ensure all parts exist
        map.set(`${slot.teacher}_${slot.date}_${slot.time}`, true);
      }
    });
    return map;
  }, [props.blockedSlots]); // Depend only on blockedSlots, localDate is not needed here

  return (
    <Modal isVisible={true} onClose={onClose} size="full">
      <div className="p-4 md:p-8 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h3 className="font-bold text-lg md:text-2xl text-gray-900 flex items-center gap-3">
            <Calendar className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
            График преподавателей
          </h3>
          <input
            type="date"
            value={localDate}
            onChange={(e) => setLocalDate(e.target.value)}
            className="p-2 md:p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all md:font-medium"
          />
          <button
            onClick={onClose}
            className="p-2 md:p-3 rounded-xl hover:bg-white/50 transition-colors text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="sticky top-0 left-0 bg-white p-1 md:p-4 border-b-2 border-gray-200 font-medium md:font-bold text-gray-900 text-left min-w-[50px] md:min-w-[100px] z-10">
                  Время
                </th>
                {props.teacherSchedule.teachers.map((teacher) => (
                  <th
                    key={teacher}
                    className="sticky top-0 bg-white p-1 md:p-4 border-b-2 border-gray-200 font-medium md:font-bold text-gray-900 min-w-[90px] md:min-w-[140px] text-center"
                  >
                    {teacher}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {props.teacherSchedule.timeSlots.map((time) => (
                <tr key={time} className="hover:bg-gray-50 transition-colors">
                  <td className="sticky left-0 bg-white p-1 md:p-4 border-b border-gray-100 font-medium md:font-bold text-sm text-gray-700 z-10">
                    {time}
                  </td>
                  {props.teacherSchedule.teachers.map((teacher) => {
                    // Correctly access entries and blocked slots using the full key
                    const entry = assignedEntriesMap.get(
                      `${teacher}-${localDate}-${time}`
                    );
                    const isBlocked = blockedSlotsMap.has(
                      `${teacher}_${localDate}_${time}`
                    );
                    return (
                      <td
                        key={`${teacher}-${time}`}
                        className="p-2 border-b border-gray-100 h-20 text-center"
                      >
                        <div
                          onClick={() =>
                            !entry &&
                            props.onToggleBlockSlot(localDate, teacher, time)
                          }
                          className={`h-full w-full rounded-xl border flex flex-col items-center justify-center p-1 text-xs font-semibold transition-all ${
                            entry
                              ? `${getAppointmentColorForStatus(
                                  entry.status
                                )} cursor-pointer`
                              : isBlocked
                              ? "bg-gray-200 border-gray-200"
                              : "bg-green-50 border-green-200"
                          }`}
                        >
                          {entry ? (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                props.onOpenDetails(entry, true);
                              }}
                              className={`h-full w-full flex flex-col items-center justify-center text-white rounded-lg p-2 text-xs font-semibold cursor-pointer transition-all hover:scale-105 shadow-lg transform ${getAppointmentColorForStatus(
                                entry.status
                              )}`}
                            >
                              <span className="font-bold truncate">
                                {entry.clientName}
                              </span>
                              <span className="opacity-80 truncate">
                                {entry.status}
                              </span>
                              {entry.paymentAmount > 0 && (
                                <span className="opacity-80 truncate">
                                  {entry.paymentAmount.toLocaleString("ru-RU")}{" "}
                                  ₸
                                </span>
                              )}
                            </div>
                          ) : isBlocked ? (
                            <Lock className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Check className="w-5 h-5 text-green-400" />
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};
