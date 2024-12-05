import { RouterProvider } from "react-router-dom";
import useRoutes from "./hooks/useRoutes";


function App() {
  const router = useRoutes();
	return (
    <div className="App">
		<RouterProvider router={router} />
    </div>
  );
}

export default App;
