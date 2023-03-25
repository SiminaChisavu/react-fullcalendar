import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import roLocale from '@fullcalendar/core/locales/ro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import clsx from 'clsx';

import styles from './Appointments.module.css';

export function Agenda() {
  const calendarRef = useRef(null);
  const [appointments, setAppointments] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [dltModal, setDltModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/appointments')
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Custom appearance of each event in the FullCalendar and used in 'eventContent' prop
  const customContent = (eventInfo) => {
    return (
      <div
        className={clsx(styles.eventContent, {
          [styles.eventDayGrid]: eventInfo.view.type === 'timeGridDay',
        })}
      >
        <div className={styles.eventDetails}>
          <div>Personal: {eventInfo.event.extendedProps.caregiver}</div>
          <div>Clientă: {eventInfo.event.title}</div>
          <div>
            Servicii: {eventInfo.event.extendedProps.services.toString()}
          </div>
        </div>
        <div className={styles.iconGroup}>
          <FontAwesomeIcon
            icon={solid('pencil')}
            className={styles.editIcon}
            onClick={() => navigate(`/managedb/edit/${eventInfo.event.id}`)}
          />
          <FontAwesomeIcon
            icon={solid('trash-can')}
            className={styles.dltIcon}
            onClick={() => {
              handleOpenDltModal(eventInfo.event);
            }}
          />
        </div>
      </div>
    );
  };

  // Custom background color for events in the FullCalendar based on the 'caregiver' propriety's value  and used in 'eventDidMount' prop
  const customStyle = (info) => {
    switch (info.event.extendedProps.caregiver) {
      case 'Ioana':
        info.el.style.backgroundColor = '#eac41e';
        break;
      case 'Gabi':
        info.el.style.backgroundColor = '#208132';
        break;
      default:
        info.el.style.backgroundColor = 'inherit';
    }
  };

  // Changes the color of the header toolbar buttons based on the current view type
  useEffect(() => {
    const dayBtn = document.querySelector('.fc-timeGridDay-button');
    const weekBtn = document.querySelector('.fc-timeGridWeek-button');
    const monthBtn = document.querySelector('.fc-dayGridMonth-button');

    const calendarApi = calendarRef.current.getApi();

    // Listens for the 'datesSet' event, which is triggered when the user changes the view
    calendarApi.on('datesSet', function (viewInfo) {
      const viewType = viewInfo.view.type;

      switch (viewType) {
        case 'timeGridDay':
          dayBtn.style.color = '#ab8e10';
          weekBtn.style.color = '#17241c';
          monthBtn.style.color = '#17241c';
          break;
        case 'timeGridWeek':
          dayBtn.style.color = '#17241c';
          weekBtn.style.color = '#ab8e10';
          monthBtn.style.color = '#17241c';
          break;
        case 'dayGridMonth':
          dayBtn.style.color = '#17241c';
          weekBtn.style.color = '#17241c';
          monthBtn.style.color = '#ab8e10';
          break;
        default:
          break;
      }
    });
  }, []);

  useEffect(() => {
    // Adds event onClick and cursor pointer for table headers when calendar view is 'timeGridWeek'
    const handleDatesSet = () => {
      const calendarApi = calendarRef.current.getApi();
      const isTimeGridWeekView = calendarApi.view.type === 'timeGridWeek';
      const headerElements = document.querySelectorAll('th[data-date]');
      for (const headerElement of headerElements) {
        if (isTimeGridWeekView) {
          headerElement.addEventListener('click', handleClick);
          headerElement.style.cursor = 'pointer';
        } else {
          headerElement.removeEventListener('click', handleClick);
          headerElement.style.cursor = '';
        }
      }
    };

    // Handles clicks on the table headers and navigates to the corresponding day view
    const handleClick = (e) => {
      const headerElement = e.target.closest('th[data-date]');
      if (headerElement) {
        const date = headerElement.dataset.date;
        const calendarApi = calendarRef.current.getApi();
        calendarApi.gotoDate(date);
        calendarApi.changeView('timeGridDay');
      }
    };

    const calendarApi = calendarRef.current.getApi();

    // Listens for the 'datesSet' event, which is triggered when the user clicks on the table headers
    calendarApi.on('datesSet', handleDatesSet);

    // Removes the event listener and click listener when the component unmounts
    return () => {
      calendarApi.off('datesSet', handleDatesSet);
      const headerElements = document.querySelectorAll('th[data-date]');
      for (const headerElement of headerElements) {
        headerElement.removeEventListener('click', handleClick);
      }
    };
  }, []);

  const handleOpenDltModal = (e) => {
    setSelectedAppointment(e);
    setDltModal(true);
  };

  const handleCloseDltModal = () => {
    setDltModal(false);
  };

  // Deletes events from FullCalendar's DOM & db
  const handleDeleteAppointment = async (e) => {
    const deleteAppointment = () => {
      let calendarApi = calendarRef.current.getApi().getEventById(e.id);
      calendarApi.remove();
    };

    await fetch('http://localhost:3001/appointments/' + e.id, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then(deleteAppointment);

    setDltModal(false);
  };

  return (
    <div className={styles.agenda}>
      <div className={styles.fc}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          weekNumberCalculation="ISO"
          hiddenDays={[0]}
          slotMinTime="07:00:00"
          slotMaxTime="22:00:00"
          slotDuration="00:05:00"
          height="auto" // activates sticky-header-dates and disables the scrollbar
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth',
          }}
          slotLabelFormat={{
            hour: 'numeric',
            minute: '2-digit',
            omitZeroMinute: false,
          }}
          locale={roLocale}
          slotEventOverlap={false}
          events={appointments}
          eventContent={customContent}
          eventDidMount={customStyle}
          dateClick={(info) => {
            const { date } = info;
            navigate(`/managedb/add/${date}`);
          }} // triggered when the user clicks on a date or a time
        />
      </div>
      {dltModal && (
        <div className={styles.dltModal}>
          <div className={styles.modalContent}>
            <div>Ești sigur că dorești să ștergi această programare?</div>
            <div className={styles.modalBtns}>
              <button
                onClick={() => handleDeleteAppointment(selectedAppointment)}
              >
                <FontAwesomeIcon icon={solid('check')} />
              </button>
              <button onClick={handleCloseDltModal}>
                <FontAwesomeIcon icon={solid('arrow-left')} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
