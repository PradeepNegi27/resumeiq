import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Interview from './components/Interview'
import Result from './components/Result'
import History from './components/History'
import './styles/global.css'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/result" element={<Result />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </>
  )
}