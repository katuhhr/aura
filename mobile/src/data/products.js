// Тестовый каталог для моков. Когда появится бэкенд, этот файл не понадобится.
// images пустые — вместо фото рисуется заглушка (см. components/ProductImage.jsx).

export const CATEGORIES = ['Women', 'Men', 'Footwear', 'Accessories']

const CLOTHES = ['XS', 'S', 'M', 'L', 'XL']
const SHOES = ['36', '37', '38', '39', '40', '41', '42', '43']

const black = { name: 'Чёрный', hex: '#1f1a1a' }
const cream = { name: 'Молочный', hex: '#efe6da' }
const burgundy = { name: 'Бордовый', hex: '#6b1a2a' }
const beige = { name: 'Бежевый', hex: '#cdb89f' }
const grey = { name: 'Серый', hex: '#9a9a9a' }
const navy = { name: 'Тёмно-синий', hex: '#27324a' }
const brown = { name: 'Коричневый', hex: '#6a4a36' }

export const products = [
  {
    id: 1, name: 'Платье миди из вискозы', category: 'Women', price: 6990,
    description: 'Струящееся платье длины миди с запахом и поясом. Мягкая вискоза не мнётся и приятна к телу, силуэт подчёркивает талию.',
    sizes: CLOTHES, colors: [burgundy, black], images: [],
  },
  {
    id: 2, name: 'Пальто шерстяное оверсайз', category: 'Women', price: 18990,
    description: 'Двубортное пальто свободного кроя из шерсти с добавлением кашемира. Спущенная линия плеча, подкладка, два прорезных кармана.',
    sizes: CLOTHES, colors: [beige, black, grey], images: [],
  },
  {
    id: 3, name: 'Блуза шёлковая', category: 'Women', price: 5490,
    description: 'Лаконичная блуза прямого кроя из шёлка с матовым блеском. Потайная застёжка, манжеты на двух пуговицах.',
    sizes: CLOTHES, colors: [cream, burgundy], images: [],
  },
  {
    id: 4, name: 'Рубашка оксфорд', category: 'Men', price: 4290,
    description: 'Классическая рубашка из плотного хлопка оксфорд. Воротник на пуговицах, нагрудный карман, прямой крой.',
    sizes: CLOTHES, colors: [cream, navy], images: [],
  },
  {
    id: 5, name: 'Джемпер из мериноса', category: 'Men', price: 7990,
    description: 'Тонкий джемпер из шерсти мериноса с круглым вырезом. Хорошо держит тепло и не колется, подходит под пиджак.',
    sizes: CLOTHES, colors: [grey, navy, burgundy], images: [],
  },
  {
    id: 6, name: 'Брюки чинос', category: 'Men', price: 5290,
    description: 'Зауженные чинос из хлопкового твила с небольшим добавлением эластана. Средняя посадка, боковые и задние карманы.',
    sizes: CLOTHES, colors: [beige, black, navy], images: [],
  },
  {
    id: 7, name: 'Кеды кожаные', category: 'Footwear', price: 8990,
    description: 'Минималистичные кеды из гладкой кожи на прошитой резиновой подошве. Кожаная стелька, вощёные шнурки.',
    sizes: SHOES, colors: [cream, black], images: [],
  },
  {
    id: 8, name: 'Ботинки челси', category: 'Footwear', price: 12990,
    description: 'Челси из замши с эластичными вставками и петлёй на заднике. Устойчивый каблук, рифлёная подошва.',
    sizes: SHOES, colors: [brown, black], images: [],
  },
  {
    id: 9, name: 'Лоферы классические', category: 'Footwear', price: 10490,
    description: 'Лоферы из полированной кожи с перемычкой. Мягкий задник, кожаная подкладка, тонкая подошва.',
    sizes: SHOES, colors: [burgundy, black], images: [],
  },
  {
    id: 10, name: 'Сумка-тоут кожаная', category: 'Accessories', price: 14990,
    description: 'Вместительная сумка из зернистой кожи с внутренним карманом на молнии. Вмещает ноутбук до 14 дюймов.',
    sizes: [], colors: [black, burgundy, brown], images: [],
  },
  {
    id: 11, name: 'Шарф кашемировый', category: 'Accessories', price: 6490,
    description: 'Мягкий шарф из чистого кашемира с бахромой по краям. Размер 180 × 30 см.',
    sizes: [], colors: [beige, grey, burgundy], images: [],
  },
  {
    id: 12, name: 'Ремень кожаный', category: 'Accessories', price: 3490,
    description: 'Ремень шириной 3 см из натуральной кожи с матовой пряжкой.',
    sizes: ['85', '95', '105'], colors: [black, brown], images: [],
  },
]
