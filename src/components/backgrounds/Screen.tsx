
import React from "react";

interface ScreenProps {
	children?: React.ReactNode;
}

// This component sets the background to screenbg.gif and centers its children
const Screen: React.FC<ScreenProps> = ({ children }) => {
	return (
		<div
			style={{
				minHeight: "100vh",
				minWidth: "100vw",
				backgroundImage: 'url(/screenbg.jpg)',
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{children}
		</div>
	);
};

export default Screen;
