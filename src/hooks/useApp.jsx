import { useState, useEffect } from 'react';

export const useApp = () =>
{
	const [state, setState] = useState({
		orderId: null,
		suborders: [],
		products: [],
		numberPeople: 0,
		postStarted: false,
		postCompleted: false,
		loading: false,
		error: null,
	});

	const apiUrlBase = import.meta.env.VITE_API_URL;

	useEffect(() =>
	{
		setState(state =>
		{
			return {
				...state,
				postStarted: false,
				loading: true,
				error: null,
			}
		});

		if (state.numberPeople > 100)
		{
			setState(state =>
			{
				return {
					...state,
					loading: false,
					error: "El numero de personas no puede ser mayor a 100"
				}
			});
		}

		else
		{
			setState(state =>
			{
				return {
					...state,
					suborders: []
				}
			});

			for (let i = 1; i <= state.numberPeople; i++)
			{
				setState(state =>
				{
					return {
						...state,
						suborders: [...state.suborders, { position: i, id: 0, total: 0, approvedGratuity: 0, }]
					}
				});
			}

			setTimeout(() =>
			{
				setState(state =>
				{
					return {
						...state,
						loading: false,
					}
				});
			}, 500);

			fetchProducts();
		}
	}, [state.numberPeople]);

	useEffect(() =>
	{
		if (state.orderId)
		{
			try
			{
				state.suborders.forEach(async (suborder) =>
				{
					const response = await fetch(`${apiUrlBase}/suborders`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							orderId: state.orderId,
							total: suborder.total,
							approvedGratuity: suborder.approvedGratuity,
						}),
					});

					const data = await response.json();

					setState(state =>
					{
						return {
							...state,
							suborders: state.suborders.map(prevSuborder =>
							{
								if(prevSuborder.position === suborder.position)
								{
									return {
										...prevSuborder,
										id: data.id
									}
								}

								return prevSuborder;
							})
						}
					});
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
	}, [state.orderId]);

	useEffect(() =>
	{
		setState({
			orderId: null,
			suborders: [],
			products: [],
			numberPeople: 0,
			postStarted: false,
			loading: false,
			error: null,
		});

	}, [state.postCompleted]);

	const fetchProducts = async () =>
	{
		try
		{
			const response = await fetch(`${apiUrlBase}/products`);
			const data = await response.json();

			setState(state =>
			{
				return {
					...state,
					products: data,
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
	};

	return {
		state,
		setState
	};
};
