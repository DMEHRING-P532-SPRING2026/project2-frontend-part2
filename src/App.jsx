import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import Fufillment from './pages/Fulfillment'
import Order from './pages/Order'
import Admin from './pages/Admin'

function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <nav className="bg-neutral-900 px-8 py-3 flex gap-6 items-center shrink-0 border-b border-neutral-700">
        <NavLink
          to="/fufillment/lab"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-neutral-400 hover:text-white'}`
          }
        >
          Lab
        </NavLink>
        <NavLink
          to="/fufillment/medication"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-neutral-400 hover:text-white'}`
          }
        >
          Medication
        </NavLink>
        <NavLink
          to="/fufillment/imaging"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-neutral-400 hover:text-white'}`
          }
        >
          Imaging
        </NavLink>
        <NavLink
          to="/order"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-neutral-400 hover:text-white'}`
          }
        >
          Orders
        </NavLink>
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-neutral-400 hover:text-white'}`
          }
        >
          Admin
        </NavLink>
      </nav>

      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/fufillment/lab" replace />} />
          <Route path="/fufillment/lab" element={<Fufillment type="LAB" />} />
          <Route path="/fufillment/medication" element={<Fufillment type="MEDICATION" />} />
          <Route path="/fufillment/imaging" element={<Fufillment type="IMAGING" />} />
          <Route path="/order" element={<Order />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </div>
  )
}

export default App