import Footer from "./components/Footer"
import Header from "./components/Header"
import Hero from "./components/Hero"
import ProductDetail from "./components/ProductDetail"

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="grow">
        <Hero />
        <ProductDetail />
      </div>
      <Footer />
    </div>
  )
}

export default App
