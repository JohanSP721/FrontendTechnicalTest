import { useSuborder } from '../hooks/useSuborder';

import { SuborderProductItem } from './SuborderProductsItem';

import "../assets/styles/components/SuborderItem.css";

export const SuborderItem = ({ setState, postStarted, position, id, products }) =>
{
	const {
		addProduct,
		formatter,
		onEditChange,
		removeProduct,
		suborderState,
		setSuborderState
	} = useSuborder({setState, postStarted, position, id, products});

	return (
		<article className="suborder__container">
			<div className={`suborder ${position % 2 === 0 ? "suborder--dark" : "suborder--light"}`}>
				<h3>Suborden {position}</h3>
				<p>Total: ${formatter.format(suborderState.total)}</p>
				<p>Propina Aprobada: ${formatter.format(suborderState.approvedGratuity)}</p>
				<button
					className="btn"
					onClick={onEditChange}
					type="button">Editar</button>
			</div>
				<div className={`${!suborderState.edit ? "hidden" : ""}`}>
					{
						suborderState.suborderProducts.map(suborderProduct =>
							<article
								key={suborderProduct.position}
								className={`suborder ${position % 2 === 0 ? "suborder--dark" : "suborder--light"}`}
							>
								<SuborderProductItem
									setSuborderState={setSuborderState}
									suborderState={suborderState}
									product={suborderProduct}
									products={products}
								/>
								<button
									disabled={suborderState.quantityProducts === 1}
									onClick={() => removeProduct(suborderProduct.position)}
									className="btn"
									type="button"
								>
									Eliminar
								</button>
							</article>
						)
					}
					<article className={`suborder ${position % 2 === 0 ? "suborder--dark" : "suborder--light"}`}>
						<button
							disabled={suborderState.quantityProducts === products.length}
							onClick={addProduct}
							className="btn btn--add-product"
							type="button"
						>
							Agregar Producto
						</button>
					</article>
				</div>
		</article>
	)
};
