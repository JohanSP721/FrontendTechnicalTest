import { useSuborderProducts } from "../hooks/useSuborderProducts";

import "../assets/styles/components/SuborderProductsItem.css";

export const SuborderProductItem = ({product, setSuborderState, suborderState, products}) =>
{
	const {
		inputRef,
		onChange,
		inputValue,
		selectRef,
		selectValue,
		unselectedProducts
	} = useSuborderProducts({product, setSuborderState, suborderState, products});

	return (
		<>
			<div className="product__form">
				<label htmlFor="product">Producto:</label>
				<select value={selectValue} ref={selectRef} onChange={onChange} name="productId" id="product">
					{
						products.map(productMapped =>
							<option
								disabled={!unselectedProducts.includes(productMapped)}
								key={productMapped.id}
								value={productMapped.id}
							>
								{productMapped.name}
							</option>
						)
					}
				</select>
			</div>
			<div className="product__form">
				<label htmlFor="amount">Cantidad:</label>
				<input value={inputValue} ref={inputRef} onChange={onChange} type="number" name="amount" id="amount" />
			</div>
		</>
	)
};
