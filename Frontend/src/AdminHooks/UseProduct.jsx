// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { getProducts, addProduct, updateProduct, deleteProduct } from "../services/api";

export const useProducts = () => {
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const addMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, product }) => updateProduct(id, product),
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries(["products"]),
  });

  return {
    products: products?.data || [],
    isLoading,
    error,
    addProduct: addMutation.mutate,
    updateProduct: updateMutation.mutate,
    deleteProduct: deleteMutation.mutate,
  };
};

export default  useProducts;