import { Route, Routes } from 'react-router-dom';
import { HomePage } from './HomePage';
import { MiniappRouter } from './MiniappRouter';
import '../miniapps';

export default function DemoRoutes() {
  return (
    <Routes>
      <Route path="/miniapp/:miniappName/*" element={<MiniappRouter />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
