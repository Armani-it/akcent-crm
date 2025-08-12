import { useState } from "react";
import { Modal } from "../components/Modal/Modal";

export const UserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: user?.id || null,
    name: user?.name || "",
    number: user?.number || "",
    username: user?.username || "",
    password: "",
    role: user?.role || "teacher",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.username ||
      (!formData.id && !formData.password)
    ) {
      // Replace with a custom modal/toast in a real app
      alert("Пожалуйста, заполните все обязательные поля.");
      return;
    }
    onSave(formData);
  };

  return (
    <Modal isVisible={true} onClose={onClose} size="md">
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-6">
          {user ? "Редактировать пользователя" : "Добавить пользователя"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Имя
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Логин
            </label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Пароль
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl"
              placeholder={user ? "Оставьте пустым, чтобы не менять" : ""}
              required={!user}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Роль
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-xl"
            >
              <option value="teacher">Учитель</option>
              <option value="rop">РОП</option>
              <option value="admin">Администратор</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
