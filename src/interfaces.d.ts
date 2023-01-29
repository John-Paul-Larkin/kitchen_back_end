interface OrderDetails {
  orderId: string;
  tableNumber: string;
  timeOrderPlaced: number | null;
  server: string;
  orderItemDetails: MenuItem[];
  orderStatus: OrderStatus;
}

type OrderStatus =  "pending" | "time up" | "ready" | "closed";

type Station = "bar" | "salad" | "fry" | "grill" | "expeditor";

interface MenuItem {
  name: string;
  price: number;
  itemId: string;
  ingredients: Ingredients[];
  isSentToKitchen?: boolean;
  station: Station;
  // orderID?: string;
}
interface Ingredients {
  ingredient: Ingredient;
  selected: boolean;
  added?: boolean;
  ingredientId?: string;
}

type Ingredient =
  | "White bread"
  | "Butter"
  | "Bacon"
  | "Lettuce"
  | "Tomato"
  | "Cheese"
  | "Onion"
  | "Chicken"
  | "Ham"
  | "Mayo"
  | "Pepper sauce"
  | "Onion rings"
  | "Ketchup"
  | "Fried onions"
  | "Parmesan"
  | "Croutons"
  | "Blue cheese dip"
  | "Side salad"
  | "Celery"
  | "Mushy peas"
  | "Lemon"
  | "Dill sauce"
  | "Pastry"
  | "Gravy"
  | "Mushrooms";

//backend only

interface ContextProvider {
  selectedStation: Station;
  setSelectedStation: React.Dispatch<React.SetStateAction<Station>>;
}
