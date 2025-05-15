 import { useProducts } from "../../../src/AdminHooks/UseProduct";
 import { toast } from "react-toastify";

const ProductList = () => {
  const { products, isLoading, deleteProduct } = useProducts();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      deleteProduct(id);
      toast.success("Product deleted!");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Customer Price</th>
              <th className="p-2 border">Published</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className={product.stock < 10 ? "bg-red-100" : ""}>
                <td className="p-2 border">{product.name}</td>
                <td className="p-2 border">{product.category}</td>
                <td className="p-2 border">
                  {product.stock} {product.stock < 10 && <span>(Low Stock!)</span>}
                </td>
                <td className="p-2 border">${product.customerPrice}</td>
                <td className="p-2 border">{product.isPublished ? "Yes" : "No"}</td>
                <td className="p-2 border">
                  <button
                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                    onClick={() => window.location.href = `/edit/${product.id}`}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-1 rounded"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;