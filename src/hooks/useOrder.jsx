import { useState, useEffect, useRef } from 'react';

export const UseOrders = ({postComplete, setState, suborders}) => {
	const [ordersState, setOrdersState] = useState({
		orders: null,
		numberPeople: 0,
		total: 0,
		approvedGratuity: 0,
		loading: true,
		error: null,
	});

	const apiUrlBase = import.meta.env.VITE_API_URL;

	const formRef = useRef(null);

	const formatter = new Intl.NumberFormat('es-ES');

	useEffect(() =>
	{
		fetchOrders();

		if(postComplete)
		{
			setOrdersState(state =>
			{
				return {
					...state,
					orders: null,
					numberPeople: 0,
					total: 0,
					approvedGratuity: 0,
					loading: true,
					error: null,
				}
			});
		}
	}, [postComplete]);

	useEffect(() =>
	{
		setOrdersState(state =>
		{
			return {
				...state,
				total: suborders.reduce((total, suborder) =>
				{
					return total + suborder.total;
				}, 0),
				approvedGratuity: suborders.reduce((approvedGratuity, suborder) =>
				{
					return approvedGratuity + suborder.approvedGratuity;
				}, 0),
			}
		});

		if (formRef && formRef.current)
		{
			formRef.current.total.value = "$" + formatter.format(ordersState.total);
			formRef.current.approvedGratuity.value = "$" + formatter.format(ordersState.approvedGratuity);
		}
	}, [ordersState.total, ordersState.approvedGratuity, suborders]);

	const fetchOrders = async () =>
		{
			try
			{
				const response = await fetch(`${apiUrlBase}/orders`);
				const data = await response.json();

				setOrdersState(state =>
				{
					return {
						...state,
						orders: data,
						loading: false,
					}
				});
			}

			catch (error)
			{
				setOrdersState(state =>
				{
					return {
						...state,
						error: error,
						loading: false,
					}
				});
			}
		}

	const onSubmit = async (e) =>
	{
		e.preventDefault();

		setState(state =>
		{
			return {
				...state,
				postStarted: true,
			}
		});

		const everythingCompleted = suborders.every(suborder =>
		{
			return suborder.total > 0 && suborder.approvedGratuity > 0;
		});

		if(everythingCompleted && ordersState.numberPeople > 0)
		{
			try
			{
				const response = await fetch(`${apiUrlBase}/orders`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						numberPeople: ordersState.numberPeople,
						total: ordersState.total,
						approvedGratuity: ordersState.approvedGratuity,
					}),
				});

				const data = await response.json();

				setState(state =>
				{
					return {
						...state,
						orderId: data.id
					}
				});

				window.print();

				formRef.current.reset();
			}

			catch (error)
			{
				setOrdersState(state =>
				{
					return {
						...state,
						error: error
					}
				});
			}
		}

		else
		{
			setState(state =>
			{
				return {
					...state,
					error: {
						message: "Por favor, complete todos los campos"
					}
				}
			});
		}
	};

	const onChange = () =>
	{
		const form = formRef.current;

		const formData = new FormData(form);

		const numberPeople = parseInt(formData.get("numberPeople"));

		setState(state =>
		{
			return {
				...state,
				numberPeople: numberPeople
			}
		});

		setOrdersState(state =>
		{
			return {
				...state,
				numberPeople: numberPeople
			}
		});
	};

	return {
		ordersState,
		onSubmit,
		onChange,
		formRef
	};
};
