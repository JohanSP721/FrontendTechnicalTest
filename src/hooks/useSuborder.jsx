import { useState, useEffect } from 'react';

export const useSuborder = ({setState, postStarted, position, id, products}) =>
{
	const [suborderState, setSuborderState] = useState({
		suborderProducts: [{ position: 1, productId: 0, amount: 0 }],
		quantityProducts: 1,
		total: 0,
		approvedGratuity: 0,
		edit: false,
	});

	const apiUrlBase = import.meta.env.VITE_API_URL;

	const formatter = new Intl.NumberFormat('es-ES');

	useEffect(() =>
	{
		setSuborderState(state =>
		{
			return {
				...state,
				total: state.suborderProducts.reduce((total, product) =>
				{
					const productFind = products.find(p => p.id === product.productId);

					productFind && (total += productFind.price * product.amount);

					return product.amount !== 0 ? total : 0;
				}, 0),
				approvedGratuity: state.suborderProducts.reduce((approvedGratuity, product) =>
				{
					const productFind = products.find(p => p.id === product.productId);;

					productFind && (approvedGratuity += (productFind.price * product.amount) * 0.1);

					return product.amount !== 0 ? approvedGratuity : 0
				}, 0),
			}
		});
	}, [suborderState.suborderProducts]);

	useEffect(() =>
	{
		setState(state =>
		{
			return {
				...state,
				suborders: state.suborders.map(suborder =>
				{
					if (suborder.position === position)
					{
						return {
							...suborder,
							total: suborderState.total,
							approvedGratuity: suborderState.approvedGratuity,
						}
					}

					else
					{
						return suborder;
					}
				}),
			}
		});
	}, [suborderState.total, suborderState.approvedGratuity]);

	useEffect(() =>
	{
		if(postStarted)
		{
			setSuborderState(state =>
			{
				return {
					...state,
					edit: true,
				}
			});
		}

		if(id !== 0)
		{
			try
			{
				suborderState.suborderProducts.forEach(async suborderProduct =>
				{
					await fetch(`${apiUrlBase}/suborders-products`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							suborderId: id,
							productId: suborderProduct.productId,
							amount: suborderProduct.amount,
						})
					});
				});

				setState(state =>
				{
					return {
						...state,
						postStarted: false,
						postCompleted: true
					}
				});
			}

			catch (error)
			{
				setState(state =>
				{
					return {
						...state,
						error: error
					}
				});
			}
		}
	}, [id]);

	const addProduct = () =>
	{
		if(suborderState.quantityProducts < products.length)
		{
			setSuborderState(state =>
			{
				return {
					...state,
					quantityProducts: state.quantityProducts + 1,
					suborderProducts: [...state.suborderProducts, { position: state.quantityProducts + 1, productId: 0, amount: 0 }]
				}
			});
		}
	};

	const removeProduct = (position) =>
	{
		if(suborderState.quantityProducts > 1)
		{
			setSuborderState(state =>
			{
				return {
					...state,
					quantityProducts: state.quantityProducts - 1,
					suborderProducts: state.suborderProducts.filter(suborderProduct => suborderProduct.position !== position)
				}
			});
		}
	};

	const onEditChange = () =>
	{
		setSuborderState(state =>
		{
			return {
				...state,
				edit: !state.edit
			}
		});

		setState(state =>
		{
			return {
				...state,
				postStarted: false
			}
		});
	};

	return {
		suborderState,
		setSuborderState,
		addProduct,
		removeProduct,
		onEditChange,
		formatter
	};
};
