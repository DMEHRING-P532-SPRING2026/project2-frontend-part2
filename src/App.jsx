import { Routes, Route, Navigate } from 'react-router-dom'
import Fufillment from './pages/Fulfillment'
import Order from './pages/Order'
import Admin from './pages/Admin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/fulfillment/lab" replace />} />
      <Route path="/fulfillment/lab" element={<Fufillment type="LAB"/>} />
      <Route path="/fulfillment/medication" element={<Fufillment type="MEDICATION"/>} />
      <Route path="/fulfillment/imaging" element={<Fufillment type="IMAGING"/>} />
      <Route path="/order" element={<Order />}/>
      <Route path="/admin" element={<Admin />}/>
    </Routes>
  )
}
export default App