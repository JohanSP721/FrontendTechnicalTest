import { UseOrders } from '../hooks/useOrder';

import { Loading } from './Loading';
import { Error } from './Error';

import '../assets/styles/components/OrdersForm.css';

export const OrdersForm = ({ children, postComplete, setState, suborders }) =>
{
	const {
		formRef,
		onChange,
		onSubmit,
		ordersState
	} = UseOrders({postComplete, setState, suborders});

	return (
		ordersState.loading
		?
			<Loading />
		:
			ordersState.error
			?
				<Error message={ordersState.error.message} />
			:
				<section className="orders">
					<h1 className="orders__title">Orden Numero {ordersState.orders?.length + 1}</h1>
					<form noValidate className="orders__form" ref={formRef} onChange={onChange} onSubmit={onSubmit}>
						<div className="orders__form--left">
							<label htmlFor="number-people">Numero de Personas / Subórdenes:</label>
							<input
								type="number"
								name="numberPeople"
								id="number-people"
								min="1"
								max="50"
							/>
						</div>
						{children}
						<div className="orders__form--right">
							<label htmlFor="total">Total:</label>
							<input
								name="total"
								id="total"
								readOnly
							/>
							<label htmlFor="approved-gratuity">Propina Aprobada:</label>
							<input
								name="approvedGratuity"
								id="approved-gratuity"
								readOnly
							/>
							<button className="btn btn--post" type="submit">Enviar</button>
						</div>
					</form>
				</section>
	)
};
