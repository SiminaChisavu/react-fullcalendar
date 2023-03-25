# React FullCalendar Application

## Setup and Start

Clone this repo and run `npm install`.

Start the node server for the ReactJS application with `npm start`. The server starts on localhost port 3000

Start the development API server with `npm run start:server`. The server starts on localhost port 3001

## Overview

1. FullCalendar functionality (view, create, update and delete appointments in a full calendar display)
2. Full CRUD on the entity `appointments`:
   - The entity has 7 properties/fields, of different types (text, date, select from a list, checkbox)
   - Viewing, adding, editing and deleting an entity are public.
3. All forms are validated and error messages are displayed to the user where appropriate

Please note that this project is intended for commercial use, and all media files, such as logo and background images, are the property of the project owner. No material contained in this application may be copied, transmitted, or distributed without prior written consent from the owner.

### Home page

In this page are displayed the followings:

1. Navigation meniu
2. CSS text animation

### Agenda

Page which lists all the appointments in FullCalendar

In this page:

1. The FullCalendar supports three view modes: 'Day', 'Week', and 'Month'.
2. In the 'Week' view mode, user can click on the headers of the table to navigate to the 'Day' view for that specific day.
3. A grid of appointments (in cards) is displayed in the FullCalendar, with each card in the grid listing all the details of a single appointment. Also, each card includes an 'edit' and 'delete' button, allowing users to modify or remove an existing appointment.
4. Each card is positioned on the calendar based on the start and end time of the appointment.
5. To create a new appointment, user can click on a specific time or day in the calendar, which will nagivate to the AddAppointment form.
6. In the add form, the date and time picker input is pre-filled with the date and time of the selected slot.
7. The edit button navigates the user to the EditAppointment form.
8. Before deleting the appointment via delete button, the user is prompted with a confirmation modal to confirm the action. If the user declines, the appointment won't be deleted.
9. After the delete succeeds, the confirmation modal will be closed.

### Add appointment

Page which adds a new appointment

1. On this page is displayed a form to add a new appointment
2. User can add an appointment with title, start, end, caregiver, category of services and services
3. Start and end are a date and a time picker
4. The caregiver is a select box
5. The category of services is a select box which contains a set of pre-defined options. However, the options presented to the user will be dynamically filtered based on their selection in the 'caregiver' select box
6. The services are checkboxes. The options presented to the user are determined by the selection in the 'category of services' select box

### Edit appointment

Page which updates an existing appointment

1. On this page is a form similar to the AddAppointment form (same fields). The form is pre-filled with all the correct values from the DB, the user only needs to change them
