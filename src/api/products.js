// ============================================================
//  Модуль "общения с API". Вся работа с сетью вынесена сюда,
//  чтобы в компонентах не мешать логику UI и логику запросов.
// ============================================================

// ?limit=12 — dummyjson умеет отдавать не весь каталог, а порцию.
// Убери параметр — придёт всё (их там ~194 товара).
const PRODUCTS_URL = 'https://dummyjson.com/products?limit=12'

// async/await — "сахар" над Promise:
//   fetch(...)            -> возвращает Promise<Response>
//   await fetch(...)      -> ждёт ответ сервера и кладёт его в res
//   res.json()            -> тоже Promise, ждём JSON из тела ответа
//
// ВАЖНО: fetch НЕ падает при HTTP-ошибках (404, 500 и т.д.).
// Код ответа смотрим сами через res.ok / res.status.
export async function getProducts() {
  // Можешь раскомментировать строку ниже и посмотреть в консоли
  // браузера (F12 → Console), что реально приходит с сервера:
  // console.log('Отправляю запрос к', PRODUCTS_URL)

  const res = await fetch(PRODUCTS_URL)

  if (!res.ok) {
    // Превращаем "молчаливую" HTTP-ошибку в понятную строку,
    // которую потом покажем пользователю.
    throw new Error(`Сервер ответил ${res.status} ${res.statusText}`)
  }

  // Ответ dummyjson выглядит так:
  // { "products": [ {id, title, price, thumbnail, ...} ], "total": 194, "limit": 12, "skip": 0 }
  return await res.json()
}
