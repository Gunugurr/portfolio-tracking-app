export type Lang = "TR" | "EN" | "ES" | "RU";

export interface Strings {
  tabMarket: string;
  tabPortfolio: string;
  gainers: string;
  losers: string;
  unchanged: string;
  lastUpdated: string;
  refresh: string;
  searchPlaceholder: string;
  popularPage: string;
  searchResults: string;
  colSymbol: string;
  colCompany: string;
  colPrice: string;
  colChange: string;
  colAction: string;
  chart: string;
  add: string;
  inPortfolio: string;
  qty: string;
  buyPriceLabel: string;
  cancel: string;
  adding: string;
  addToPortfolio: string;
  noResults: string;
  colStock: string;
  colBuyPrice: string;
  colCurrentPrice: string;
  colQty: string;
  colPosition: string;
  emptyPortfolio: string;
  today: string;
  alertTitle: string;
  alertDesc: string;
  targetPrice: string;
  remove: string;
  save: string;
  alertTooltipActive: string;
  alertTooltipAdd: string;
  tickerPlaceholder: string;
  searching: string;
  noResultsShort: string;
  qtyPlaceholder: string;
  buyPricePlaceholder: string;
  addBtn: string;
  errTickerEmpty: string;
  errQtyInvalid: string;
  errPriceInvalid: string;
  topGainer: string;
  topLoser: string;
  dragHint: string;
  tagline: string;
  disclaimer: string;
  liveData: string;
  disclaimerBottom: string;
  fetchError: string;
  addedToPortfolio: string;
  alertBanner: string;
  alertNotifTitle: string;
  alertNotifBody: string;
  totalValue: string;
  dailyChange: string;
  totalPnl: string;
}

