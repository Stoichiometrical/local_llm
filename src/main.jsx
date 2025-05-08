import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import MasterChatInterface from "./App.jsx";
import Interface2 from "./Interface2.jsx";
import MasterChatInterface3 from "./Interface3.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <MasterChatInterface3/>,
  },
  //    {
  //   path: '/1',
  //   element: <Interface2 />,
  // },
  //    {
  //   path: '/2',
  //   element: <MasterChatInterface />,
  // },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
