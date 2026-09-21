import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import type { Product, productType } from "../types/productType";

const productRef = collection(db, "products");

export const addProduct = async (product: productType) => {
  const docRef = await addDoc(productRef, product);
  return docRef.id;
};

const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(productRef);

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Partial<Product>;

    return {
      id: doc.id,
      title: data.title ?? "Untitled Product",
      price: Number(data.price ?? 0),
      category: data.category ?? "General",
      description: data.description ?? "No description available",
      location: data.location ?? "Unknown location",
      imageUrl: data.imageUrl ?? "",
      sellerId: data.sellerId ?? "unknown",
    }; 
  });
};

export default getProducts;