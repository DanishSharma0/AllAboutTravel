import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';


import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Map from './pages/Map';
import Hostels from './pages/Hostels';
import HostelDetail from './pages/HostelDetail';
import TourGuides from './pages/TourGuides';
import TourGuideDetail from './pages/TourGuideDetail';
import Places from './pages/Places';
import PlaceDetail from './pages/PlaceDetail';
import Rentals from './pages/Rentals';
import RentalDetail from './pages/RentalDetail';
import Products from './pages/Products';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import Checkout from './pages/Checkout';
import ProviderDashboard from './pages/ProviderDashboard';
import AddListing from './pages/AddListing';
import Success from './pages/Success';
import Failure from './pages/Failure';
import ContinueExploring from './pages/ContinueExploring';
import InitialLoader from './components/InitialLoader';

function App() {
  const [loading, setLoading] = React.useState(true);

  if (loading) {
    return <InitialLoader onFinish={() => setLoading(false)} />;
  }

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            {}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/map" element={<Map />} />

            {}
            <Route path="/hostels" element={<Hostels />} />
            <Route path="/hostels/:id" element={<HostelDetail />} />
            <Route path="/tour-guides" element={<TourGuides />} />
            <Route path="/tour-guides/:id" element={<TourGuideDetail />} />
            <Route path="/places" element={<Places />} />
            <Route path="/places/:id" element={<PlaceDetail />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/rentals/:id" element={<RentalDetail />} />
            <Route path="/products" element={<Products />} />

            {}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/success"
              element={
                <ProtectedRoute>
                  <Success />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/failure"
              element={
                <ProtectedRoute>
                  <Failure />
                </ProtectedRoute>
              }
            />
            <Route
              path="/continue-exploring/:cityId"
              element={
                <ProtectedRoute>
                  <ContinueExploring />
                </ProtectedRoute>
              }
            />

            {}
            <Route
              path="/provider-dashboard"
              element={
                <ProtectedRoute>
                  <ProviderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/add-listing"
              element={
                <ProtectedRoute>
                  <AddListing />
                </ProtectedRoute>
              }
            />

            {}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App