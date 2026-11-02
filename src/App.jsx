// ============================================================
//  App — корневой компонент мини-магазина.
//
//  Здесь на примере одной страницы показан полный цикл работы
//  с API во фронтенде:
//
//  useEffect  -> "сходи за товарами один раз при запуске"
//  useState   -> "запомни: товары, загрузка, ошибка, корзина, поиск"
//  handleClick-> "пользователь кликнул 'В корзину' — обнови состояние"
// ============================================================

import { useEffect, useState } from 'react'
import { getProducts } from './api/products.js'
import ProductCard from './components/ProductCard.jsx'

export default function App() {
  // ---------------- useState: 5 кусочков состояния ----------------
  // Каждый setXxx() вызывает ПЕРЕРИСОВКУ компонента. Ничего больше.

  const [products, setProducts] = useState([])   // пришедшие с сервера товары
  const [loading, setLoading] = useState(true)   // идёт ли запрос (для заглушки)
  const [error, setError] = useState(null)       // строка ошибки или null
  const [cart, setCart] = useState(() => new Set()) // id добавленных товаров
  const [query, setQuery] = useState('')         // текст из поля поиска

  // ---------------- useEffect: жизнь запроса ----------------
  // Зависимости ([]  — пустой массив) означают:
  //   "выполни ОДИН РАЗ, когда компонент смонтировался".
  // Сюда НЕ попадает перерисовка из-за setCart/setQuery и т.п.
  //
  // ⚠️ В dev-режиме со StrictMode эффект выполнится 2 раза —
  // это намеренное поведение React для поиска багов. Запрос к
  // dummyjson улетит дважды — это нормально и бесплатно.
  useEffect(() => {
    let cancelled = false // флаг "компонент уже размонтирован"

    // Внутри эффекта нельзя сделать await напрямую, поэтому —
    // оборачиваем в анонимную async-функцию и сразу вызываем её.
    ;(async () => {
      try {
        const data = await getProducts()          // 1. ждём ответ от API
        if (!cancelled) setProducts(data.products) // 2. кладём товары в state
      } catch (err) {
        if (!cancelled) setError(err.message)      // 3. если что-то сломалось
      } finally {
        if (!cancelled) setLoading(false)          // 4. загрузка завершена в любом случае
      }
    })()

    // Cleanup-функция: React зовёт её при размонтировании
    // (или перед повторным запуском эффекта). Защита от утечек.
    return () => { cancelled = true }
  }, []) // пустые скобки — "один раз за жизнь компонента"

  // ---------------- handleClick: корзина ----------------
  // Кнопка в карточке зовёт onToggle -> сюда.
  // Правило React: стейт нельзя менять "на месте" — нужно отдать
  // НОВЫЙ объект. Поэтому копируем Set, меняем копию, возвращаем её.
  function handleToggleCart(id) {
    setCart((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id) // уже есть — убираем (toggle)
      else next.add(id)                 // нет — добавляем
      return next
    })
  }

  // ---------------- локальный поиск ----------------
  // Фильтруем УЖЕ загруженные товары по названию.
  // query меняется из onChange поля ввода (см. ниже).
  const queryLower = query.trim().toLowerCase()
  const visibleProducts = queryLower
    ? products.filter((p) => p.title.toLowerCase().includes(queryLower))
    : products

  // ---------------- разметка ----------------
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800">
      <div className="mx-auto max-w-5xl px-4 py-8">

        {/* Шапка: название + счётчик корзины */}
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Мини-магазин</h1>
          <span className="rounded-full bg-neutral-900 px-3 py-1 text-sm text-white">
            В корзине: {cart.size}
          </span>
        </header>

        {/* Поиск: onChange — ещё один обработчик; value привязан к state */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Найти товар…"
          className="mb-6 w-full max-w-xs rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500"
        />

        {/* Загрузка */}
        {loading && (
          <p className="text-neutral-500">
            Загружаю товары… Открой DevTools → Network, чтобы увидеть запрос.
          </p>
        )}

        {/* Ошибка: механизм показан — throw в api/products.js долетает сюда */}
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Не удалось загрузить товары: {error}
          </p>
        )}

        {/* Пустой результат поиска */}
        {!loading && !error && visibleProducts.length === 0 && (
          <p className="text-neutral-500">Ничего не нашлось по запросу «{query}».</p>
        )}

        {/* Сетка товаров */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}          // key — обязателен для списков
              product={product}         // данные карточки
              inCart={cart.has(product.id)} // в корзине или нет
              onToggle={() => handleToggleCart(product.id)} // колбэк на клик
            />
          ))}
        </div>

        {/* Подпись для обучения: показываем структуру живого ответа */}
        {!loading && !error && (
          <p className="mt-8 text-xs text-neutral-400">
            Всего у dummyjson товаров: { /* total придёт только если убрать ?limit=12 */ }
            показано {visibleProducts.length}. Меняй адрес в src/api/products.js.
          </p>
        )}
      </div>
    </div>
  )
}
