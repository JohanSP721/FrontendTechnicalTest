import React from 'react';

import '../assets/styles/components/Loading.css';

export const Loading = () =>
(
	<div className="loading--container">
		<div className="lds-ring"><div></div><div></div><div></div><div></div></div>
	</div>
);
