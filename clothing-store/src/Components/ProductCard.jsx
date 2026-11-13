import React from 'react'
import { Link } from 'react-router-dom';
import { products } from '../Javascript/products'
import { HouseWifi } from 'lucide-react';
import { Heart } from 'lucide-react';
const ProductCard = ({ item }) => {
  //final discount
  const totaldiscount = item.price - (item.price * item.discount /100);
  return (
    <div className="rounded overflow-hidden w-full ">
      <div className="relative">
      <Link to={`/products/${item.id}`}>
      <img src={item.image} className='w-full aspect-[3/4] object-cover' />
        {item.isnew && (
          <p className='py-1 px-2 bg-black border rounded-full overflow-hidden text-white absolute bottom-1 '>New Arrivale</p>
        )}
        </Link>
      </div>
      <div className="py-2 px-1">
        <p className='text-sm font-semibold py-1'>{item.brand}</p>
        <h1 className='text-sm md:text-lg font-medium'>{item.name}</h1>
        <div className="flex gap-2">
        {item.discount > 0 && (
          <h2 className='text-lg text-green-700 font-semibold'>${totaldiscount.toFixed(2)}</h2>
          )}
          {item.discount > 0 && (
            <span className='text-lg text-red-700 font-semibold'>-{item.discount}%</span>
          )}
          {item.price && (
            <h2 className='text-lg text-green-700 font-semibold'>${item.price.toFixed(2)}</h2>
          )}
        </div>
      </div>
    </div>
  )
}
export default ProductCard;
