export type MealCategory = 'pasta' | 'rice' | 'other'

export interface Meal {
  id: string
  name: string
  category: MealCategory
  emoji: string
  photo?: string
}

export const DEFAULT_MEALS: Meal[] = [
  // ─── PASTA (25) ───────────────────────────────────────────────────────────
  {
    id: 'p1',
    name: 'Spaghetti Bolognese',
    category: 'pasta',
    emoji: '🍝',
  },
  {
    id: 'p2',
    name: 'Mac and Cheese',
    category: 'pasta',
    emoji: '🧀',
  },
  {
    id: 'p3',
    name: 'Butter Pasta with Parmesan',
    category: 'pasta',
    emoji: '🍝',
  },
  {
    id: 'p4',
    name: 'Spaghetti Carbonara',
    category: 'pasta',
    emoji: '🥚',
  },
  {
    id: 'p5',
    name: 'Penne with Tomato Sauce',
    category: 'pasta',
    emoji: '🍅',
  },
  {
    id: 'p6',
    name: 'Fettuccine Alfredo',
    category: 'pasta',
    emoji: '🍝',
  },
  {
    id: 'p7',
    name: 'Spaghetti and Meatballs',
    category: 'pasta',
    emoji: '🍖',
  },
  {
    id: 'p8',
    name: 'Chicken Orzo',
    category: 'pasta',
    emoji: '🍗',
  },
  {
    id: 'p9',
    name: 'Farfalle with Cream Sauce',
    category: 'pasta',
    emoji: '🦋',
  },
  {
    id: 'p10',
    name: 'Penne with Italian Sausage',
    category: 'pasta',
    emoji: '🌭',
  },
  {
    id: 'p11',
    name: 'Classic Lasagne',
    category: 'pasta',
    emoji: '🫕',
  },
  {
    id: 'p12',
    name: 'Gnocchi in Tomato Sauce',
    category: 'pasta',
    emoji: '🥔',
  },
  {
    id: 'p13',
    name: 'Tortellini in Broth',
    category: 'pasta',
    emoji: '🍜',
  },
  {
    id: 'p14',
    name: 'Ravioli with Brown Butter',
    category: 'pasta',
    emoji: '🧈',
  },
  {
    id: 'p15',
    name: 'Cheesy Pasta Bake',
    category: 'pasta',
    emoji: '🫕',
  },
  {
    id: 'p16',
    name: 'Fusilli with Pesto',
    category: 'pasta',
    emoji: '🌿',
  },
  {
    id: 'p17',
    name: 'Aglio e Olio',
    category: 'pasta',
    emoji: '🧄',
  },
  {
    id: 'p18',
    name: 'Pastina',
    category: 'pasta',
    emoji: '⭐',
  },
  {
    id: 'p19',
    name: 'Stuffed Pasta Shells',
    category: 'pasta',
    emoji: '🐚',
  },
  {
    id: 'p20',
    name: 'Cacio e Pepe',
    category: 'pasta',
    emoji: '🧀',
  },
  {
    id: 'p21',
    name: 'Tuna Pasta',
    category: 'pasta',
    emoji: '🐟',
  },
  {
    id: 'p22',
    name: 'Pasta Frittata',
    category: 'pasta',
    emoji: '🍳',
  },
  {
    id: 'p23',
    name: 'Macaroni Soup',
    category: 'pasta',
    emoji: '🥣',
  },
  {
    id: 'p24',
    name: 'Cream Cheese Pasta',
    category: 'pasta',
    emoji: '🧀',
  },
  {
    id: 'p25',
    name: 'Pasta with Hidden Veggie Tomato Sauce',
    category: 'pasta',
    emoji: '🍅',
  },

  // ─── RICE (25) ────────────────────────────────────────────────────────────
  {
    id: 'r1',
    name: 'Egg Fried Rice',
    category: 'rice',
    emoji: '🍳',
  },
  {
    id: 'r2',
    name: 'Chicken Fried Rice',
    category: 'rice',
    emoji: '🍚',
  },
  {
    id: 'r3',
    name: 'Butter Rice',
    category: 'rice',
    emoji: '🧈',
  },
  {
    id: 'r4',
    name: 'Simple Risotto',
    category: 'rice',
    emoji: '🫕',
  },
  {
    id: 'r5',
    name: 'Rice Pudding',
    category: 'rice',
    emoji: '🍮',
  },
  {
    id: 'r6',
    name: 'One-Pot Chicken and Rice',
    category: 'rice',
    emoji: '🍗',
  },
  {
    id: 'r7',
    name: 'Rice with Meatballs',
    category: 'rice',
    emoji: '🍖',
  },
  {
    id: 'r8',
    name: 'Teriyaki Chicken Rice Bowl',
    category: 'rice',
    emoji: '🍱',
  },
  {
    id: 'r9',
    name: 'Sausage Rice',
    category: 'rice',
    emoji: '🌭',
  },
  {
    id: 'r10',
    name: 'Fried Egg Rice Bowl',
    category: 'rice',
    emoji: '🍳',
  },
  {
    id: 'r11',
    name: 'Cheesy Rice',
    category: 'rice',
    emoji: '🧀',
  },
  {
    id: 'r12',
    name: 'Rice with Fish Fingers',
    category: 'rice',
    emoji: '🐟',
  },
  {
    id: 'r13',
    name: 'Chicken Nugget Rice Bowl',
    category: 'rice',
    emoji: '🍗',
  },
  {
    id: 'r14',
    name: 'Congee (Rice Porridge)',
    category: 'rice',
    emoji: '🥣',
  },
  {
    id: 'r15',
    name: 'Baked Chicken Rice',
    category: 'rice',
    emoji: '🫕',
  },
  {
    id: 'r16',
    name: 'Ham Fried Rice',
    category: 'rice',
    emoji: '🐷',
  },
  {
    id: 'r17',
    name: 'Rice Pilaf',
    category: 'rice',
    emoji: '🌾',
  },
  {
    id: 'r18',
    name: 'Mild Chicken Paella',
    category: 'rice',
    emoji: '🥘',
  },
  {
    id: 'r19',
    name: 'Chicken Rice Soup',
    category: 'rice',
    emoji: '🍜',
  },
  {
    id: 'r20',
    name: 'Arancini (Rice Balls)',
    category: 'rice',
    emoji: '🟡',
  },
  {
    id: 'r21',
    name: 'Tuna Rice Bowl',
    category: 'rice',
    emoji: '🐟',
  },
  {
    id: 'r22',
    name: 'Bacon and Rice',
    category: 'rice',
    emoji: '🥓',
  },
  {
    id: 'r23',
    name: 'Coconut Rice',
    category: 'rice',
    emoji: '🥥',
  },
  {
    id: 'r24',
    name: 'Rice in Tomato Sauce',
    category: 'rice',
    emoji: '🍅',
  },
  {
    id: 'r25',
    name: 'Salmon Rice Bowl',
    category: 'rice',
    emoji: '🐠',
  },
]