export const translations: Record<Lang, Strings> = {
  TR: {
    tabMarket: "Piyasa",
    tabPortfolio: "Portföyüm",
    gainers: "Artanlar",
    losers: "Azalanlar",
    unchanged: "Sabit",
    lastUpdated: "Son güncelleme:",
    refresh: "Yenile",
    searchPlaceholder: "Hisse ara... (örn. AAPL, Tesla)",
    popularPage: "En Popüler 50 Hisse — Sayfa {page} / {total}",
    searchResults: "Arama Sonuçları",
    colSymbol: "Sembol",
    colCompany: "Şirket",
    colPrice: "Fiyat",
    colChange: "Değişim",
    colAction: "İşlem",
    chart: "Grafik",
    add: "Ekle",
    inPortfolio: "Portföyde ↗",
    qty: "Adet",
    buyPriceLabel: "Alış Fiyatı ($)",
    cancel: "İptal",
    adding: "Ekleniyor...",
    addToPortfolio: "Portföye Ekle",
    noResults: '"{query}" için sonuç bulunamadı.',
    colStock: "Hisse",
    colBuyPrice: "Alış Fiyatı",
    colCurrentPrice: "Anlık Fiyat",
    colQty: "Adet",
    colPosition: "Pozisyon",
    emptyPortfolio: "Henüz hisse eklemedin.",
    today: "bugün",
    alertTitle: "Fiyat Alarmı",
    alertDesc: "Fiyat bu seviyeye ulaştığında bildirim gönderilir.",
    targetPrice: "Hedef Fiyat ($)",
    remove: "Kaldır",
    save: "Kaydet",
    alertTooltipActive: "Alarm: {price}",
    alertTooltipAdd: "Fiyat alarmı ekle",
    tickerPlaceholder: "Ticker ara... (AAPL)",
    searching: "Aranıyor...",
    noResultsShort: "Sonuç bulunamadı.",
    qtyPlaceholder: "Adet",
    buyPricePlaceholder: "Alış fiyatı",
    addBtn: "+ EKLE",
    errTickerEmpty: "Ticker boş olamaz.",
    errQtyInvalid: "Adet 0'dan büyük olmalı.",
    errPriceInvalid: "Alış fiyatı 0'dan büyük olmalı.",
    topGainer: "Günün Yıldızı",
    topLoser: "Günün Kaybedeni",
    dragHint: "· sürükle / köşeden boyutlandır",
    tagline: "kişisel hisse izleme aracı",
    disclaimer: "Piyasa verisi Finnhub tarafından sağlanır. Veriler 15 dk gecikmeli olabilir. Bu uygulama yatırım tavsiyesi niteliği taşımaz.",
    liveData: "canlı veri aktif",
    disclaimerBottom: "Veriler yalnızca bilgi amaçlıdır. Yatırım kararları için profesyonel danışmanlık alınız.",
    fetchError: "Veri çekilemedi, tekrar dene.",
    addedToPortfolio: "{sym} portföye eklendi.",
    alertBanner: "{sym} hedef fiyata ulaştı! Hedef: {target} → Şu an: {price}",
    alertNotifTitle: "{sym} hedefe ulaştı!",
    alertNotifBody: "Hedef: {target} → Şu an: {price}",
    totalValue: "Toplam Değer",
    dailyChange: "Günlük Değişim",
    totalPnl: "Toplam P&L",
  },
  EN: {
    tabMarket: "Market",
    tabPortfolio: "My Portfolio",
    gainers: "Gainers",
    losers: "Losers",
    unchanged: "Unchanged",
    lastUpdated: "Last updated:",
    refresh: "Refresh",
    searchPlaceholder: "Search stocks... (e.g. AAPL, Tesla)",
    popularPage: "Top 50 Stocks — Page {page} / {total}",
    searchResults: "Search Results",
    colSymbol: "Symbol",
    colCompany: "Company",
    colPrice: "Price",
    colChange: "Change",
    colAction: "Action",
    chart: "Chart",
    add: "Add",
    inPortfolio: "In Portfolio ↗",
    qty: "Quantity",
    buyPriceLabel: "Buy Price ($)",
    cancel: "Cancel",
    adding: "Adding...",
    addToPortfolio: "Add to Portfolio",
    noResults: 'No results for "{query}".',
    colStock: "Stock",
    colBuyPrice: "Buy Price",
    colCurrentPrice: "Cur. Price",
    colQty: "Qty",
    colPosition: "Position",
    emptyPortfolio: "No stocks added yet.",
    today: "today",
    alertTitle: "Price Alert",
    alertDesc: "You will be notified when the price reaches this level.",
    targetPrice: "Target Price ($)",
    remove: "Remove",
    save: "Save",
    alertTooltipActive: "Alert: {price}",
    alertTooltipAdd: "Add price alert",
    tickerPlaceholder: "Search ticker... (AAPL)",
    searching: "Searching...",
    noResultsShort: "No results found.",
    qtyPlaceholder: "Quantity",
    buyPricePlaceholder: "Buy price",
    addBtn: "+ ADD",
    errTickerEmpty: "Ticker cannot be empty.",
    errQtyInvalid: "Quantity must be greater than 0.",
    errPriceInvalid: "Buy price must be greater than 0.",
    topGainer: "Top Gainer",
    topLoser: "Top Loser",
    dragHint: "· drag / resize from corner",
    tagline: "personal stock tracker",
    disclaimer: "Market data provided by Finnhub. Data may be delayed up to 15 min. This app does not constitute investment advice.",
    liveData: "live data active",
    disclaimerBottom: "Data is for informational purposes only. Consult a professional before making investment decisions.",
    fetchError: "Could not fetch data, please try again.",
    addedToPortfolio: "{sym} added to portfolio.",
    alertBanner: "{sym} reached its target! Target: {target} → Now: {price}",
    alertNotifTitle: "{sym} reached target!",
    alertNotifBody: "Target: {target} → Now: {price}",
    totalValue: "Total Value",
    dailyChange: "Daily Change",
    totalPnl: "Total P&L",
  },
  ES: {
    tabMarket: "Mercado",
    tabPortfolio: "Mi Cartera",
    gainers: "Alzas",
    losers: "Bajas",
    unchanged: "Sin cambio",
    lastUpdated: "Actualizado:",
    refresh: "Actualizar",
    searchPlaceholder: "Buscar acciones... (ej. AAPL, Tesla)",
    popularPage: "Top 50 Acciones — Página {page} / {total}",
    searchResults: "Resultados",
    colSymbol: "Símbolo",
    colCompany: "Empresa",
    colPrice: "Precio",
    colChange: "Cambio",
    colAction: "Acción",
    chart: "Gráfico",
    add: "Agregar",
    inPortfolio: "En cartera ↗",
    qty: "Cantidad",
    buyPriceLabel: "Precio de compra ($)",
    cancel: "Cancelar",
    adding: "Agregando...",
    addToPortfolio: "Agregar a cartera",
    noResults: 'Sin resultados para "{query}".',
    colStock: "Acción",
    colBuyPrice: "P. Compra",
    colCurrentPrice: "P. Actual",
    colQty: "Cant.",
    colPosition: "Posición",
    emptyPortfolio: "No hay acciones aún.",
    today: "hoy",
    alertTitle: "Alerta de precio",
    alertDesc: "Serás notificado cuando el precio alcance este nivel.",
    targetPrice: "Precio objetivo ($)",
    remove: "Eliminar",
    save: "Guardar",
    alertTooltipActive: "Alerta: {price}",
    alertTooltipAdd: "Añadir alerta de precio",
    tickerPlaceholder: "Buscar ticker... (AAPL)",
    searching: "Buscando...",
    noResultsShort: "Sin resultados.",
    qtyPlaceholder: "Cantidad",
    buyPricePlaceholder: "Precio de compra",
    addBtn: "+ AGREGAR",
    errTickerEmpty: "El ticker no puede estar vacío.",
    errQtyInvalid: "La cantidad debe ser mayor que 0.",
    errPriceInvalid: "El precio debe ser mayor que 0.",
    topGainer: "Mayor alza del día",
    topLoser: "Mayor baja del día",
    dragHint: "· arrastra / cambia tamaño desde esquina",
    tagline: "rastreador personal de acciones",
    disclaimer: "Datos de mercado proporcionados por Finnhub. Pueden tener un retraso de 15 min. Esta app no constituye asesoramiento de inversión.",
    liveData: "datos en vivo activos",
    disclaimerBottom: "Los datos son solo informativos. Consulte a un profesional antes de invertir.",
    fetchError: "No se pudieron obtener datos, intente de nuevo.",
    addedToPortfolio: "{sym} agregado a la cartera.",
    alertBanner: "¡{sym} alcanzó su objetivo! Objetivo: {target} → Ahora: {price}",
    alertNotifTitle: "¡{sym} alcanzó el objetivo!",
    alertNotifBody: "Objetivo: {target} → Ahora: {price}",
    totalValue: "Valor total",
    dailyChange: "Cambio diario",
    totalPnl: "P&L total",
  },
  RU: {
    tabMarket: "Рынок",
    tabPortfolio: "Портфель",
    gainers: "Растут",
    losers: "Падают",
    unchanged: "Без изменений",
    lastUpdated: "Обновлено:",
    refresh: "Обновить",
    searchPlaceholder: "Поиск акций... (напр. AAPL, Tesla)",
    popularPage: "Топ 50 акций — Стр. {page} / {total}",
    searchResults: "Результаты поиска",
    colSymbol: "Тикер",
    colCompany: "Компания",
    colPrice: "Цена",
    colChange: "Изменение",
    colAction: "Действие",
    chart: "График",
    add: "Добавить",
    inPortfolio: "В портфеле ↗",
    qty: "Кол-во",
    buyPriceLabel: "Цена покупки ($)",
    cancel: "Отмена",
    adding: "Добавление...",
    addToPortfolio: "В портфель",
    noResults: 'По запросу "{query}" ничего не найдено.',
    colStock: "Акция",
    colBuyPrice: "Цена пок.",
    colCurrentPrice: "Тек. цена",
    colQty: "Кол-во",
    colPosition: "Позиция",
    emptyPortfolio: "Акции ещё не добавлены.",
    today: "сегодня",
    alertTitle: "Ценовой алерт",
    alertDesc: "Уведомление придёт, когда цена достигнет этого уровня.",
    targetPrice: "Целевая цена ($)",
    remove: "Удалить",
    save: "Сохранить",
    alertTooltipActive: "Алерт: {price}",
    alertTooltipAdd: "Добавить ценовой алерт",
    tickerPlaceholder: "Поиск тикера... (AAPL)",
    searching: "Поиск...",
    noResultsShort: "Ничего не найдено.",
    qtyPlaceholder: "Количество",
    buyPricePlaceholder: "Цена покупки",
    addBtn: "+ ДОБАВИТЬ",
    errTickerEmpty: "Тикер не может быть пустым.",
    errQtyInvalid: "Количество должно быть больше 0.",
    errPriceInvalid: "Цена должна быть больше 0.",
    topGainer: "Лидер роста",
    topLoser: "Аутсайдер дня",
    dragHint: "· перетащи / измени размер от угла",
    tagline: "персональный трекер акций",
    disclaimer: "Рыночные данные предоставлены Finnhub. Данные могут запаздывать на 15 мин. Приложение не является инвестиционной рекомендацией.",
    liveData: "данные в реальном времени",
    disclaimerBottom: "Данные носят исключительно информационный характер. Перед инвестированием проконсультируйтесь со специалистом.",
    fetchError: "Не удалось получить данные, попробуйте снова.",
    addedToPortfolio: "{sym} добавлен в портфель.",
    alertBanner: "{sym} достиг цели! Цель: {target} → Сейчас: {price}",
    alertNotifTitle: "{sym} достиг цели!",
    alertNotifBody: "Цель: {target} → Сейчас: {price}",
    totalValue: "Общая стоимость",
    dailyChange: "Изменение за день",
    totalPnl: "П&У",
  },
};

export function tFmt(str: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replace(`{${k}}`, v),
    str
  );
}
