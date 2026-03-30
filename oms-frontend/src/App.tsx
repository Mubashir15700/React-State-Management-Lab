import { useState } from 'react';
import OrderList from './components/OrderList';
import CreateOrderForm from './components/CreateOrderForm';
import ProductManager from './components/ProductManager';

function App() {
  const [activeTab, setActiveTab] = useState('react-query');

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navigation or Header */}
      <nav className="bg-slate-800 text-white p-4 shadow-lg flex items-center justify-between fixed top-0 w-full z-10">
        <h1 className="text-xl font-bold">OMS v2.0 Dashboard</h1>

        <div className="mt-4 flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${activeTab === 'react-query' ? 'bg-slate-600' : 'bg-slate-700'
              }`}
            onClick={() => setActiveTab('react-query')}
          >
            React Query
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'redux-toolkit' ? 'bg-slate-600' : 'bg-slate-700'
              }`}
            onClick={() => setActiveTab('redux-toolkit')}
          >
            Redux Toolkit
          </button>
        </div>
      </nav>

      <main className="container mx-auto py-6 space-y-12 mt-20">
        {
          activeTab === 'react-query' ? (
            <>
              {/* React Query Section */}
              < section className="bg-white rounded-2xl shadow-sm pb-10">
                <ProductManager />
              </section>
            </>
          ) : (
            <>
              {/* Redux Toolkit Section */}
              <section className="flex flex-col md:flex-row gap-6 p-8">
                <div className="md:w-1/3">
                  <CreateOrderForm />
                </div>
                <div className="md:w-2/3">
                  <OrderList />
                </div>
              </section>
            </>
          )
        }
      </main>
    </div >
  );
}

export default App;