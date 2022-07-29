import { useEffect, useRef  } from 'react';

export const useSuborderProducts = ({product, setSuborderState, suborderState, products}) =>
{
	const inputRef = useRef(null);
	const selectRef = useRef(null);

	const unselectedProducts = products.filter(product =>
	{
		return suborderState.suborderProducts.find(productMapped => productMapped.productId === product.id) === undefined;
	});

	const selectValue = product.productId !== 0 ? product.productId : unselectedProducts[0].id;
	const inputValue = product.amount !== 0 ? product.amount : '';

	useEffect(() =>
	{
		onChange();
	}, [selectRef]);

	const onChange = () =>
	{
		const productId = parseInt(selectRef.current.value) || 0;
		const amount = parseInt(inputRef.current.value) || 0;

		setSuborderState(state =>
		{
			return {
				...state,
				suborderProducts: state.suborderProducts.map(productMapped =>
				{
					if(productMapped.position === product.position)
					{
						return {
							...productMapped,
							productId: productId,
							amount: amount,
						}
					}
					else
					{
						return productMapped;
					}
				})
			}
		});
	}

	return {
		inputRef,
		selectRef,
		unselectedProducts,
		selectValue,
		inputValue,
		onChange
	};
}
