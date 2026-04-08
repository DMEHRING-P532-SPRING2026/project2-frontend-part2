import { Routes, Route, Navigate } from 'react-router-dom'
import Fufillment from './pages/Fufillment'
import Order from './pages/Order'
import Admin from './pages/Admin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/fufillment/lab" replace />} />
      <Route path="/fufillment/lab" element={<Fufillment type="LAB"/>} />
      <Route path="/fufillment/medication" element={<Fufillment type="MEDICATION"/>} />
      <Route path="/fufillment/imaging" element={<Fufillment type="IMAGING"/>} />
      <Route path="/order" element={<Order />}/>
      <Route path="/admin" element={<Admin />}/>
    </Routes>
  )
}
export default App