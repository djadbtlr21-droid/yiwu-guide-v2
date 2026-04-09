import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import TabNav from './components/TabNav';
import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';
import FavoritesPage from './pages/FavoritesPage';
import CustomDetailPage from './pages/CustomDetailPage';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex flex-col flex-1 mt-14 mb-20 overflow-hidden">
        <Routes>
          <Route path="/"           element={<ListPage />} />
          <Route path="/place/:id"  element={<DetailPage />} />
          <Route path="/custom/:id" element={<CustomDetailPage />} />
          <Route path="/favorites"  element={<FavoritesPage />} />
          <Route path="*"           element={<ListPage />} />
        </Routes>
      </div>
      <TabNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}
