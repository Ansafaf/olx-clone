export type productType = {
    title: string
    price: number
    category: string
    description: string
    location: string
    imageUrl: string
    sellerId: string
}

export type Product = productType & {
    id: string
}
