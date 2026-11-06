// ============================================================
//  Модуль "общения с данными". Вся работа с данными вынесена
//  сюда, чтобы в компонентах не мешать логику UI и логику
//  получения данных.
// ============================================================

// подключение к типо API (нет реальных API для работы которые работали ы в рф)
import productsData from '../data/products.json'

// Если если хотите на реально поработать используйте dummyjson (через
// VPN):
//
//   const PRODUCTS_URL = 'https://dummyjson.com/products?limit=50'
//   const res = await fetch(PRODUCTS_URL)
//   if (!res.ok) throw new Error(`Сервер ответил ${res.status} ${res.statusText}`)
//   return await res.json()
//
// Структура ответа при этом будет такой же, как у локального файла:
//   { "products": [ {id, title, price, thumbnail, ...} ], "total": 50, "limit": 50, "skip": 0 }

export async function getProducts() {
  // Небольшая пауза, чтобы заглушка "Загружаю товары…" успела
  // показаться — как будто данные реально пришли по сети.
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Возвращаем данные в том же формате, что и dummyjson:
  // объект с полем products внутри.
  return productsData
}
