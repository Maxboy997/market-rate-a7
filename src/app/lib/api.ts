export async function fetchProducts() {
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/bazardor/products", {
      cache: "no-store"
    })
    const data = await res.json()

    if (Array.isArray(data)) return data
    if (data?.data && Array.isArray(data.data)) return data.data
    if (data?.products && Array.isArray(data.products)) return data.products

    return []
  } catch (err) {
    return []
  }
}