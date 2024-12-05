import { useEffect, useState } from "react";

//custom hook to fetch products from fakestoreapi.com
function useGetProducts() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    async function getProducts(){
        try {
            let resp = await fetch("https://fakestoreapi.com/products");
            let json = await resp.json();
            setProducts(json)
        } catch (error) {
            setError(error.message)
        }
    }
    useEffect(()=>{
        getProducts();
    },[])
    return [products, error];
}

export default useGetProducts