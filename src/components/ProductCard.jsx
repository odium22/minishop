// ============================================================
//  ProductCard — "карточка товара".
//
//  Важно: этот компонент сам ничего не знает об API и не хранит
//  состояние. Он — "чистая витрина": получил данные через props,
//  показал их, нажатие передал наверх через onToggle.
//  Именно так и принято делить UI и логику.
//
//  props приходят так:
//    product  -> объект {id, title, price, thumbnail, ...}
//    inCart   -> true/false (уже в корзине?)
//    onToggle -> функция, которую дернём по клику
// ============================================================

export default function ProductCard({ product, inCart, onToggle }) {
  return (
    <article className="flex flex-col rounded-xl border border-neutral-200 bg-white p-3">
      {/* Картинка: thumbnail — готовая миниатюра из API (уже 150px) */}
      <img
        src={product.thumbnail}
        alt={product.title}
        className="mb-3 h-40 w-full rounded-lg bg-neutral-100 object-cover"
      />

      {/* Название: line-clamp-2 обрезает длинные заголовки в 2 строки */}
      <h2 className="mb-1 text-sm font-medium leading-snug line-clamp-2">
        {product.title}
      </h2>

      {/* Цена */}
      <p className="mb-3 text-lg font-bold">${product.price}</p>

      {/* Кнопка. onClick — и есть тот самый "обработчик клика".
          Выглядит просто, но за ним скрывается цепочка:
          клик -> onToggle -> handleToggleCart -> setCart -> перерисовка */}
      <button
        type="button"
        onClick={onToggle}
        className={
          inCart
            ? 'mt-auto rounded-lg border border-neutral-300 bg-neutral-100 py-1.5 text-sm text-neutral-800 hover:bg-neutral-200'
            : 'mt-auto rounded-lg bg-neutral-900 py-1.5 text-sm text-white hover:bg-neutral-700'
        }
      >
        {inCart ? 'Убрать из корзины' : 'В корзину'}
      </button>
    </article>
  )
}
