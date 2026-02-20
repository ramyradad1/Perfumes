import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../hooks/useProducts';

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedSize: string) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, selectedSize: string) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.id === product.id && item.selectedSize === selectedSize
      );

      if (existingItemIndex > -1) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      }

      return [...prev, { ...product, quantity: 1, selectedSize }];
    });
  };

  const removeFromCart = (productId: string, selectedSize: string) => {
    setCart((prev) => 
      prev.filter((item) => !(item.id === productId && item.selectedSize === selectedSize))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  const cartTotal = cart.reduce((acc, item) => {
    const sizePrice = item.size_options.find(s => s.size === item.selectedSize)?.price || item.price;
    return acc + (sizePrice * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
