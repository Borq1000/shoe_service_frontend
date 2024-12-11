# Документация веб-клиента ShoeMaster

Документация фронтенд-части клиентского веб-приложения для сервиса по ремонту обуви

## 1. Общее описание

ShoeMaster Web Client - это клиентское веб-приложение, разработанное для заказчиков услуг по ремонту и обслуживанию обуви. Построенное на современных веб-технологиях, оно предоставляет интуитивно понятный интерфейс для заказа услуг по ремонту обуви, отслеживания заказов и управления профилем клиента.

## 2. Технический стек

### 2.1 Основные технологии

- **Frontend Framework**: Next.js 14.2.13
- **Язык программирования**: TypeScript
- **Стилизация**: Tailwind CSS
- **Аутентификация**: NextAuth.js 5.0 beta
- **HTTP-клиент**: Axios
- **Управление формами**: React (встроенное управление состоянием)
- **Валидация**: Zod
- **Иконки**: React Icons

### 2.2 Основные зависимости

{
"next": "14.2.13",
"react": "^18",
"next-auth": "5.0.0-beta.22",
"axios": "^1.7.7",
"tailwindcss": "^3.4.1",
"typescript": "^5",
"zod": "^3.23.8"
}

## 3. Архитектура проекта

### 3.1 Структура проекта

app/
├── account/ # Страницы личного кабинета
├── api/ # API-маршруты Next.js
├── orders/ # Страницы управления заказами
├── services/ # Страницы услуг
├── aboutus/ # Информационные страницы
components/ # React-компоненты
actions/ # Серверные действия
schemas/ # Схемы валидации

### 3.2 Ключевые компоненты

#### Навигация и аутентификация

- **NavBar**: Основная навигационная панель
  - Навигация по разделам
  - Кнопки входа/регистрации
  - Индикатор уведомлений (NotificationBell)
  - Меню пользователя

#### Уведомления

- **NotificationProvider**: Провайдер для работы с WebSocket и уведомлениями

  ```typescript
  // Пример использования в компоненте
  const { notifications, unreadCount, markAsRead } = useNotifications();
  ```

- **NotificationBell**: Индикатор непрочитанных уведомлений

  - Отображает количество непрочитанных уведомлений
  - При клике перенаправляет на страницу уведомлений

- **NotificationsList**: Список всех уведомлений
  - Отображение уведомлений с сортировкой по дате
  - Маркировка прочитанных/непрочитанных
  - Кнопка "Отметить все как прочитанные"

#### Заказы и услуги

- **ServiceHome**: Отображение доступных услуг
- **OrdersPage**: Управление заказами
- **OrderForm**: Форма создания заказа
- **OrderDetails**: Детальная информация о заказе

#### Профиль и настройки

- **ProfilePage**: Страница профиля пользователя
- **SettingsForm**: Форма настроек пользователя
- **PasswordResetForm**: Форма сброса пароля

## 4. Основной функционал

### 4.1 Система уведомлений

#### WebSocket подключение

```typescript
// Пример конфигурации WebSocket в NotificationProvider
const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsUrl = `${wsProtocol}//127.0.0.1:8000/ws/notifications/?token=${session.accessToken}`;
const ws = new WebSocket(wsUrl);
```

#### Типы уведомлений

```typescript
interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  order_id?: number;
  order_status?: string;
  created_at: string;
  is_read: boolean;
}
```

#### Обработка уведомлений

- **Toast уведомления**: Мгновенные уведомления при получении новых событий
- **Иконки по типам**:
  - 📦 new_order - Новый заказ
  - 🔄 order_update - Обновление заказа
  - ❌ order_cancelled - Отмена заказа
  - 🔔 system - Системное уведомление

#### Управление уведомлениями

```typescript
// Отметить одно уведомление как прочитанное
await markAsRead(notificationId);

// Отметить все уведомления как прочитанные
await markAllAsRead();
```

### 4.2 Управление заказами

#### Создание заказа

```typescript
interface OrderData {
  service: number;
  city: string;
  street: string;
  building_num: string;
  apartment: string;
  comment?: string;
  image?: File;
}

