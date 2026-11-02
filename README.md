# Мини-магазин на React + Vite + Tailwind (dummyjson)

Минимальный магазин, написанный для изучения трёх вещей:

- `useState` — «память» компонента (товары, загрузка, ошибка, корзина, поиск)
- `useEffect` — «сходи за товарами один раз при запуске»
- `handleClick` / обработчики — реакция на действия пользователя

Никаких лишних библиотек: только `react`, `react-dom`, `vite`, `tailwindcss`.

---

## Запуск

```bash
npm install      # один раз, ставит зависимости
npm run dev      # дев-сервер на http://localhost:5173
```

## Файлы — что где лежит

```
src/
  main.jsx                  точка входа, StrictMode
  index.css                 импорт Tailwind (v4, одной строкой)
  App.jsx                   ВСЯ логика: fetch, состояние, корзина, поиск
  api/products.js           модуль "общения с API" (fetch обёрнут сюда)
  components/ProductCard.jsx "чистая" карточка товара
```

---

## Как устроен механизм работы с API (и что смотреть при отладке)

### 1. Поток данных

```
[монтаж компонента]
      │  useEffect(() => {...}, [])
      ▼
 fetch("https://dummyjson.com/products?limit=12")
      │  (сеть)
      ▼
 JSON: { products: [...], total: 194, limit: 12 }
      │  setProducts(data.products)
      ▼
 [перерисовка]  → карточки на экране
      │
   клик по кнопке
      │  handleToggleCart(id)
      ▼
 setCart(новый Set)  →  [перерисовка]  →  счётчик изменился
```

### 2. Где смотреть запрос (главный инструмент отладки)

1. Запусти `npm run dev`, открой `http://localhost:5173`
2. Нажми **F12** (DevTools) → вкладка **Network**
3. Найди запрос `products?limit=12`, кликни на него:
   - **Headers** — метод `GET`, статус `200`, `Access-Control-Allow-Origin: *`
   - **Response / Preview** — сырой JSON с товарами
4. Попробуй сломать нарочно:
   - замени адрес на несуществующий (`https://dummyjson.com/products/foo`) →
     увидишь статус `404` и наш блок «Не удалось загрузить товары»
   - выключи сеть (вкладка Network → Offline) → увидишь `TypeError: Failed to fetch`

### 3. Почему в дев-режиме запрос уходит ДВАЖДЫ

`<StrictMode>` в `main.jsx` намеренно запускает каждый `useEffect` дважды
в разработке. Это фича React для поиска багов, в продакшене её нет.
Запрос к dummyjson бесплатный — можно не обращать внимания.

### 4. CORS — ошибка, которую все встречают

Если в Console видишь:

```
Access to fetch at 'https://...' from origin 'http://localhost:5173'
has been blocked by CORS policy
```

значит API не разрешает браузеру читать ответ. У dummyjson в ответе есть
`Access-Control-Allow-Origin: *`, поэтому здесь этого не будет.
С чужими API это первое, что проверяют во вкладке **Network → Headers**.

### 5. React DevTools

Поставь расширение **React Developer Tools** → вкладка «Components»:
там видно все `useState` вживую: `products`, `loading`, `cart` — и можно
менять их руками, чтобы смотреть, как перерисовывается страница.

### 6. Как экспериментировать

| Хочется | Что менять |
|---|---|
| Больше товаров | `?limit=12` → `?limit=30` или убрать параметр |
| Страница-пагинация | `?limit=12&skip=12` — вторая страница |
| Искать на сервере, а не локально | `https://dummyjson.com/products/search?q=phone` |
| Добавить товар через POST | см. доки dummyjson (методы POST/PUT/DELETE) |

---

## Дорожная карта «переписать самому за час»

1. `src/api/products.js` — обёртка над `fetch` (единственное место с сетью)
2. `App.jsx` — 5 `useState` + один `useEffect` + `handleToggleCart`
3. `ProductCard.jsx` — карточка на props
4. `index.css` — одна строка Tailwind

Каждый из четырёх кусков можно переписать руками минут за 15,
ничего не подключая дополнительно.
