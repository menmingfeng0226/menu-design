import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Menu, Category, Dish, MenuStyle, Template } from '../types';

interface MenuStore {
  currentMenu: Menu | null;
  menus: Menu[];
  templates: Template[];
  history: Menu[];
  historyIndex: number;
  selectedCategoryId: string | null;
  selectedDishId: string | null;
  isPreviewMode: boolean;
  templateUsageStats: Record<string, number>;

  setMenu: (menu: Menu) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  updateDish: (id: string, data: Partial<Dish>) => void;
  applyDishStyleToAll: (styleType: 'nameStyle' | 'priceStyle' | 'descriptionStyle', style: any) => void;
  applyDishUnitToAll: (unit: string) => void;
  addCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addDish: (categoryId: string, dish: Dish) => void;
  copyDish: (categoryId: string, dishId: string) => void;
  deleteDish: (categoryId: string, dishId: string) => void;
  moveDish: (fromCategoryId: string, toCategoryId: string, dishId: string) => void;
  reorderCategory: (fromIndex: number, toIndex: number) => void;
  reorderDish: (categoryId: string, fromIndex: number, toIndex: number) => void;
  updateStyle: (style: Partial<MenuStyle>) => void;
  saveMenu: () => void;
  loadMenu: (menuId: string) => void;
  deleteMenu: (menuId: string) => void;
  setTemplates: (templates: Template[]) => void;
  selectCategory: (id: string | null) => void;
  selectDish: (id: string | null) => void;
  setPreviewMode: (mode: boolean) => void;
  undo: () => void;
  redo: () => void;
  togglePinMenu: (menuId: string) => void;
  copyMenu: (menuId: string) => void;
  recordTemplateUsage: (templateId: string) => void;
}

export const currencyOptions = [
  { code: 'CNY', symbol: '¥', label: '人民币' },
  { code: 'USD', symbol: '$', label: '美元' },
  { code: 'EUR', symbol: '€', label: '欧元' },
  { code: 'JPY', symbol: '¥', label: '日元' },
  { code: 'GBP', symbol: '£', label: '英镑' },
  { code: 'KRW', symbol: '₩', label: '韩元' },
  { code: 'AUD', symbol: 'A$', label: '澳元' },
  { code: 'CAD', symbol: 'C$', label: '加元' },
  { code: 'HKD', symbol: 'HK$', label: '港币' },
  { code: 'SGD', symbol: 'S$', label: '新加坡元' },
  { code: 'THB', symbol: '฿', label: '泰铢' },
];

export const unitOptions = [
  { code: 'portion', label: '/份' },
  { code: '100g', label: '/100g' },
  { code: 'jin', label: '/斤' },
  { code: 'kg', label: '/kg' },
  { code: '500g', label: '/500g' },
  { code: 'plate', label: '/盘' },
  { code: 'bowl', label: '/碗' },
  { code: 'cup', label: '/杯' },
  { code: 'bottle', label: '/瓶' },
  { code: 'box', label: '/盒' },
  { code: 'piece', label: '/个' },
  { code: 'set', label: '/套' },
];

export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = currencyOptions.find(c => c.code === currencyCode);
  return currency?.symbol || '¥';
};

export const formatPrice = (price: number, currencyCode: string): string => {
  const symbol = getCurrencySymbol(currencyCode);
  const formattedPrice = price.toFixed(2);
  return `${symbol}${formattedPrice}`;
};

const defaultStyle: MenuStyle = {
  backgroundColor: '#FAF8F5',
  backgroundType: 'solid',
  fontFamily: 'Noto Sans SC',
  fontSize: 16,
  textColor: '#333333',
  layoutType: 'vertical',
  spacing: {
    categoryGap: 32,
    dishGap: 16,
  },
  pageMargin: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
  pageMarginUnit: 'mm',
  currency: 'CNY',
  backgroundMask: 'none',
  pageSize: 'A4',
};

