export async function fetchProducts() {
      try {
          const res = await fetch("https://openapi.programming-hero.com/api/bazardor/products", {
                cache: "no-store",
                    });
                        const result = await res.json();
                            if (Array.isArray(result)) return result;
                                if (result.data && Array.isArray(result.data)) return result.data;
                                    if (result.products && Array.isArray(result.products)) return result.products;
                                        return [];
                                          } catch (error) {
                                              console.error("Error fetching products:", error);
                                                  return [];
                                                    }
                                                    }