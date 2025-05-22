import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthRoutes } from './routes/AuthRoutes';
import { AppRoutes } from './routes/AppRoutes';
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
