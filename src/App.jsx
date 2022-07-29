import { useApp } from './hooks/useApp';

import { OrdersForm } from './components/OrderForm';
import { Loading } from './components/Loading';
import { Error } from './components/Error';
import { SuborderItem } from './components/SuborderItem';

export const App = () =>
{
	const { state, setState } = useApp();

	return (
		<OrdersForm postComplete={state.postCompleted} setState={setState} suborders={state.suborders}>
			{
				state.loading
				?
					<Loading />
				:
					state.error
					?
						<Error message={state.error.message} />
					:
						<div className="container">
							{
								state.suborders.map(suborder =>
									<SuborderItem
										key={suborder.position}
										id={suborder.id}
										setState={setState}
										postStarted={state.postStarted}
										position={suborder.position}
										products={state.products}
									/>
								)
							}
						</div>
			}
		</OrdersForm>
	)
};
