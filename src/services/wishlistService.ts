import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { wishlist } from "../types/wishtlistType";

const getWishlistRef = (userId: string) => doc(db, "wishlists", userId);

export const getWishlist = async (userId: string): Promise<string[]> => {
  if (!userId) return [];

  const wishlistDoc = await getDoc(getWishlistRef(userId));

  if (!wishlistDoc.exists()) {
    return [];
  }

  const data = wishlistDoc.data() as Partial<wishlist>;
  return Array.isArray(data.productIds) ? data.productIds : [];
};

export const addToWishlist = async (userId: string, productId: string): Promise<string[]> => {
  if (!userId || !productId) return [];

  const currentWishlist = await getWishlist(userId);

  if (currentWishlist.includes(productId)) {
    return currentWishlist;
  }

  const nextWishlist = [...currentWishlist, productId];

  await setDoc(
    getWishlistRef(userId),
    {
      userId,
      productIds: nextWishlist,
    },
    { merge: true }
  );

  return nextWishlist;
};

export const removeFromWishlist = async (userId: string, productId: string): Promise<string[]> => {
  if (!userId || !productId) return [];

  const currentWishlist = await getWishlist(userId);
  const nextWishlist = currentWishlist.filter((id) => id !== productId);

  await setDoc(
    getWishlistRef(userId),
    {
      userId,
      productIds: nextWishlist,
    },
    { merge: true }
  );

  return nextWishlist;
};

export const isInWishlist = async (userId: string, productId: string): Promise<boolean> => {
  if (!userId || !productId) return false;
  const wishlist = await getWishlist(userId);
  return wishlist.includes(productId);
};

export const getCurrentUserWishlist = async (): Promise<string[]> => {
  const userId = auth.currentUser?.uid;
  if (!userId) return [];

  return getWishlist(userId);
};

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  getCurrentUserWishlist,
};