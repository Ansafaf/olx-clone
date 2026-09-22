import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { Product, productType } from "../types/productType";

const productRef = collection(db, "products");

const mapProduct = (docSnapshot: { id: string; data: () => Record<string, unknown> }): Product => {
  const data = docSnapshot.data() as Partial<Product>;

  return {
    id: docSnapshot.id,
    title: data.title ?? "Untitled Product",
    price: Number(data.price ?? 0),
    category: data.category ?? "General",
    description: data.description ?? "No description available",
    location: data.location ?? "Unknown location",
    imageUrl: data.imageUrl ?? "",
    sellerId: data.sellerId ?? "unknown",
  };
};

export const addProduct = async (product: productType) => {
  const docRef = await addDoc(productRef, product);
  return docRef.id;
};

export const getProductById = async (productId: string): Promise<Product | null> => {
  const productDoc = await getDoc(doc(db, "products", productId));

  if (!productDoc.exists()) {
    return null;
  }

  return mapProduct({ id: productDoc.id, data: ()=> productDoc.data() });
};

export const updateProduct = async (productId: string, updates: Partial<productType>) =>{
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, updates);
}

const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(productRef);

  return snapshot.docs.map((docSnapshot) => mapProduct(docSnapshot));
};

export default getProducts;