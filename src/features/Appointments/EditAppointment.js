import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';
import 'moment/locale/ro';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import clsx from 'clsx';

import styles from './Appointments.module.css';
import { options, customStyles } from './customStyles';

export function EditAppointment() {
  const [values, setValues] = useState({
    id: '',
    title: '',
    start: new Date(),
    end: new Date(),
    allDay: false,
    category: '',
    services: '',
    caregiver: '',
  });

  const [labels, setLabels] = useState({
    title: 'Nume client',
    services: '',
  });

  const { appointmentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/appointments/' + appointmentId)
      .then((res) => res.json())
      .then((data) => {
        const formattedData = {
          ...data,
          start: moment(data.start).toDate(),
          end: moment(data.end).toDate(),
        };
        setValues(formattedData);
      });
  }, [appointmentId]);

  const handleInputChange = (e) => {
    if (e.target.name === 'title') {
      setLabels({ ...labels, title: 'Nume client' });
    }

    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selectedOption) => {
    setValues({
      ...values,
      caregiver: selectedOption.value,
      category: selectedOption.value === 'Ioana' ? 'Cosmetic' : 'Hairdressing',
    });

    if (selectedOption.value === 'Ioana' || 'Gabi') {
      setLabels({ ...labels, caregiver: 'Personal' });
    }
  };

  const handleCheckboxChange = (e) => {
    let arr = [];

    if (e.target.checked) {
      arr = [...values.services, e.target.value];
    } else {
      arr = values.services.filter((checkbox) => checkbox !== e.target.value);
    }

    let hasError = arr.length === 0;

    setLabels({
      ...labels,
      services: hasError ? '*Câmp obligatoriu' : '',
    });

    setValues({ ...values, services: arr });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateForm(values);

    if (!validation.isValid) {
      setLabels(validation.labels);
      return;
    }

    await fetch('http://localhost:3001/appointments/' + values.id, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(values),
    }).then((res) => res.json());

    navigate('/appointments');
  };

  return (
    <div className={styles.manageAppointments}>
      <form className={styles.formContent} onSubmit={handleSubmit}>
        <h1 className={styles.manageAppointmentsHeader}>
          Editează programarea
        </h1>
        <div className={styles.wrapper}>
          <label
            htmlFor="title"
            className={clsx(styles.valid, {
              [styles.invalid]: labels.title === '*Câmp obligatoriu',
            })}
          >
            {labels.title}
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={values.title}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.forDatetime}>
          <div className={styles.wrapper}>
            <label>Start</label>
            <Datetime
              locale="ro"
              className={clsx(styles.datetime)}
              value={values.start}
              onChange={(date) =>
                setValues({
                  ...values,
                  start: date.toDate(),
                })
              }
            />
          </div>
          <div className={styles.wrapper}>
            <label>Final</label>
            <Datetime
              locale="ro"
              className={clsx(styles.datetime)}
              value={values.end}
              onChange={(date) =>
                setValues({
                  ...values,
                  end: date.toDate(),
                })
              }
            />
          </div>
        </div>
        <div className={styles.forSelect}>
          <div className={styles.wrapper}>
            <label>Personal</label>
            <Select
              options={options}
              value={options.find(
                (option) => option.value === values.caregiver
              )}
              onChange={handleSelectChange}
              unstyled
              styles={customStyles}
              className={styles.selectComponent}
              isSearchable={false}
            />{' '}
          </div>
          <div className={styles.wrapper}>
            <label htmlFor="category">Servicii</label>
            <select
              value={values.category}
              name="category"
              id="category"
              onChange={handleInputChange}
            >
              <option hidden value="">
                Selectează "Personal"
              </option>
              <option value="Cosmetic">Cosmetică</option>
              <option value="Hairdressing">Coafor&Frizerie</option>
              <option value="Manicure&Pedicure">Manicură&Pedicură</option>
            </select>
          </div>
        </div>
        {values.category === 'Cosmetic' && (
          <div>
            <div className={styles.services}>
              Selectează operațiune:{' '}
              <span
                className={clsx(styles.valid, {
                  [styles.invalid]: labels.services === '*Câmp obligatoriu',
                })}
              >
                {labels.services}
              </span>
            </div>
            <div className={styles.checkboxesPckge1}>
              <div className={styles.cosmetic}>
                <label htmlFor="cosmetic1">
                  <input
                    type="checkbox"
                    id="cosmetic1"
                    name="services"
                    value="Pensat întreținere"
                    checked={values.services.includes('Pensat întreținere')}
                    onChange={handleCheckboxChange}
                  />
                  Pensat întreținere
                </label>
                <label htmlFor="cosmetic2">
                  <input
                    type="checkbox"
                    id="cosmetic2"
                    name="services"
                    value="Pensat formă"
                    checked={values.services.includes('Pensat formă')}
                    onChange={handleCheckboxChange}
                  />
                  Pensat formă
                </label>
                <label htmlFor="cosmetic3">
                  <input
                    type="checkbox"
                    id="cosmetic3"
                    name="services"
                    value="Epilat mustață"
                    checked={values.services.includes('Epilat mustață')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat mustață
                </label>
                <label htmlFor="cosmetic4">
                  <input
                    type="checkbox"
                    id="cosmetic4"
                    name="services"
                    value="Epilat bărbie"
                    checked={values.services.includes('Epilat bărbie')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat bărbie
                </label>
                <label htmlFor="cosmetic5">
                  <input
                    type="checkbox"
                    id="cosmetic5"
                    name="services"
                    value="Epilat pomeți"
                    data-checkboxes
                    checked={values.services.includes('Epilat pomeți')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat pomeți
                </label>
                <label htmlFor="cosmetic6">
                  <input
                    type="checkbox"
                    id="cosmetic6"
                    name="services"
                    value="Epilat perciuni"
                    data-checkboxes
                    checked={values.services.includes('Epilat perciuni')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat perciuni
                </label>
                <label htmlFor="cosmetic7">
                  <input
                    type="checkbox"
                    id="cosmetic7"
                    name="services"
                    value="Epilat față"
                    checked={values.services.includes('Epilat față')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat față
                </label>
                <label htmlFor="cosmetic8">
                  <input
                    type="checkbox"
                    id="cosmetic8"
                    name="services"
                    value="Epilat axilă"
                    checked={values.services.includes('Epilat axilă')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat axilă
                </label>
                <label htmlFor="cosmetic9">
                  <input
                    type="checkbox"
                    id="cosmetic9"
                    name="services"
                    value="Epilat scurt"
                    checked={values.services.includes('Epilat scurt')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat scurt
                </label>
                <label htmlFor="cosmetic10">
                  <input
                    type="checkbox"
                    id="cosmetic10"
                    name="services"
                    value="Epilat lung"
                    checked={values.services.includes('Epilat lung')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat lung
                </label>
                <label htmlFor="cosmetic11">
                  <input
                    type="checkbox"
                    id="cosmetic11"
                    name="services"
                    value="Epilat inghinal total"
                    checked={values.services.includes('Epilat inghinal total')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat inghinal total
                </label>
                <label htmlFor="cosmetic12">
                  <input
                    type="checkbox"
                    id="cosmetic12"
                    name="services"
                    value="Epilat inghinal parțial"
                    checked={values.services.includes(
                      'Epilat inghinal parțial'
                    )}
                    onChange={handleCheckboxChange}
                  />
                  Epilat inghinal parțial
                </label>
                <label htmlFor="cosmetic13">
                  <input
                    type="checkbox"
                    id="cosmetic13"
                    name="services"
                    value="Epilat interfesier"
                    checked={values.services.includes('Epilat interfesier')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat interfesier
                </label>
                <label htmlFor="cosmetic14">
                  <input
                    type="checkbox"
                    id="cosmetic14"
                    name="services"
                    value="Epilat brațe"
                    checked={values.services.includes('Epilat brațe')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat brațe
                </label>
                <label htmlFor="cosmetic15">
                  <input
                    type="checkbox"
                    id="cosmetic15"
                    name="services"
                    value="Epilat abdomen"
                    checked={values.services.includes('Epilat abdomen')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat abdomen
                </label>
                <label htmlFor="cosmetic16">
                  <input
                    type="checkbox"
                    id="cosmetic16"
                    name="services"
                    value="Epilat lombar"
                    checked={values.services.includes('Epilat lombar')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat lombar
                </label>
              </div>
              <div className={styles.cosmetic}>
                <label htmlFor="cosmetic17">
                  <input
                    type="checkbox"
                    id="cosmetic17"
                    name="services"
                    value="Epilat spate total"
                    checked={values.services.includes('Epilat spate total')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat spate total
                </label>
                <label htmlFor="cosmetic18">
                  <input
                    type="checkbox"
                    id="cosmetic18"
                    name="services"
                    value="Epilat fese"
                    checked={values.services.includes('Epilat fese')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat fese
                </label>
                <label htmlFor="cosmetic19">
                  <input
                    type="checkbox"
                    id="cosmetic19"
                    name="services"
                    value="Pensat întreținere bărbat"
                    checked={values.services.includes(
                      'Pensat întreținere bărbat'
                    )}
                    onChange={handleCheckboxChange}
                  />
                  Pensat întreținere bărbat
                </label>
                <label htmlFor="cosmetic20">
                  <input
                    type="checkbox"
                    id="cosmetic20"
                    name="services"
                    value="Pensat formă bărbat"
                    checked={values.services.includes('Pensat formă bărbat')}
                    onChange={handleCheckboxChange}
                  />
                  Pensat formă bărbat
                </label>
                <label htmlFor="cosmetic21">
                  <input
                    type="checkbox"
                    id="cosmetic21"
                    name="services"
                    value="Epilat axilă bărbat"
                    checked={values.services.includes('Epilat axilă bărbat')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat axilă bărbat
                </label>
                <label htmlFor="cosmetic22">
                  <input
                    type="checkbox"
                    id="cosmetic22"
                    name="services"
                    value="Epilat piept bărbat"
                    checked={values.services.includes('Epilat piept bărbat')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat piept bărbat
                </label>
                <label htmlFor="cosmetic23">
                  <input
                    type="checkbox"
                    id="cosmetic23"
                    name="services"
                    value="Epilat abdomen bărbat"
                    checked={values.services.includes('Epilat abdomen bărbat')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat abdomen bărbat
                </label>
                <label htmlFor="cosmetic24">
                  <input
                    type="checkbox"
                    id="cosmetic24"
                    name="services"
                    value="Epilat lombar bărbat"
                    checked={values.services.includes('Epilat lombar bărbat')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat lombar bărbat
                </label>
                <label htmlFor="cosmetic25">
                  <input
                    type="checkbox"
                    id="cosmetic25"
                    name="services"
                    value="Epilat spate total bărbat"
                    checked={values.services.includes(
                      'Epilat spate total bărbat'
                    )}
                    onChange={handleCheckboxChange}
                  />
                  Epilat spate total bărbat
                </label>
                <label htmlFor="cosmetic26">
                  <input
                    type="checkbox"
                    id="cosmetic26"
                    name="services"
                    value="Epilat brațe bărbat"
                    checked={values.services.includes('Epilat brațe bărbat')}
                    onChange={handleCheckboxChange}
                  />
                  Epilat brațe bărbat
                </label>
                <label htmlFor="cosmetic27">
                  <input
                    type="checkbox"
                    id="cosmetic27"
                    name="services"
                    value="Tratament curățare"
                    checked={values.services.includes('Tratament curățare')}
                    onChange={handleCheckboxChange}
                  />
                  Tratament curățare
                </label>
                <label htmlFor="cosmetic28">
                  <input
                    type="checkbox"
                    id="cosmetic28"
                    name="services"
                    value="Masaj facial"
                    checked={values.services.includes('Masaj facial')}
                    onChange={handleCheckboxChange}
                  />
                  Masaj facial
                </label>
                <label htmlFor="cosmetic29">
                  <input
                    type="checkbox"
                    id="cosmetic29"
                    name="services"
                    value="Tratament hidratare"
                    checked={values.services.includes('Tratament hidratare')}
                    onChange={handleCheckboxChange}
                  />
                  Tratament hidratare
                </label>
                <label htmlFor="cosmetic30">
                  <input
                    type="checkbox"
                    id="cosmetic30"
                    name="services"
                    value="Tratament ten matur"
                    checked={values.services.includes('Tratament ten matur')}
                    onChange={handleCheckboxChange}
                  />
                  Tratament ten matur
                </label>
                <label htmlFor="cosmetic31">
                  <input
                    type="checkbox"
                    id="cosmetic31"
                    name="services"
                    value="Tratament ten sensibil"
                    checked={values.services.includes('Tratament ten sensibil')}
                    onChange={handleCheckboxChange}
                  />
                  Tratament ten sensibil
                </label>
                <label htmlFor="cosmetic32">
                  <input
                    type="checkbox"
                    id="cosmetic32"
                    name="services"
                    value="Vopsit sprâncene"
                    checked={values.services.includes('Vopsit sprâncene')}
                    onChange={handleCheckboxChange}
                  />
                  Vopsit sprâncene
                </label>
              </div>
            </div>
          </div>
        )}
        {values.category === 'Hairdressing' && (
          <div>
            <div className={styles.services}>
              Selectează operațiune:{' '}
              <span
                className={clsx(styles.valid, {
                  [styles.invalid]: labels.services === '*Câmp obligatoriu',
                })}
              >
                {labels.services}
              </span>
            </div>
            <div className={styles.checkboxesPckge1}>
              <div className={styles.hairdressing}>
                <label htmlFor="hairdressing1">
                  <input
                    type="checkbox"
                    id="hairdressing1"
                    name="services"
                    value="Tuns bărbați"
                    checked={values.services.includes('Tuns bărbați')}
                    onChange={handleCheckboxChange}
                  />
                  Tuns bărbați
                </label>
                <label htmlFor="hairdressing2">
                  <input
                    type="checkbox"
                    id="hairdressing2"
                    name="services"
                    value="Spălat bărbați"
                    checked={values.services.includes('Spălat bărbați')}
                    onChange={handleCheckboxChange}
                  />
                  Spălat bărbați
                </label>
                <label htmlFor="hairdressing3">
                  <input
                    type="checkbox"
                    id="hairdressing3"
                    name="services"
                    value="Styling"
                    checked={values.services.includes('Styling')}
                    onChange={handleCheckboxChange}
                  />
                  Styling
                </label>
                <label htmlFor="hairdressing4">
                  <input
                    type="checkbox"
                    id="hairdressing4"
                    name="services"
                    value="Tuns vârfuri"
                    checked={values.services.includes('Tuns vârfuri')}
                    onChange={handleCheckboxChange}
                  />
                  Tuns vârfuri
                </label>
                <label htmlFor="hairdressing5">
                  <input
                    type="checkbox"
                    id="hairdressing5"
                    name="services"
                    value="Tuns scurt"
                    checked={values.services.includes('Tuns scurt')}
                    onChange={handleCheckboxChange}
                  />
                  Tuns scurt
                </label>
                <label htmlFor="hairdressing6">
                  <input
                    type="checkbox"
                    id="hairdressing6"
                    name="services"
                    value="Schimbare linie"
                    checked={values.services.includes('Schimbare linie')}
                    onChange={handleCheckboxChange}
                  />
                  Schimbare linie
                </label>
                <label htmlFor="hairdressing7">
                  <input
                    type="checkbox"
                    id="hairdressing7"
                    name="services"
                    value="Coafat perie scurt"
                    checked={values.services.includes('Coafat perie scurt')}
                    onChange={handleCheckboxChange}
                  />
                  Coafat perie scurt
                </label>
                <label htmlFor="hairdressing8">
                  <input
                    type="checkbox"
                    id="hairdressing8"
                    name="services"
                    value="Coafat perie mediu"
                    checked={values.services.includes('Coafat perie mediu')}
                    onChange={handleCheckboxChange}
                  />
                  Coafat perie mediu
                </label>
                <label htmlFor="hairdressing9">
                  <input
                    type="checkbox"
                    id="hairdressing9"
                    name="services"
                    value="Coafat perie lung"
                    checked={values.services.includes('Coafat perie lung')}
                    onChange={handleCheckboxChange}
                  />
                  Coafat perie lung
                </label>
                <label htmlFor="hairdressing10">
                  <input
                    type="checkbox"
                    id="hairdressing10"
                    name="services"
                    value="Coafat perie foarte lung"
                    checked={values.services.includes(
                      'Coafat perie foarte lung'
                    )}
                    onChange={handleCheckboxChange}
                  />
                  Coafat perie foarte lung
                </label>
                <label htmlFor="hairdressing11">
                  <input
                    type="checkbox"
                    id="hairdressing11"
                    name="services"
                    value="Coafat placă mediu"
                    checked={values.services.includes('Coafat placă mediu')}
                    onChange={handleCheckboxChange}
                  />
                  Coafat placă mediu
                </label>
                <label htmlFor="hairdressing12">
                  <input
                    type="checkbox"
                    id="hairdressing12"
                    name="services"
                    value="Coafat placă lung"
                    checked={values.services.includes('Coafat placă lung')}
                    onChange={handleCheckboxChange}
                  />
                  Coafat placă lung
                </label>
                <label htmlFor="hairdressing13">
                  <input
                    type="checkbox"
                    id="hairdressing13"
                    name="services"
                    value="Coafat placă foarte lung"
                    checked={values.services.includes(
                      'Coafat placă foarte lung'
                    )}
                    onChange={handleCheckboxChange}
                  />
                  Coafat placă foarte lung
                </label>
                <label htmlFor="hairdressing14">
                  <input
                    type="checkbox"
                    id="hairdressing14"
                    name="services"
                    value="Coafat special"
                    checked={values.services.includes('Coafat special')}
                    onChange={handleCheckboxChange}
                  />
                  Coafat special
                </label>
                <label htmlFor="hairdressing15">
                  <input
                    type="checkbox"
                    id="hairdressing15"
                    name="services"
                    value="Împletitură"
                    checked={values.services.includes('Împletitură')}
                    onChange={handleCheckboxChange}
                  />
                  Împletitură
                </label>
                <label htmlFor="hairdressing16">
                  <input
                    type="checkbox"
                    id="hairdressing16"
                    name="services"
                    value="Spălat"
                    checked={values.services.includes('Spălat')}
                    onChange={handleCheckboxChange}
                  />
                  Spălat
                </label>
                <label htmlFor="hairdressing17">
                  <input
                    type="checkbox"
                    id="hairdressing17"
                    name="services"
                    value="Spălat după vopsit"
                    checked={values.services.includes('Spălat după vopsit')}
                    onChange={handleCheckboxChange}
                  />
                  Spălat după vopsit
                </label>
                <label htmlFor="hairdressing18">
                  <input
                    type="checkbox"
                    id="hairdressing18"
                    name="services"
                    value="Uscat simplu"
                    checked={values.services.includes('Uscat simplu')}
                    onChange={handleCheckboxChange}
                  />
                  Uscat simplu
                </label>
                <label htmlFor="hairdressing19">
                  <input
                    type="checkbox"
                    id="hairdressing19"
                    name="services"
                    value="Vopsit rădăcină"
                    checked={values.services.includes('Vopsit rădăcină')}
                    onChange={handleCheckboxChange}
                  />
                  Vopsit rădăcină
                </label>
              </div>
              <div className={styles.hairdressing}>
                <label htmlFor="hairdressing20">
                  <input
                    type="checkbox"
                    id="hairdressing20"
                    name="services"
                    value="Vopsit scurt"
                    checked={values.services.includes('Vopsit scurt')}
                    onChange={handleCheckboxChange}
                  />
                  Vopsit scurt
                </label>
                <label htmlFor="hairdressing21">
                  <input
                    type="checkbox"
                    id="hairdressing21"
                    name="services"
                    value="Vopsit mediu"
                    checked={values.services.includes('Vopsit mediu')}
                    onChange={handleCheckboxChange}
                  />
                  Vopsit mediu
                </label>
                <label htmlFor="hairdressing22">
                  <input
                    type="checkbox"
                    id="hairdressing22"
                    name="services"
                    value="Vopsit lung"
                    checked={values.services.includes('Vopsit lung')}
                    onChange={handleCheckboxChange}
                  />
                  Vopsit lung
                </label>
                <label htmlFor="hairdressing23">
                  <input
                    type="checkbox"
                    id="hairdressing23"
                    name="services"
                    value="Vopsit foarte lung"
                    checked={values.services.includes('Vopsit foarte lung')}
                    onChange={handleCheckboxChange}
                  />
                  Vopsit foarte lung
                </label>
                <label htmlFor="hairdressing24">
                  <input
                    type="checkbox"
                    id="hairdressing24"
                    name="services"
                    value="Șuvițe scurt"
                    checked={values.services.includes('Șuvițe scurt')}
                    onChange={handleCheckboxChange}
                  />
                  Șuvițe scurt
                </label>
                <label htmlFor="hairdressing25">
                  <input
                    type="checkbox"
                    id="hairdressing25"
                    name="services"
                    value="Șuvițe mediu"
                    checked={values.services.includes('Șuvițe mediu')}
                    onChange={handleCheckboxChange}
                  />
                  Șuvițe mediu
                </label>
                <label htmlFor="hairdressing26">
                  <input
                    type="checkbox"
                    id="hairdressing26"
                    name="services"
                    value="Șuvițe lung"
                    checked={values.services.includes('Șuvițe lung')}
                    onChange={handleCheckboxChange}
                  />
                  Șuvițe lung
                </label>
                <label htmlFor="hairdressing27">
                  <input
                    type="checkbox"
                    id="hairdressing27"
                    name="services"
                    value="Șuvițe foarte lung"
                    checked={values.services.includes('Șuvițe foarte lung')}
                    onChange={handleCheckboxChange}
                  />
                  Șuvițe foarte lung
                </label>
                <label htmlFor="hairdressing28">
                  <input
                    type="checkbox"
                    id="hairdressing28"
                    name="services"
                    value="Balayage mediu"
                    checked={values.services.includes('Balayage mediu')}
                    onChange={handleCheckboxChange}
                  />
                  Balayage mediu
                </label>
                <label htmlFor="hairdressing29">
                  <input
                    type="checkbox"
                    id="hairdressing29"
                    name="services"
                    value="Balayage lung"
                    checked={values.services.includes('Balayage lung')}
                    onChange={handleCheckboxChange}
                  />
                  Balayage lung
                </label>
                <label htmlFor="hairdressing30">
                  <input
                    type="checkbox"
                    id="hairdressing30"
                    name="services"
                    value="Balayage foarte lung"
                    checked={values.services.includes('Balayage foarte lung')}
                    onChange={handleCheckboxChange}
                  />
                  Balayage foarte lung
                </label>
                <label htmlFor="hairdressing31">
                  <input
                    type="checkbox"
                    id="hairdressing31"
                    name="services"
                    value="Decolorat scurt"
                    checked={values.services.includes('Decolorat scurt')}
                    onChange={handleCheckboxChange}
                  />
                  Decolorat scurt
                </label>
                <label htmlFor="hairdressing32">
                  <input
                    type="checkbox"
                    id="hairdressing32"
                    name="services"
                    value="Decolorat mediu"
                    checked={values.services.includes('Decolorat mediu')}
                    onChange={handleCheckboxChange}
                  />
                  Decolorat mediu
                </label>
                <label htmlFor="hairdressing33">
                  <input
                    type="checkbox"
                    id="hairdressing33"
                    name="services"
                    value="Decolorat lung"
                    checked={values.services.includes('Decolorat lung')}
                    onChange={handleCheckboxChange}
                  />
                  Decolorat lung
                </label>
                <label htmlFor="hairdressing34">
                  <input
                    type="checkbox"
                    id="hairdressing34"
                    name="services"
                    value="Decolorat foarte lung"
                    checked={values.services.includes('Decolorat foarte lung')}
                    onChange={handleCheckboxChange}
                  />
                  Decolorat foarte lung
                </label>
                <label htmlFor="hairdressing35">
                  <input
                    type="checkbox"
                    id="hairdressing35"
                    name="services"
                    value="Cupă pudră"
                    checked={values.services.includes('Cupă pudră')}
                    onChange={handleCheckboxChange}
                  />
                  Cupă pudră
                </label>
                <label htmlFor="hairdressing36">
                  <input
                    type="checkbox"
                    id="hairdressing36"
                    name="services"
                    value="Fiolă tratament"
                    checked={values.services.includes('Fiolă tratament')}
                    onChange={handleCheckboxChange}
                  />
                  Fiolă tratament
                </label>
                <label htmlFor="hairdressing37">
                  <input
                    type="checkbox"
                    id="hairdressing37"
                    name="services"
                    value="Keratină"
                    checked={values.services.includes('Keratină')}
                    onChange={handleCheckboxChange}
                  />
                  Keratină
                </label>
                <label htmlFor="hairdressing38">
                  <input
                    type="checkbox"
                    id="hairdressing38"
                    name="services"
                    value="Vopsea-element-Wella"
                    checked={values.services.includes('Vopsea-element-Wella')}
                    onChange={handleCheckboxChange}
                  />
                  Vopsea-element-Wella
                </label>
              </div>
            </div>
          </div>
        )}
        {values.category === 'Manicure&Pedicure' && (
          <div>
            <div className={styles.services}>
              Selectează operațiune:{' '}
              <span
                className={clsx(styles.valid, {
                  [styles.invalid]: labels.services === '*Câmp obligatoriu',
                })}
              >
                {labels.services}
              </span>
            </div>
            <div className={styles.checkboxesPckge2}>
              <label htmlFor="m&p1">
                <input
                  type="checkbox"
                  id="m&p1"
                  name="services"
                  value="Manichiură clasică"
                  checked={values.services.includes('Manichiură clasică')}
                  onChange={handleCheckboxChange}
                />
                Manichiură clasică
              </label>
              <label htmlFor="m&p2">
                <input
                  type="checkbox"
                  id="m&p2"
                  name="services"
                  value="Pedichiură clasică"
                  checked={values.services.includes('Pedichiură clasică')}
                  onChange={handleCheckboxChange}
                />
                Pedichiură clasică
              </label>
              <label htmlFor="m&p3">
                <input
                  type="checkbox"
                  id="m&p3"
                  name="services"
                  value="Manichiură semipermanentă"
                  checked={values.services.includes(
                    'Manichiură semipermanentă'
                  )}
                  onChange={handleCheckboxChange}
                />
                Manichiură semipermanentă
              </label>
              <label htmlFor="m&p4">
                <input
                  type="checkbox"
                  id="m&p4"
                  name="services"
                  value="Pedichiură semipermanentă"
                  checked={values.services.includes(
                    'Pedichiură semipermanentă'
                  )}
                  onChange={handleCheckboxChange}
                />
                Pedichiură semipermanentă
              </label>
              <label htmlFor="m&p5">
                <input
                  type="checkbox"
                  id="m&p5"
                  name="services"
                  value="Îndepărtat ojă semi"
                  checked={values.services.includes('Îndepărtat ojă semi')}
                  onChange={handleCheckboxChange}
                />
                Îndepărtat ojă semi
              </label>
              <label htmlFor="m&p6">
                <input
                  type="checkbox"
                  id="m&p6"
                  name="services"
                  value="Aplicat ojă semi"
                  checked={values.services.includes('Aplicat ojă semi')}
                  onChange={handleCheckboxChange}
                />
                Aplicat ojă semi
              </label>
              <label htmlFor="m&p7">
                <input
                  type="checkbox"
                  id="m&p7"
                  name="services"
                  value="Aplicat gel unghie naturală"
                  checked={values.services.includes(
                    'Aplicat gel unghie naturală'
                  )}
                  onChange={handleCheckboxChange}
                />
                Aplicat gel unghie naturală
              </label>
              <label htmlFor="m&p8">
                <input
                  type="checkbox"
                  id="m&p8"
                  name="services"
                  value="Construcție gel"
                  checked={values.services.includes('Construcție gel')}
                  onChange={handleCheckboxChange}
                />
                Construcție gel
              </label>
              <label htmlFor="m&p9">
                <input
                  type="checkbox"
                  id="m&p9"
                  name="services"
                  value="Întreținere gel"
                  checked={values.services.includes('Întreținere gel')}
                  onChange={handleCheckboxChange}
                />
                Întreținere gel
              </label>
              <label htmlFor="m&p10">
                <input
                  type="checkbox"
                  id="m&p10"
                  name="services"
                  value="Aplicat culoare"
                  checked={values.services.includes('Aplicat culoare')}
                  onChange={handleCheckboxChange}
                />
                Aplicat culoare
              </label>
              <label htmlFor="m&p11">
                <input
                  type="checkbox"
                  id="m&p11"
                  name="services"
                  value="Model unghie"
                  checked={values.services.includes('Model unghie')}
                  onChange={handleCheckboxChange}
                />
                Model unghie
              </label>
              <label htmlFor="m&p12">
                <input
                  type="checkbox"
                  id="m&p12"
                  name="services"
                  value="Parafină manichiură"
                  checked={values.services.includes('Parafină manichiură')}
                  onChange={handleCheckboxChange}
                />
                Parafină manichiură
              </label>
              <label htmlFor="m&p13">
                <input
                  type="checkbox"
                  id="m&p13"
                  name="services"
                  value="Parafină pedichiură"
                  checked={values.services.includes('Parafină pedichiură')}
                  onChange={handleCheckboxChange}
                />
                Parafină pedichiură
              </label>
            </div>
          </div>
        )}
        <div className={styles.addBtn}>
          <button>
            <FontAwesomeIcon icon={solid('check')} />
          </button>
          <button type="button" onClick={() => navigate('/appointments')}>
            <FontAwesomeIcon icon={solid('arrow-left')} />
          </button>
        </div>
      </form>
    </div>
  );
}

function validateForm(values) {
  const validation = {
    labels: {
      title: 'Nume client',
    },
    isValid: true,
  };

  if (!values.title) {
    validation.labels.title = '*Câmp obligatoriu';
    validation.isValid = false;
  }

  if (values.services.length === 0) {
    validation.labels.services = '*Câmp obligatoriu';
    validation.isValid = false;
  }

  return validation;
}
