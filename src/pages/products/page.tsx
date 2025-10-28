import { ChartAreaStacked } from '@/components/reusable/charts/chart-area-stack'
import ProductCard from './_components/product-card'
import { Barchart } from '@/components/reusable/charts/barchart'
import { Piechart } from '@/components/reusable/charts/piechart'

const Product = () => {
  return (
    <div>
      <ProductCard />  
      <div className='w-full my-4 grid grid-col-1 lg:md:grid-cols-3 gap-4'>
        <ChartAreaStacked />
        <Barchart />
        <Piechart/>
      </div>
            <div className='w-full my-4 grid grid-col-1 lg:md:grid-cols-3 gap-4'>
        <ChartAreaStacked />
        <Barchart />
        <Piechart/>
      </div>
            <div className='w-full my-4 grid grid-col-1 lg:md:grid-cols-3 gap-4'>
        <ChartAreaStacked />
        <Barchart />
        <Piechart/>
      </div>
    </div>
  )
}

export default Product
