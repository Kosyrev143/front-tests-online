import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TestList from './pages/TestList';
import OtherTestList from "./pages/OtherTestList.jsx";
import MyTestList from "./pages/MyTestList.jsx";
import CreateTest from "./pages/CreateTest.jsx";
import AllQuestions from "./pages/AllQuestions.jsx";
import CreateQuestion from "./pages/CreateQuestion.jsx";
import CreateAnswer from "./pages/CreateAnswer.jsx";
import CreateResult from "./pages/CreateResult.jsx";
import Result from "./pages/Result.jsx"; // Импортируем TestList
import './App.css'

function App() {
    return (
        <Router>
            <Header />
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/tests" element={<TestList />} />
                    <Route path="/my-tests" element={<MyTestList />} />
                    <Route path="/other-tests" element={<OtherTestList />} />
                    <Route path="/create-test" element={<CreateTest />} />
                    <Route path="/question/:id" element={<AllQuestions />} />
                    <Route path="/create-question" element={<CreateQuestion />} />
                    <Route path="/create-answer" element={<CreateAnswer />} />
                    <Route path="/create-result" element={<CreateResult />} />
                    <Route path="/result/:id" element={<Result />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