export const useMenuStore = create<MenuStore>()(
  persist(
    (set, get) => ({
      currentMenu: null,
      menus: [],
      templates: [],
      history: [],
      historyIndex: -1,
      selectedCategoryId: null,
      selectedDishId: null,
      isPreviewMode: false,
      templateUsageStats: {},

      setMenu: (menu) => {
        const state = get();
        const newHistory = [...state.history.slice(0, state.historyIndex + 1), menu];
        
        // 同步更新 menus 数组
        let updatedMenus = [...state.menus];
        const existingIndex = updatedMenus.findIndex(m => m.id === menu.id);
        if (existingIndex >= 0) {
          updatedMenus[existingIndex] = menu;
        }
        
        set({
          currentMenu: menu,
          menus: updatedMenus,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      updateCategory: (id, data) => {
        const { currentMenu, setMenu } = get();
        if (!currentMenu) return;

        const updatedCategories = currentMenu.categories.map(cat =>
          cat.id === id ? { ...cat, ...data } : cat
        );

        const updatedMenu = { ...currentMenu, categories: updatedCategories };
        setMenu(updatedMenu);
      },

      updateDish: (id, data) => {
        const { currentMenu, setMenu } = get();
        if (!currentMenu) return;

        const updatedCategories = currentMenu.categories.map(cat => ({
          ...cat,
          dishes: cat.dishes.map(dish =>
            dish.id === id ? { ...dish, ...data } : dish
          ),
        }));

        const updatedMenu = { ...currentMenu, categories: updatedCategories };
        setMenu(updatedMenu);
      },

      applyDishStyleToAll: (styleType, style) => {
        const { currentMenu, setMenu } = get();
        if (!currentMenu) return;

        const updatedCategories = currentMenu.categories.map(cat => ({
          ...cat,
          dishes: cat.dishes.map(dish => {
            const updatedDish = { ...dish };
            if (style === undefined || (style && !style.fontFamily && !style.fontSize && !style.textColor)) {
              delete updatedDish[styleType];
            } else {
              updatedDish[styleType] = style;
            }
            return updatedDish;
          }),
        }));

        const updatedMenu = { ...currentMenu, categories: updatedCategories };
        setMenu(updatedMenu);
      },

      applyDishUnitToAll: (unit) => {
        const { currentMenu, setMenu } = get();
        if (!currentMenu) return;

        const updatedCategories = currentMenu.categories.map(cat => ({
          ...cat,
          dishes: cat.dishes.map(dish => ({
            ...dish,
            unit: unit,
          })),
        }));

        const updatedMenu = { ...currentMenu, categories: updatedCategories };
        setMenu(updatedMenu);
      },

      addCategory: (category) => {
        const { currentMenu, setMenu } = get();
        if (!currentMenu) return;

        const updatedMenu = {
          ...currentMenu,
          categories: [...currentMenu.categories, category],
        };
        setMenu(updatedMenu);
      },

      deleteCategory: (id) => {
        const { currentMenu, setMenu } = get();
        if (!currentMenu) return;

        const updatedMenu = {
          ...currentMenu,
          categories: currentMenu.categories.filter(cat => cat.id !== id),
        };
        setMenu(updatedMenu);
      },

      addDish: (categoryId, dish) => {
        const { currentMenu, setMenu } = get();
        if (!currentMenu) return;

        const updatedCategories = currentMenu.categories.map(cat =>
          cat.id === categoryId
            ? { ...cat, dishes: [...cat.dishes, dish] }
            : cat
        );

        const updatedMenu = { ...currentMenu, categories: updatedCategories };
        setMenu(updatedMenu);
      },

      copyDish: (categoryId, dishId) => {
        const { currentMenu, setMenu } = get();
        if (!currentMenu) return;

        const updatedCategories = currentMenu.categories.map(cat => {
          if (cat.id === categoryId) {
            const dish = cat.dishes.find(d => d.id === dishId);
            if (dish) {
              const newDish: Dish = {
                ...dish,
                id: crypto.randomUUID(),
                name: `${dish.name} (副本)`,
                // 确保价格字符串也被复制
                priceString: dish.priceString || dish.price.toString(),
                originalPriceString: dish.originalPriceString || (dish.originalPrice ? dish.originalPrice.toString() : undefined),
              };
              return { ...cat, dishes: [...cat.dishes, newDish] };
            }
          }
          return cat;
        });

        const updatedMenu = { ...currentMenu, categories: updatedCategories };
        setMenu(updatedMenu);
      },

      deleteDish: (categoryId, dishId) => {
        const { currentMenu, setMenu } = get();
        if (!currentMenu) return;

        const updatedCategories = currentMenu.categories.map(cat =>
          cat.id === categoryId
            ? { ...cat, dishes: cat.dishes.filter(dish => dish.id !== dishId) }
            : cat
        );

        const updatedMenu = { ...currentMenu, categories: updatedCategories };
        setMenu(updatedMenu);
      },

      moveDish: (fromCategoryId, toCategoryId, dishId) => {
        const { currentMenu, setMenu } = get();
        if (!currentMenu) return;

        let movedDish: Dish | null = null;
        const intermediateCategories = currentMenu.categories.map(cat => {
          if (cat.id === fromCategoryId) {
            const dish = cat.dishes.find(d => d.id === dishId);
            if (dish) movedDish = dish;
            return { ...cat, dishes: cat.dishes.filter(d => d.id !== dishId) };
          }
          return cat;
        });

        if (!movedDish) return;

        const updatedCategories = intermediateCategories.map(cat =>
          cat.id === toCategoryId
            ? { ...cat, dishes: [...cat.dishes, movedDish!] }
            : cat
        );

        const updatedMenu = { ...currentMenu, categories: updatedCategories };
        setMenu(updatedMenu);
      },

      reorderCategory: (fromIndex, toIndex) => {
        const { currentMenu, setMenu } = get();
        if (!currentMenu) return;

        const categories = [...currentMenu.categories];
        const [removed] = categories.splice(fromIndex, 1);
        categories.splice(toIndex, 0, removed);

        const updatedMenu = { ...currentMenu, categories };
        setMenu(updatedMenu);
      },

      reorderDish: (categoryId, fromIndex, toIndex) => {
        const { currentMenu, setMenu } = get();
        if (!currentMenu) return;

        const updatedCategories = currentMenu.categories.map(cat => {
          if (cat.id === categoryId) {
            const dishes = [...cat.dishes];
            const [removed] = dishes.splice(fromIndex, 1);
            dishes.splice(toIndex, 0, removed);
            return { ...cat, dishes };
          }
          return cat;
        });

        const updatedMenu = { ...currentMenu, categories: updatedCategories };
        setMenu(updatedMenu);
      },

      updateStyle: (style) => {
        const { currentMenu, setMenu } = get();
        if (!currentMenu) return;

        const updatedMenu = {
          ...currentMenu,
          style: { ...currentMenu.style, ...style },
        };
        setMenu(updatedMenu);
      },

      saveMenu: () => {
        const { currentMenu, menus } = get();
        if (!currentMenu) return;

        const existingIndex = menus.findIndex(m => m.id === currentMenu.id);
        if (existingIndex >= 0) {
          const updatedMenus = [...menus];
          updatedMenus[existingIndex] = { ...currentMenu, updatedAt: new Date() };
          set({ menus: updatedMenus });
        } else {
          set({ menus: [...menus, { ...currentMenu, createdAt: new Date(), updatedAt: new Date() }] });
        }
      },

      loadMenu: (menuId) => {
        const { menus, setMenu } = get();
        const menu = menus.find(m => m.id === menuId);
        if (menu) {
          setMenu(menu);
        }
      },

      deleteMenu: (menuId) => {
        const { menus } = get();
        set({ menus: menus.filter(m => m.id !== menuId) });
      },

      setTemplates: (templates) => {
        set({ templates });
      },

      selectCategory: (id) => {
        set({ selectedCategoryId: id });
      },

      selectDish: (id) => {
        set({ selectedDishId: id });
      },

      setPreviewMode: (mode) => {
        set({ isPreviewMode: mode });
      },

      undo: () => {
        const { history, historyIndex, menus } = get();
        if (historyIndex > 0) {
          const previousMenu = history[historyIndex - 1];
          const updatedMenus = menus.map(m => m.id === previousMenu.id ? previousMenu : m);
          set({
            currentMenu: previousMenu,
            history: history,
            historyIndex: historyIndex - 1,
            menus: updatedMenus,
          });
        }
      },

      togglePinMenu: (menuId) => {
        const { menus } = get();
        const updatedMenus = menus.map(menu => {
          if (menu.id === menuId) {
            return {
              ...menu,
              pinned: !menu.pinned,
              pinnedAt: !menu.pinned ? new Date() : undefined,
            };
          }
          return menu;
        });
        set({ menus: updatedMenus });
      },

      copyMenu: (menuId) => {
        const { menus } = get();
        const menuToCopy = menus.find(m => m.id === menuId);
        if (!menuToCopy) return;

        const newMenu: Menu = {
          ...menuToCopy,
          id: `menu-${Date.now()}`,
          name: `${menuToCopy.name} (副本)`,
          createdAt: new Date(),
          updatedAt: new Date(),
          viewCount: 0,
          pinned: false,
          pinnedAt: undefined,
          categories: menuToCopy.categories.map(cat => ({
            ...cat,
            id: `cat-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
            dishes: cat.dishes.map(dish => ({
              ...dish,
              id: `dish-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
            })),
          })),
        };

        set({ menus: [...menus, newMenu] });
      },

      redo: () => {
        const { history, historyIndex, menus } = get();
        if (historyIndex < history.length - 1) {
          const nextMenu = history[historyIndex + 1];
          const updatedMenus = menus.map(m => m.id === nextMenu.id ? nextMenu : m);
          set({
            currentMenu: nextMenu,
            history: history,
            historyIndex: historyIndex + 1,
            menus: updatedMenus,
          });
        }
      },

      recordTemplateUsage: (templateId) => {
        const { templateUsageStats } = get();
        const current = templateUsageStats[templateId] || 0;
        set({
          templateUsageStats: {
            ...templateUsageStats,
            [templateId]: current + 1,
          },
        });
      },
    }),
    {
      name: 'menu-storage',
      partialize: (state) => ({
        menus: state.menus,
        templates: state.templates,
        history: state.history,
        historyIndex: state.historyIndex,
        templateUsageStats: state.templateUsageStats,
      }),
    }
  )
);

