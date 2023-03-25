import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Nav } from './components';
import { Home, Agenda, AddAppointment, EditAppointment } from './features';

import './fonts/Montserrat-Medium.ttf';
import styles from './App.module.css';

function App() {
  return (
    <BrowserRouter>
      <div className={styles.pageContainer}>
        <Nav />
        <Routes>
          <Route path="/appointments" element={<Agenda />} />
          <Route path="/managedb/add/:start" element={<AddAppointment />} />
          <Route
            path="/managedb/edit/:appointmentId"
            element={<EditAppointment />}
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export { App };
