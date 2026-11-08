import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import { Screen as LoginScreen } from "./components/login/login";

import Dashboard from "./pages/Dashboard";
import Employee from "./pages/Employee";
import Salary from "./pages/Salary";
import Organization from "./pages/Organization";
import Evaluation from "./pages/Evaluation";
import Document from "./pages/Document";

// 💡 인증 상태 확인 함수 (토큰 존재 여부 체크)
const isAuthenticated = () => {
  const token = localStorage.getItem("hris_access_token") || localStorage.getItem("access_token");
  return !!token;
};

// 🔒 보호된 라우트: 로그인이 안 되어 있으면 /login으로 리다이렉트
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// 🚪 공개 라우트: 이미 로그인된 상태에서 /login 접근 시 대시보드로 리다이렉트
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 로그인 페이지 (공개 라우트) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginScreen />
            </PublicRoute>
          }
        />

        {/* 2. 대시보드 및 HRIS 메인 페이지들 (보호된 라우트) */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/salary" element={<Salary />} />
          <Route path="/organization" element={<Organization />} />
          <Route path="/evaluation" element={<Evaluation />} />
          <Route path="/document" element={<Document />} />
        </Route>

        {/* 3. 잘못된 경로 처리 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;