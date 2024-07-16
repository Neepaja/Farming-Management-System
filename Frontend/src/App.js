import ManageFarmerPage from "./pages/ManageFarmerPage";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ViewItem from "./pages/ManageSupplies/item/viewItem";
import ManageItemPage from "./pages/ManageSupplies/item/itemPage";
import React from 'react';
import View from './pages/View';
import ManageSupplyPage from "./pages/ManageSupplies/supply/supplyPage";
import ManageProductPage from "./pages/MangageProducts/product/productPage";
import ManageCollectionPage from "./pages/MangageProducts/collect/collectionPage";
import StatusEntryPage from "./pages/ManageStatus/statusEnterPage";
import StatusAnalysisPage from "./pages/ManageStatus/statusAnalysisPage";
import ViewStatus from "./pages/ManageStatus/viewStatus";
import RibbonCountPage from "./pages/ManageStatus/RibbonCountPage";
import Dashboard from "./pages/Dashboard/dashboard";
import AddUser from "./pages/AddUser/AddUser";
// import CultivationTable from "./pages/ManageStatus/CultivationTable";
// import CultivationHistoryPage from "./pages/ManageStatus/CultivationHistoryPage";
import IncomeExpensesPage from "./pages/IncomeExpenses/IncomeExpenses";
import CalculatedResultsPage from "./pages/CalculatedResultsPage/CalculatedResultsPage";
import LoginPage from "./pages/Login/LoginPage";
import AppBar from "./components/Appbar";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>     
          <Route path="/login" element={<LoginPage />} />
          <Route path="/manage-farmer" element={<ManageFarmerPage />} />
          <Route path="/items" element={<ManageItemPage/>} />
          <Route path="/supplies" element={<ManageSupplyPage/>} />
          <Route path="/products" element={<ManageProductPage/>} />
          <Route path="/collections" element={<ManageCollectionPage/>} />
          <Route path="/status-entry" element={<StatusEntryPage/>} />
          <Route path="/status" element={<StatusAnalysisPage/>} />
          <Route path="/ribbonCount" element={<RibbonCountPage/>} />
          {/* <Route path="/cultivation" element={<CultivationTable/>} />
          <Route path="/cultivation-history" element={<CultivationHistoryPage/>} /> */}
          <Route path="/income-expenses" element={<IncomeExpensesPage/>} />
          <Route path="/calculated-results" element={<CalculatedResultsPage/>} />
          <Route path="/viewStatus/:id" element={<ViewStatus />} />
          <Route path="/ViewItem/:id" element={<ViewItem/>} />
          <Route path="/view/:id" element={<View />} /> 
          <Route path="/adduser" element={<AddUser />} /> 
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/appbar" element={<AppBar/>} />
          <Route path="/" element={<h1>Home</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;