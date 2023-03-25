import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import 'moment/locale/ro';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import clsx from 'clsx';

import styles from './Appointments.module.css';
import { options, customStyles } from './customStyles';

export function AddAppointment() {
  const [values, setValues] = useState({
    title: '',
    start: '',
    end: '',
    caregiver: '',
    category: '',
    allDay: false,
    services: '',
  });

  const [labels, setLabels] = useState({
    title: 'Nume client',
    caregiver: 'Personal',
    services: '',
  });

  const { start } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (start) {
      const startDate = new Date(start);
      setValues({
        ...values,
        start: startDate.toISOString(),
        end: startDate.toISOString(),
      });
    }
  }, [start]);

  const handleInputChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });

    if (e.target.name === 'title') {
      setLabels({ ...labels, title: 'Nume client' });
    }
  };

  const handleStartChange = (date) => {
    setValues({ ...values, start: date.toISOString() });
  };

  const handleEndChange = (date) => {
    setValues({ ...values, end: date.toISOString() });
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

  const handleCheckBoxChange = () => {
    const checkboxes = document.querySelectorAll('input[type=checkbox]');
    let arr = [];

    for (const checkbox of checkboxes) {
      if (checkbox.checked) {
        arr.push(checkbox.value);
      } else {
        arr.filter((checkbox) => checkbox !== checkbox.value);
      }

      let hasError = arr.length === 0;

      setLabels({
        ...labels,
        services: hasError ? '*Câmp obligatoriu' : '',
      });
      setValues({ ...values, services: arr });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateForm(values);

    if (!validation.isValid) {
      setLabels(validation.labels);
      return;
    }

    await fetch('http://localhost:3001/appointments', {
      method: 'POST',
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
          Înregistrează programarea
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
              value={values.start ? new Date(values.start) : ''}
              onChange={handleStartChange}
            />
          </div>
          <div className={styles.wrapper}>
            <label>Final</label>
            <Datetime
              locale="ro"
              className={clsx(styles.datetime)}
              value={values.end ? new Date(values.end) : ''}
              onChange={handleEndChange}
            />
          </div>
        </div>
        <div className={styles.forSelect}>
          <div className={styles.wrapper}>
            <label
              className={clsx(styles.valid, {
                [styles.invalid]: labels.caregiver === '*Câmp obligatoriu',
              })}
            >
              {labels.caregiver}
            </label>
            <Select
              placeholder={'Selectează'}
              value={options.find(
                (option) => option.value === values.caregiver
              )}
              onChange={handleSelectChange}
              options={options}
              unstyled
              styles={customStyles}
              className={styles.selectComponent}
              isSearchable={false}
            />{' '}
          </div>
          <div className={styles.wrapper}>
            <label htmlFor="category">Servicii</label>
            <select
              name="category"
              value={values.category}
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
                    onChange={handleCheckBoxChange}
                  />
                  Pensat întreținere
                </label>
                <label htmlFor="cosmetic2">
                  <input
                    type="checkbox"
                    id="cosmetic2"
                    name="services"
                    value="Pensat formă"
                    onChange={handleCheckBoxChange}
                  />
                  Pensat formă
                </label>
                <label htmlFor="cosmetic3">
                  <input
                    type="checkbox"
                    id="cosmetic3"
                    name="services"
                    value="Epilat mustață"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat mustață
                </label>
                <label htmlFor="cosmetic4">
                  <input
                    type="checkbox"
                    id="cosmetic4"
                    name="services"
                    value=" Epilat bărbie"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat bărbie
                </label>
                <label htmlFor="cosmetic5">
                  <input
                    type="checkbox"
                    id="cosmetic5"
                    name="services"
                    value="Epilat pomeți"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat pomeți
                </label>
                <label htmlFor="cosmetic6">
                  <input
                    type="checkbox"
                    id="cosmetic6"
                    name="services"
                    value="Epilat perciuni"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat perciuni
                </label>
                <label htmlFor="cosmetic7">
                  <input
                    type="checkbox"
                    id="cosmetic7"
                    name="services"
                    value="Epilat față"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat față
                </label>
                <label htmlFor="cosmetic8">
                  <input
                    type="checkbox"
                    id="cosmetic8"
                    name="services"
                    value="Epilat axilă"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat axilă
                </label>
                <label htmlFor="cosmetic9">
                  <input
                    type="checkbox"
                    id="cosmetic9"
                    name="services"
                    value="Epilat scurt"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat scurt
                </label>
                <label htmlFor="cosmetic10">
                  <input
                    type="checkbox"
                    id="cosmetic10"
                    name="services"
                    value="Epilat lung"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat lung
                </label>
                <label htmlFor="cosmetic11">
                  <input
                    type="checkbox"
                    id="cosmetic11"
                    name="services"
                    value="Epilat inghinal total"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat inghinal total
                </label>
                <label htmlFor="cosmetic12">
                  <input
                    type="checkbox"
                    id="cosmetic12"
                    name="services"
                    value="Epilat inghinal parțial"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat inghinal parțial
                </label>
                <label htmlFor="cosmetic13">
                  <input
                    type="checkbox"
                    id="cosmetic13"
                    name="services"
                    value="Epilat interfesier"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat interfesier
                </label>
                <label htmlFor="cosmetic14">
                  <input
                    type="checkbox"
                    id="cosmetic14"
                    name="services"
                    value="Epilat brațe"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat brațe
                </label>
                <label htmlFor="cosmetic15">
                  <input
                    type="checkbox"
                    id="cosmetic15"
                    name="services"
                    value="Epilat abdomen"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat abdomen
                </label>
                <label htmlFor="cosmetic16">
                  <input
                    type="checkbox"
                    id="cosmetic16"
                    name="services"
                    value="Epilat lombar"
                    onChange={handleCheckBoxChange}
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
                    onChange={handleCheckBoxChange}
                  />
                  Epilat spate total
                </label>
                <label htmlFor="cosmetic18">
                  <input
                    type="checkbox"
                    id="cosmetic18"
                    name="services"
                    value="Epilat fese"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat fese
                </label>
                <label htmlFor="cosmetic19">
                  <input
                    type="checkbox"
                    id="cosmetic19"
                    name="services"
                    value="Pensat întreținere bărbat"
                    onChange={handleCheckBoxChange}
                  />
                  Pensat întreținere bărbat
                </label>
                <label htmlFor="cosmetic20">
                  <input
                    type="checkbox"
                    id="cosmetic20"
                    name="services"
                    value="Pensat formă bărbat"
                    onChange={handleCheckBoxChange}
                  />
                  Pensat formă bărbat
                </label>
                <label htmlFor="cosmetic21">
                  <input
                    type="checkbox"
                    id="cosmetic21"
                    name="services"
                    value="Epilat axilă bărbat"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat axilă bărbat
                </label>
                <label htmlFor="cosmetic22">
                  <input
                    type="checkbox"
                    id="cosmetic22"
                    name="services"
                    value="Epilat piept bărbat"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat piept bărbat
                </label>
                <label htmlFor="cosmetic23">
                  <input
                    type="checkbox"
                    id="cosmetic23"
                    name="services"
                    value="Epilat abdomen bărbat"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat abdomen bărbat
                </label>
                <label htmlFor="cosmetic24">
                  <input
                    type="checkbox"
                    id="cosmetic24"
                    name="services"
                    value="Epilat lombar bărbat"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat lombar bărbat
                </label>
                <label htmlFor="cosmetic25">
                  <input
                    type="checkbox"
                    id="cosmetic25"
                    name="services"
                    value="Epilat spate total bărbat"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat spate total bărbat
                </label>
                <label htmlFor="cosmetic26">
                  <input
                    type="checkbox"
                    id="cosmetic26"
                    name="services"
                    value="Epilat brațe bărbat"
                    onChange={handleCheckBoxChange}
                  />
                  Epilat brațe bărbat
                </label>
                <label htmlFor="cosmetic27">
                  <input
                    type="checkbox"
                    id="cosmetic27"
                    name="services"
                    value="Tratament curățare"
                    onChange={handleCheckBoxChange}
                  />
                  Tratament curățare
                </label>
                <label htmlFor="cosmetic28">
                  <input
                    type="checkbox"
                    id="cosmetic28"
                    name="services"
                    value="Masaj facial"
                    onChange={handleCheckBoxChange}
                  />
                  Masaj facial
                </label>
                <label htmlFor="cosmetic29">
                  <input
                    type="checkbox"
                    id="cosmetic29"
                    name="services"
                    value="Tratament hidratare"
                    onChange={handleCheckBoxChange}
                  />
                  Tratament hidratare
                </label>
                <label htmlFor="cosmetic30">
                  <input
                    type="checkbox"
                    id="cosmetic30"
                    name="services"
                    value="Tratament ten matur"
                    onChange={handleCheckBoxChange}
                  />
                  Tratament ten matur
                </label>
                <label htmlFor="cosmetic31">
                  <input
                    type="checkbox"
                    id="cosmetic31"
                    name="services"
                    value="Tratament ten sensibil"
                    onChange={handleCheckBoxChange}
                  />
                  Tratament ten sensibil
                </label>
                <label htmlFor="cosmetic32">
                  <input
                    type="checkbox"
                    id="cosmetic32"
                    name="services"
                    value="Vopsit sprâncene"
                    onChange={handleCheckBoxChange}
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
                    onChange={handleCheckBoxChange}
                  />
                  Tuns bărbați
                </label>
                <label htmlFor="hairdressing2">
                  <input
                    type="checkbox"
                    id="hairdressing2"
                    name="services"
                    value="Spălat bărbați"
                    onChange={handleCheckBoxChange}
                  />
                  Spălat bărbați
                </label>
                <label htmlFor="hairdressing3">
                  <input
                    type="checkbox"
                    id="hairdressing3"
                    name="services"
                    value="Styling"
                    onChange={handleCheckBoxChange}
                  />
                  Styling
                </label>
                <label htmlFor="hairdressing4">
                  <input
                    type="checkbox"
                    id="hairdressing4"
                    name="services"
                    value="Tuns vârfuri"
                    onChange={handleCheckBoxChange}
                  />
                  Tuns vârfuri
                </label>
                <label htmlFor="hairdressing5">
                  <input
                    type="checkbox"
                    id="hairdressing5"
                    name="services"
                    value="Tuns scurt"
                    onChange={handleCheckBoxChange}
                  />
                  Tuns scurt
                </label>
                <label htmlFor="hairdressing6">
                  <input
                    type="checkbox"
                    id="hairdressing6"
                    name="services"
                    value="Schimbare linie"
                    onChange={handleCheckBoxChange}
                  />
                  Schimbare linie
                </label>
                <label htmlFor="hairdressing7">
                  <input
                    type="checkbox"
                    id="hairdressing7"
                    name="services"
                    value="Coafat perie scurt"
                    onChange={handleCheckBoxChange}
                  />
                  Coafat perie scurt
                </label>
                <label htmlFor="hairdressing8">
                  <input
                    type="checkbox"
                    id="hairdressing8"
                    name="services"
                    value="Coafat perie mediu"
                    onChange={handleCheckBoxChange}
                  />
                  Coafat perie mediu
                </label>
                <label htmlFor="hairdressing9">
                  <input
                    type="checkbox"
                    id="hairdressing9"
                    name="services"
                    value="Coafat perie lung"
                    onChange={handleCheckBoxChange}
                  />
                  Coafat perie lung
                </label>
                <label htmlFor="hairdressing10">
                  <input
                    type="checkbox"
                    id="hairdressing10"
                    name="services"
                    value="Coafat perie foarte lung"
                    onChange={handleCheckBoxChange}
                  />
                  Coafat perie foarte lung
                </label>
                <label htmlFor="hairdressing11">
                  <input
                    type="checkbox"
                    id="hairdressing11"
                    name="services"
                    value="Coafat placă mediu"
                    onChange={handleCheckBoxChange}
                  />
                  Coafat placă mediu
                </label>
                <label htmlFor="hairdressing12">
                  <input
                    type="checkbox"
                    id="hairdressing12"
                    name="services"
                    value="Coafat placă lung"
                    onChange={handleCheckBoxChange}
                  />
                  Coafat placă lung
                </label>
                <label htmlFor="hairdressing13">
                  <input
                    type="checkbox"
                    id="hairdressing13"
                    name="services"
                    value="Coafat placă foarte lung"
                    onChange={handleCheckBoxChange}
                  />
                  Coafat placă foarte lung
                </label>
                <label htmlFor="hairdressing14">
                  <input
                    type="checkbox"
                    id="hairdressing14"
                    name="services"
                    value="Coafat special"
                    onChange={handleCheckBoxChange}
                  />
                  Coafat special
                </label>
                <label htmlFor="hairdressing15">
                  <input
                    type="checkbox"
                    id="hairdressing15"
                    name="services"
                    value="Împletitură"
                    onChange={handleCheckBoxChange}
                  />
                  Împletitură
                </label>
                <label htmlFor="hairdressing16">
                  <input
                    type="checkbox"
                    id="hairdressing16"
                    name="services"
                    value="Spălat"
                    onChange={handleCheckBoxChange}
                  />
                  Spălat
                </label>
                <label htmlFor="hairdressing17">
                  <input
                    type="checkbox"
                    id="hairdressing17"
                    name="services"
                    value="Spălat după vopsit"
                    onChange={handleCheckBoxChange}
                  />
                  Spălat după vopsit
                </label>
                <label htmlFor="hairdressing18">
                  <input
                    type="checkbox"
                    id="hairdressing18"
                    name="services"
                    value="Uscat simplu"
                    onChange={handleCheckBoxChange}
                  />
                  Uscat simplu
                </label>
                <label htmlFor="hairdressing19">
                  <input
                    type="checkbox"
                    id="hairdressing19"
                    name="services"
                    value="Vopsit rădăcină"
                    onChange={handleCheckBoxChange}
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
                    onChange={handleCheckBoxChange}
                  />
                  Vopsit scurt
                </label>
                <label htmlFor="hairdressing21">
                  <input
                    type="checkbox"
                    id="hairdressing21"
                    name="services"
                    value="Vopsit mediu"
                    onChange={handleCheckBoxChange}
                  />
                  Vopsit mediu
                </label>
                <label htmlFor="hairdressing22">
                  <input
                    type="checkbox"
                    id="hairdressing22"
                    name="services"
                    value="Vopsit lung"
                    onChange={handleCheckBoxChange}
                  />
                  Vopsit lung
                </label>
                <label htmlFor="hairdressing23">
                  <input
                    type="checkbox"
                    id="hairdressing23"
                    name="services"
                    value="Vopsit foarte lung"
                    onChange={handleCheckBoxChange}
                  />
                  Vopsit foarte lung
                </label>
                <label htmlFor="hairdressing24">
                  <input
                    type="checkbox"
                    id="hairdressing24"
                    name="services"
                    value="Șuvițe scurt"
                    onChange={handleCheckBoxChange}
                  />
                  Șuvițe scurt
                </label>
                <label htmlFor="hairdressing25">
                  <input
                    type="checkbox"
                    id="hairdressing25"
                    name="services"
                    value="Șuvițe mediu"
                    onChange={handleCheckBoxChange}
                  />
                  Șuvițe mediu
                </label>
                <label htmlFor="hairdressing26">
                  <input
                    type="checkbox"
                    id="hairdressing26"
                    name="services"
                    value="Șuvițe lung"
                    onChange={handleCheckBoxChange}
                  />
                  Șuvițe lung
                </label>
                <label htmlFor="hairdressing27">
                  <input
                    type="checkbox"
                    id="hairdressing27"
                    name="services"
                    value="Șuvițe foarte lung"
                    onChange={handleCheckBoxChange}
                  />
                  Șuvițe foarte lung
                </label>
                <label htmlFor="hairdressing28">
                  <input
                    type="checkbox"
                    id="hairdressing28"
                    name="services"
                    value="Balayage mediu"
                    onChange={handleCheckBoxChange}
                  />
                  Balayage mediu
                </label>
                <label htmlFor="hairdressing29">
                  <input
                    type="checkbox"
                    id="hairdressing29"
                    name="services"
                    value="Balayage lung"
                    onChange={handleCheckBoxChange}
                  />
                  Balayage lung
                </label>
                <label htmlFor="hairdressing30">
                  <input
                    type="checkbox"
                    id="hairdressing30"
                    name="services"
                    value="Balayage foarte lung"
                    onChange={handleCheckBoxChange}
                  />
                  Balayage foarte lung
                </label>
                <label htmlFor="hairdressing31">
                  <input
                    type="checkbox"
                    id="hairdressing31"
                    name="services"
                    value="Decolorat scurt"
                    onChange={handleCheckBoxChange}
                  />
                  Decolorat scurt
                </label>
                <label htmlFor="hairdressing32">
                  <input
                    type="checkbox"
                    id="hairdressing32"
                    name="services"
                    value="Decolorat mediu"
                    onChange={handleCheckBoxChange}
                  />
                  Decolorat mediu
                </label>
                <label htmlFor="hairdressing33">
                  <input
                    type="checkbox"
                    id="hairdressing33"
                    name="services"
                    value="Decolorat lung"
                    onChange={handleCheckBoxChange}
                  />
                  Decolorat lung
                </label>
                <label htmlFor="hairdressing34">
                  <input
                    type="checkbox"
                    id="hairdressing34"
                    name="services"
                    value="Decolorat foarte lung"
                    onChange={handleCheckBoxChange}
                  />
                  Decolorat foarte lung
                </label>
                <label htmlFor="hairdressing35">
                  <input
                    type="checkbox"
                    id="hairdressing35"
                    name="services"
                    value="Cupă pudră"
                    onChange={handleCheckBoxChange}
                  />
                  Cupă pudră
                </label>
                <label htmlFor="hairdressing36">
                  <input
                    type="checkbox"
                    id="hairdressing36"
                    name="services"
                    value="Fiolă tratament"
                    onChange={handleCheckBoxChange}
                  />
                  Fiolă tratament
                </label>
                <label htmlFor="hairdressing37">
                  <input
                    type="checkbox"
                    id="hairdressing37"
                    name="services"
                    value="Keratină"
                    onChange={handleCheckBoxChange}
                  />
                  Keratină
                </label>
                <label htmlFor="hairdressing38">
                  <input
                    type="checkbox"
                    id="hairdressing38"
                    name="services"
                    value="Vopsea-element-Wella"
                    onChange={handleCheckBoxChange}
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
                  onChange={handleCheckBoxChange}
                />
                Manichiură clasică
              </label>
              <label htmlFor="m&p2">
                <input
                  type="checkbox"
                  id="m&p2"
                  name="services"
                  value="Pedichiură clasică"
                  onChange={handleCheckBoxChange}
                />
                Pedichiură clasică
              </label>
              <label htmlFor="m&p3">
                <input
                  type="checkbox"
                  id="m&p3"
                  name="services"
                  value="Manichiură semipermanentă"
                  onChange={handleCheckBoxChange}
                />
                Manichiură semipermanentă
              </label>
              <label htmlFor="m&p4">
                <input
                  type="checkbox"
                  id="m&p4"
                  name="services"
                  value="Pedichiură semipermanentă"
                  onChange={handleCheckBoxChange}
                />
                Pedichiură semipermanentă
              </label>
              <label htmlFor="m&p5">
                <input
                  type="checkbox"
                  id="m&p5"
                  name="services"
                  value="Îndepărtat ojă semi"
                  onChange={handleCheckBoxChange}
                />
                Îndepărtat ojă semi
              </label>
              <label htmlFor="m&p6">
                <input
                  type="checkbox"
                  id="m&p6"
                  name="services"
                  value="Aplicat ojă semi"
                  onChange={handleCheckBoxChange}
                />
                Aplicat ojă semi
              </label>
              <label htmlFor="m&p7">
                <input
                  type="checkbox"
                  id="m&p7"
                  name="services"
                  value="Aplicat gel unghie naturală"
                  onChange={handleCheckBoxChange}
                />
                Aplicat gel unghie naturală
              </label>
              <label htmlFor="m&p8">
                <input
                  type="checkbox"
                  id="m&p8"
                  name="services"
                  value="Construcție gel"
                  onChange={handleCheckBoxChange}
                />
                Construcție gel
              </label>
              <label htmlFor="m&p9">
                <input
                  type="checkbox"
                  id="m&p9"
                  name="services"
                  value="Întreținere gel"
                  onChange={handleCheckBoxChange}
                />
                Întreținere gel
              </label>
              <label htmlFor="m&p10">
                <input
                  type="checkbox"
                  id="m&p10"
                  name="services"
                  value="Aplicat culoare"
                  onChange={handleCheckBoxChange}
                />
                Aplicat culoare
              </label>
              <label htmlFor="m&p11">
                <input
                  type="checkbox"
                  id="m&p11"
                  name="services"
                  value="Model unghie"
                  onChange={handleCheckBoxChange}
                />
                Model unghie
              </label>
              <label htmlFor="m&p12">
                <input
                  type="checkbox"
                  id="m&p12"
                  name="services"
                  value="Parafină manichiură"
                  onChange={handleCheckBoxChange}
                />
                Parafină manichiură
              </label>
              <label htmlFor="m&p13">
                <input
                  type="checkbox"
                  id="m&p13"
                  name="services"
                  value="Parafină pedichiură"
                  onChange={handleCheckBoxChange}
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
      caregiver: 'Personal',
    },
    isValid: true,
  };

  if (!values.title) {
    validation.labels.title = '*Câmp obligatoriu';
    validation.isValid = false;
  }

  if (!values.caregiver) {
    validation.labels.caregiver = '*Câmp obligatoriu';
    validation.isValid = false;
  }

  if (!values.services) {
    validation.labels.services = '*Câmp obligatoriu';
    validation.isValid = false;
  }

  return validation;
}