export const createNewMenu = (templateId: string, templateStyle: MenuStyle): Menu => {
  return {
    id: `menu-${Date.now()}`,
    name: '我的菜单',
    templateId,
    style: { ...templateStyle },
    categories: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    viewCount: 0,
  };
};

export const createNewMenuFromTemplate = (template: Template): Menu => {
  const now = new Date();
  const initialContent = template.initialContent;
  const categories: Category[] = initialContent.categories.map((cat, catIndex) => ({
    ...cat,
    id: `cat-${Date.now()}-${catIndex}`,
    order: catIndex,
    dishes: cat.dishes.map((dish, dishIndex) => ({
      ...dish,
      id: `dish-${Date.now()}-${catIndex}-${dishIndex}`,
      order: dishIndex,
      unit: dish.unit || 'portion',
      // 添加价格字符串，与模板中的价格保持一致格式
      priceString: dish.priceString || dish.price.toString(),
      originalPriceString: dish.originalPriceString || (dish.originalPrice ? dish.originalPrice.toString() : undefined),
    })),
  }));

  // 合并默认样式和模板样式，确保包含所有必需字段
  const templateStyle: MenuStyle = {
    ...defaultStyle,
    ...template.style,
    spacing: {
      ...defaultStyle.spacing,
      ...template.style.spacing,
    },
    pageMargin: {
      ...defaultStyle.pageMargin,
      ...(template.style as any).pageMargin,
    },
  };
  
  // 确保背景图片在正确的字段中
  if (template.style.backgroundType === 'image' && template.style.backgroundColor && !template.style.backgroundImage) {
    templateStyle.backgroundImage = template.style.backgroundColor;
  }
  // 确保有背景遮罩来增强对比度
  if (template.style.backgroundType === 'image' && !template.style.backgroundMask) {
    templateStyle.backgroundMask = 'rgba(0,0,0,0.3)';
  }

  return {
    id: `menu-${Date.now()}`,
    name: initialContent.menuName,
    templateId: template.id,
    style: templateStyle,
    categories,
    createdAt: now,
    updatedAt: now,
    viewCount: 0,
  };
};

export const createNewCategory = (name: string): Category => {
  return {
    id: `cat-${Date.now()}`,
    name,
    dishes: [],
    order: 0,
  };
};

export const createNewDish = (name: string, price: number): Dish => {
  return {
    id: `dish-${Date.now()}`,
    name,
    price,
    priceString: price.toString(),
    unit: 'portion',
    order: 0,
  };
};

export { defaultStyle };