// Пример создания заказа
const createOrder = async (data: OrderData) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });

  const response = await fetch("/api/orders/client/orders/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: formData,
  });

  return response.json();
};
```

#### Статусы заказов

```typescript
const OrderStatus = {
  pending: "В ожидании",
  awaiting_courier: "Ожидает курьера",
  courier_on_the_way: "Курьер в пути",
  at_location: "На месте",
  in_progress: "В работе",
  completed: "Завершён",
  cancelled: "Отменён",
  return: "Возврат",
} as const;
```

### 4.3 Аутентификация

#### Настройка NextAuth

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        // Логика авторизации
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

## 5. Интеграция с API

### 5.1 Конфигурация API

```typescript
// lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getToken(); // Получение токена из хранилища
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 5.2 Примеры API запросов

#### Заказы

```typescript
// services/orders.ts
export const ordersApi = {
  // Получение списка заказов
  async getOrders() {
    return api.get("/orders/client/orders/");
  },

  // Создание заказа
  async createOrder(data: OrderData) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    return api.post("/orders/client/orders/", formData);
  },

  // Отмена заказа
  async cancelOrder(orderId: number) {
    return api.post(`/orders/client/orders/${orderId}/cancel/`);
  },
};
```

## 6. Компоненты и хуки

### 6.1 Провайдеры

#### NotificationProvider

```typescript
// providers/notification-provider.tsx
export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // ... код провайдера

  return (
    <NotificationContext.Provider
      value={{
        socket,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// Хук для использования уведомлений
export const useNotifications = () => useContext(NotificationContext);
```

### 6.2 Компоненты уведомлений

#### NotificationBell

```typescript
// components/notifications/NotificationBell.tsx
export function NotificationBell() {
  const { unreadCount } = useNotifications();

  return (
    <Link href="/notifications" className="relative">
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
```

#### NotificationsList

```typescript
// components/notifications/NotificationsList.tsx
export function NotificationsList() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } =
    useNotifications();

  return (
    <div className="space-y-4">{/* Код компонента списка уведомлений */}</div>
  );
}
```

## 7. Стилизация

### 7.1 Tailwind CSS конфигурация

```javascript
// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Кастомные цвета и настройки
    },
  },
  plugins: [],
};
```

### 7.2 Глобальные стили

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Кастомные стили */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600;
  }

  .notification-item {
    @apply p-4 rounded-lg transition-colors;
  }
}
```

## 8. Развертывание

### 8.1 Зависимости

```json
{
  "dependencies": {
    "next": "14.2.13",
    "react": "^18",
    "next-auth": "5.0.0-beta.22",
    "axios": "^1.7.7",
    "tailwindcss": "^3.4.1",
    "typescript": "^5",
    "zod": "^3.23.8",
    "react-hot-toast": "^2.4.1",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.358.0"
  }
}
```

### 8.2 Переменные окружения

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## 9. Тестирование

### 9.1 Модульные тесты

```typescript
// __tests__/components/NotificationBell.test.tsx
import { render, screen } from "@testing-library/react";
import { NotificationBell } from "@/components/notifications/NotificationBell";

describe("NotificationBell", () => {
  it("shows correct unread count", () => {
    // Тесты компонента
  });
});
```

### 9.2 Интеграционные тесты

```typescript
// __tests__/integration/notifications.test.tsx
describe("Notifications Integration", () => {
  it("receives and displays new notifications", () => {
    // Интеграционные тесты
  });
});
```

## 10. Рекомендации по разработке

### 10.1 Структура компонентов

- Использовать атомарный дизайн
- Разделять бизнес-логику и представление
- Следовать принципам SOLID

### 10.2 Производительность

- Использовать React.memo для оптимизации рендеринга
- Применять виртуализацию для длинных списков
- Оптимизировать изображения

### 10.3 Безопасность

- Валидировать все пользовательские данные
- Использовать HTTPS
- Применять CSRF токены
- Проверять типы данных через TypeScript

## 11. Поддержка и обновления

### 11.1 Логирование

```typescript
// utils/logger.ts
export const logger = {
  error: (error: Error, context?: any) => {
    console.error("[Error]", error, context);
    // Отправка ошибки в систему мониторинга
  },
  info: (message: string, data?: any) => {
    console.log("[Info]", message, data);
  },
};
```

### 11.2 Мониторинг

- Использование Error Boundary для обработки ошибок React
- Интеграция с системами мониторинга
- Отслеживание производительности

---

Последнее обновление: [Текущая дата]
Версия: 1.1.0
