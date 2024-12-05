import React from 'react'
import useGetProducts from '../../hooks/useGetProducts'
import ProductCard from './ProductCard';

const UserHomepage = () => {
    const [products, error] = useGetProducts();

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-yellow-500 text-3xl font-semibold text-center my-6">Products Showcase</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {
                    (!error && products.length !== 0) && products?.map(prod => (
                        <ProductCard
                            key={prod?.id}
                            title={prod?.title}
                            price={prod?.price}
                            image={prod?.image}
                        />
                    ))
                }
                {
                    error && <h1 className="text-center text-red-500 text-xl my-6">{error}</h1>
                }
            </div>

            <hr className="my-6" />
            <h4 className="text-center text-gray-600 text-lg">
                Made with ❤️
            </h4>
        </div>
    );
}

export default UserHomepage;
